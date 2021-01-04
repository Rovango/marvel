import _ from 'lodash';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  EXAMPLES_FETCH_MARVEL_LIST_BEGIN,
  EXAMPLES_FETCH_MARVEL_LIST_SUCCESS,
  EXAMPLES_FETCH_MARVEL_LIST_FAILURE,
  EXAMPLES_FETCH_MARVEL_LIST_DISMISS_ERROR,
} from '@/pages/examples/redux/constants';

import {
  fetchMarvelList,
  dismissFetchMarvelListError,
  reducer,
} from '@/pages/examples/redux/fetchMarvelList';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('examples/redux/fetchMarvelList', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchMarvelList succeeds', () => {
    const list = _.times(10, (i) => ({
      data: {
        id: `${i}`,
        name: `test-${i}`,
      },
    }));
    nock('http://localhost')
      .get('/api/v1/marvelList')
      .reply(200, { data: { marvelList: list } });
    const store = mockStore({ marvelReactjsList: [] });

    return store.dispatch(fetchMarvelList()).then(() => {
      const actions = store.getActions();
      expect(actions[0]).toHaveProperty(
        'type',
        EXAMPLES_FETCH_MARVEL_LIST_BEGIN,
      );
      expect(actions[1]).toHaveProperty(
        'type',
        EXAMPLES_FETCH_MARVEL_LIST_SUCCESS,
      );
    });
  });

  it('dispatches failure action when fetchMarvelList fails', () => {
    nock('http://www.reddit.com/').get('/r/reactjs.json').reply(500, null);
    const store = mockStore({ marvelReactjsList: [] });

    return store.dispatch(fetchMarvelList({ error: true })).catch(() => {
      const actions = store.getActions();
      expect(actions[0]).toHaveProperty(
        'type',
        EXAMPLES_FETCH_MARVEL_LIST_BEGIN,
      );
      expect(actions[1]).toHaveProperty(
        'type',
        EXAMPLES_FETCH_MARVEL_LIST_FAILURE,
      );
      expect(actions[1]).toHaveProperty('data.error', expect.anything());
    });
  });

  it('returns correct action by dismissFetchMarvelListError', () => {
    const expectedAction = {
      type: EXAMPLES_FETCH_MARVEL_LIST_DISMISS_ERROR,
    };
    expect(dismissFetchMarvelListError()).toEqual(expectedAction);
  });

  it('handles action type EXAMPLES_FETCH_MARVEL_LIST_BEGIN correctly', () => {
    const prevState = { fetchMarvelListPending: false };
    const state = reducer(prevState, {
      type: EXAMPLES_FETCH_MARVEL_LIST_BEGIN,
    });
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchMarvelListPending).toBe(true);
  });

  it('handles action type EXAMPLES_FETCH_MARVEL_LIST_SUCCESS correctly', () => {
    const prevState = { fetchMarvelListPending: true };
    const state = reducer(prevState, {
      type: EXAMPLES_FETCH_MARVEL_LIST_SUCCESS,
      data: { data: { children: [] } },
    });
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchMarvelListPending).toBe(false);
  });

  it('handles action type EXAMPLES_FETCH_MARVEL_LIST_FAILURE correctly', () => {
    const prevState = { fetchMarvelListPending: true };
    const state = reducer(prevState, {
      type: EXAMPLES_FETCH_MARVEL_LIST_FAILURE,
      data: { error: new Error('some error') },
    });
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchMarvelListPending).toBe(false);
    expect(state.fetchMarvelListError).toEqual(expect.anything());
  });

  it('handles action type EXAMPLES_FETCH_MARVEL_LIST_DISMISS_ERROR correctly', () => {
    const prevState = { fetchMarvelListError: new Error('some error') };
    const state = reducer(prevState, {
      type: EXAMPLES_FETCH_MARVEL_LIST_DISMISS_ERROR,
    });
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchMarvelListError).toBe(null);
  });
});
