import React from 'react';
import { nanoid } from 'nanoid';
import { Row, Col, Pagination, Spin, Alert } from 'antd';
import { MovieCard } from '../../MovieCard/MovieCard';
import { ErrorComponent } from '../../Error/ErrorComponent';
import { NotFound } from '../../NotFound/NotFound';

function Main({ mainAll }) {
  const { movies, error, loading, page, notFound, changePage, onRating } = mainAll;
  if (error) {
    return <ErrorComponent />;
  }
  if (notFound) {
    return <NotFound />;
  }
  return !loading ? (
    <Row lg={24} justify="space-between" style={{ marginTop: '32px', minWidth: '340px' }} gutter={[24, 24]}>
      {movies.map((movie) => (
        <Col lg={12} span={24} key={nanoid()}>
          <MovieCard movie={movie} onRating={onRating} />
        </Col>
      ))}
      {movies.length < 19 ? null : (
        <Pagination
          style={{ margin: 'auto', marginBottom: '16px' }}
          onChange={(pageNumber) => changePage(pageNumber)}
          // showSizeChanger={false}
          pageSize={1}
          defaultCurrent={1}
          showTotal={false}
          size={10}
          current={page}
          total={movies.length}
        />
      )}
    </Row>
  ) : (
    <Spin tip="Loading...">
      <Alert message="Alert message title" description="Further details about the context of this alert." type="info" />
    </Spin>
  );
}

export { Main };
