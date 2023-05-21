import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { Main } from './Main/Main';
import './Search.css';

function Search({ getMovie, page }) {
  return (
    <div className="search-gap">
      <Input onChange={(e) => getMovie(page, true, e)} placeholder="Type to search..." />
      <Main />
    </div>
  );
}

Search.defaultProps = {
  getMovie: Function.prototype,
  page: 1,
};

Search.propTypes = {
  getMovie: PropTypes.func,
  page: PropTypes.number,
};
export { Search };
