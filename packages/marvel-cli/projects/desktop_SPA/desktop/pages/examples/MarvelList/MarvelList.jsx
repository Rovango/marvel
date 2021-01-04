import React from 'react';
import { useFetchMarvelList } from '../redux/hooks';

export default function MarvelListPage() {
  const {
    MarvelList,
    fetchMarvelList,
    fetchMarvelListPending,
    fetchMarvelListError,
  } = useFetchMarvelList();

  const list = MarvelList && MarvelList.data && MarvelList.data.marvelList;
  return (
    <div className="examples-marvel-list-page">
      <h1>Marvel Http API Usage</h1>
      <p>
        This demo shows how to use Redux async actions to fetch data from
        Marvel&apos;s REST API.
      </p>
      <button
        type="button"
        className="btn-fetch-marvel"
        disabled={fetchMarvelListPending}
        onClick={fetchMarvelList}
      >
        {fetchMarvelListPending ? 'Fetching...' : 'Fetch data'}
      </button>
      {fetchMarvelListError && (
        <div className="fetch-list-error">
          Failed to load: {fetchMarvelListError.toString()}
        </div>
      )}
      <Choose>
        <When condition={list}>
          {list.map((item) => (
            <div className="no-items-tip" key={item.id}>
              {item.id} - {item.name}
            </div>
          ))}
        </When>
        <Otherwise>
          <div className="no-items-tip">No items yet.</div>
        </Otherwise>
      </Choose>
    </div>
  );
}
