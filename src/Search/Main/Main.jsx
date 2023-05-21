import React from 'react';
import { nanoid } from 'nanoid';
import { Row, Col, Pagination, Spin, Alert } from 'antd';
import { MovieCard } from '../../MovieCard/MovieCard';
import { ErrorComponent } from '../../Error/ErrorComponent';
import { NotFound } from '../../NotFound/NotFound';
import { Consumer } from '../../ServiceContext/ServiceContext';

function Main() {
  return (
    <Consumer>
      {({
        movies = new Map(),
        error = false,
        loading = true,
        page = 1,
        notFound = false,
        changePage = Function.prototype,
        onRating = Function.prototype,
      }) => {
        if (error) {
          return <ErrorComponent />;
        }
        if (notFound) {
          return <NotFound />;
        }
        const pageMovies = movies.get(page);
        return !loading ? (
          <Row lg={24} justify="space-between" style={{ marginTop: '32px', minWidth: '340px' }} gutter={[24, 24]}>
            {pageMovies.map((movie) => (
              <Col style={{ paddingTop: 0, paddingBottom: 0 }} lg={12} span={24} key={nanoid()}>
                <MovieCard movie={movie} onRating={onRating} />
              </Col>
            ))}
            {movies.length < 19 ? null : (
              <Pagination
                style={{ margin: 'auto', marginBottom: '16px' }}
                onChange={(pageNumber) => changePage(pageNumber)}
                pageSize={1}
                defaultCurrent={1}
                current={page}
                total={pageMovies.length}
              />
            )}
          </Row>
        ) : (
          <Spin tip="Loading...">
            <Alert
              message="Alert message title"
              description="Further details about the context of this alert."
              type="info"
            />
          </Spin>
        );
      }}
    </Consumer>
  );
}

export { Main };
