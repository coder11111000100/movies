import React from 'react';
import { nanoid } from 'nanoid';
import { Row, Col, Pagination } from 'antd';
import { MovieCard } from '../MovieCard/MovieCard';
import { Consumer } from '../ServiceContext/ServiceContext';

function GoodMovies() {
  let count = 0;
  const map = new Map(JSON.parse(localStorage.getItem('reted'))).keys();
  const keyArrayId = [...map];
  return (
    <Consumer>
      {({ onRating, movies }) => {
        return (
          <Row lg={24} justify="space-between" style={{ marginTop: '32px', minWidth: '340px' }} gutter={[24, 24]}>
            {movies.map((movie) => {
              count = keyArrayId.length;
              const m = keyArrayId?.filter((id) => id === movie.id);
              if (m.length) {
                return (
                  <Col lg={12} span={24} key={nanoid()}>
                    <MovieCard movie={movie} onRating={onRating} />
                  </Col>
                );
              }
              return null;
            })}
            {count < 20 ? null : (
              <Pagination
                style={{ margin: 'auto', marginBottom: '16px' }}
                //   onChange={pageNumber => changePage(pageNumber)}
                // showSizeChanger={false}
                pageSize={1}
                defaultCurrent={1}
                //   current={page}
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
