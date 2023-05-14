import React from 'react';
import { Input } from 'antd';
import { Main } from './Main/Main';
import './Search.css';
import { Consumer } from '../ServiceContext/ServiceContext';

function Search() {
  return (
    <Consumer>
      {({ getMovie, getResurs, ...arg }) => (
        <div className="search-gap">
          <Input
            onChange={(e) => {
              if (e.target.value.trim() !== '' || e.target.value === ' ') getMovie(1, true, e.target.value);
              else getResurs(1, false, '');
            }}
            placeholder="Type to search..."
          />
          <Main mainAll={arg} />
        </div>
      )}
    </Consumer>
  );
}

export { Search };
