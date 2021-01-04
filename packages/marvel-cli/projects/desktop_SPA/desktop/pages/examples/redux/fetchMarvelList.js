import axios from 'axios';
import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  EXAMPLES_FETCH_MARVEL_LIST_BEGIN,
  EXAMPLES_FETCH_MARVEL_LIST_SUCCESS,
  EXAMPLES_FETCH_MARVEL_LIST_FAILURE,
  EXAMPLES_FETCH_MARVEL_LIST_DISMISS_ERROR,
} from './constants';

// Bybit-marvel uses redux-thunk for async actions by default: https://github.com/gaearon/redux-thunk
// If you prefer redux-saga, please wait for the bybit-plugin-redux-saga in the future
export function fetchMarvelList() {
  return (dispatch) => {
    // optionally you can have getState as the second argument
    dispatch({
      type: EXAMPLES_FETCH_MARVEL_LIST_BEGIN,
    });

    // Return a promise so that you could control UI flow without states in the store.
    // For example: after submit a form, you need to redirect the page to another when succeeds or show some errors message if fails.
    // It's hard to use state to manage it, but returning a promise allows you to easily achieve it.
    // e.g.: handleSubmit() { this.props.actions.submitForm(data).then(()=> {}).catch(() => {}); }
    const promise = new Promise((resolve, reject) => {
      // doRequest is a placeholder Promise. You should replace it with your own logic.
      // args.error here is only for test coverage purpose.
      const doRequest = axios.get('/api/v1/marvelList');

      doRequest.then(
        (res) => {
          dispatch({
            type: EXAMPLES_FETCH_MARVEL_LIST_SUCCESS,
            data: res.data,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: EXAMPLES_FETCH_MARVEL_LIST_FAILURE,
            data: { error: err },
          });
          reject(err);
        },
      );
    });

    return promise;
  };
}

// Async action saves request error by default, this method is used to dismiss the error info.
// If you don't want errors to be saved in Redux store, just ignore this method.
export function dismissFetchMarvelListError() {
  return {
    type: EXAMPLES_FETCH_MARVEL_LIST_DISMISS_ERROR,
  };
}

export function useFetchMarvelList() {
  // args: false value or array
  // if array, means args passed to the action creator
  const dispatch = useDispatch();

  const {
    MarvelList,
    fetchMarvelListPending,
    fetchMarvelListError,
  } = useSelector(
    (state) => ({
      MarvelList: state.examples.MarvelList,
      fetchMarvelListPending: state.examples.fetchMarvelListPending,
      fetchMarvelListError: state.examples.fetchMarvelListError,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(() => {
    dispatch(fetchMarvelList());
  }, [dispatch]);

  const boundDismissFetchMarvelListError = useCallback(() => {
    dispatch(dismissFetchMarvelListError());
  }, [dispatch]);

  return {
    MarvelList,
    fetchMarvelList: boundAction,
    fetchMarvelListPending,
    fetchMarvelListError,
    dismissFetchMarvelListError: boundDismissFetchMarvelListError,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case EXAMPLES_FETCH_MARVEL_LIST_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchMarvelListPending: true,
        fetchMarvelListError: null,
      };

    case EXAMPLES_FETCH_MARVEL_LIST_SUCCESS:
      // The request is success
      return {
        ...state,
        // MarvelList: action.data.data.children,
        MarvelList: action.data,

        fetchMarvelListPending: false,
        fetchMarvelListError: null,
      };

    case EXAMPLES_FETCH_MARVEL_LIST_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchMarvelListPending: false,
        fetchMarvelListError: action.data.error,
      };

    case EXAMPLES_FETCH_MARVEL_LIST_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchMarvelListError: null,
      };

    default:
      return state;
  }
}
