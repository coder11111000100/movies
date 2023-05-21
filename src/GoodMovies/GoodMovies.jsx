import React from 'react';
import { nanoid } from 'nanoid';
import { Row, Col, Pagination } from 'antd';
import { MovieCard } from '../MovieCard/MovieCard';
import { Consumer } from '../ServiceContext/ServiceContext';

function GoodMovies() {
  return (
    <Consumer>
      {({ onRating = Function.prototype, goodsChangePage = Function.prototype, goodsPage = 1, retedMovies = [] }) => {
        const map = new Map(JSON.parse(localStorage.getItem('reted'))).keys();
        const keyArrayId = [...map];

        const copyMovies = [...retedMovies];

        const startIndex = goodsPage === 1 ? 0 : (goodsPage - 1) * 20;
        const lastIndex = startIndex + 20 >= copyMovies.length ? copyMovies.length : startIndex + 20;
        const slicesMovies = copyMovies.slice(startIndex, lastIndex);
        return (
          <Row lg={24} justify="space-between" style={{ marginTop: '32px', minWidth: '340px' }} gutter={[24, 24]}>
            {slicesMovies.map((movie) => {
              const m = keyArrayId.filter((id) => id === movie.id);
              if (m.length) {
                return (
                  <Col lg={12} span={24} key={nanoid()}>
                    <MovieCard movie={movie} onRating={onRating} />
                  </Col>
                );
              }
              return null;
            })}

            {keyArrayId.length < 20 ? null : (
              <Pagination
                style={{ margin: 'auto', marginBottom: '16px' }}
                onChange={(pageNumber) => goodsChangePage(pageNumber)}
                pageSize={1}
                defaultCurrent={1}
                current={goodsPage}
                total={5}
              />
            )}
          </Row>
        );
      }}
    </Consumer>
  );
}

export { GoodMovies };
