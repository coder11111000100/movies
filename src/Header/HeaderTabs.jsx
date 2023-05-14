import React from 'react';
import { Tabs } from 'antd';
import { Search } from '../Search/Search';
import { GoodMovies } from '../GoodMovies/GoodMovies';
import { NotFoundError } from '../NotFound/NotFoundError';
import './Header.css';
import { Service } from '../Service/Service';
import { Provider } from '../ServiceContext/ServiceContext';

class HeaderTabs extends React.Component {
  service = new Service();

  constructor() {
    super();
    this.state = {
      movies: [],
      page: 1,
      loading: true,
      error: false,
      notFound: false,
    };
  }

  componentDidMount() {
    const pushGetIdSession = () => {
      this.service.getSessionId().then((session) => {
        if (session.success) {
          localStorage.setItem('guest_session_id', session.guest_session_id);
        } else {
          throw new Error('no guest_session_id');
        }
      });
    };
    this.getResurs();
    if (!localStorage.getItem('guest_session_id')) {
      pushGetIdSession();
    }
  }

  componentWillUnmount() {
    localStorage.clear();
  }

  onAlertShowBlock = (err) => {
    this.setState({ error: true });
    throw new Error(err);
  };

  onNotFound = () => {
    this.setState({ notFound: true });
  };

  getResurs = (pageNumber = 1, key = false, value = '') => {
    this.setState({ loading: true });
    const findGenresName = (ids = [], ganre = []) => {
      const genresName = [];
      ids.forEach((id) => {
        for (let i = 0; i < ganre.length; i++) {
          if (ganre[i].id === id) {
            genresName.push(ganre[i].name);
            break;
          }
        }
      });
      return genresName;
    };

    const movieList = key ? this.service.getSearchMovies(value) : this.service.getPopularMovies(pageNumber);
    const genreList = this.service.getGenresMovies();

    Promise.all([movieList, genreList])
      .then((data) => {
        if (data[0].results.length === 0) {
          throw new NotFoundError();
        }
        return data;
      })
      .then((data) => {
        const [movieL, genreL] = data;
        const objArrayMovie = movieL.results.map((movie) => {
          const { release_date: date, poster_path: img, title, id, overview: description } = movie;
          const v = new Map(JSON.parse(localStorage.getItem('reted'))).get(id);
          return {
            id,
            date,
            title,
            rate: Math.floor(movie.vote_average),
            genres: findGenresName(movie.genre_ids, genreL.genres),
            img,
            rateValue: v || 0,
            description,
          };
        });

        this.setState({
          movies: objArrayMovie,
          loading: false,
          error: false,
          page: pageNumber,
          notFound: false,
        });
      })
      .catch((error) => {
        if (error.name === 'NotFoundError') {
          this.onNotFound();
        } else {
          this.onAlertShowBlock(error);
        }
      });
  };

  // eslint-disable-next-line react/sort-comp, class-methods-use-this
  decoratorOverService = (f) => {
    let timer;
    const debounc = (func, debounceTime) => {
      // eslint-disable-next-line func-names
      return function (arg) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          func.apply(this, arg);
        }, debounceTime);
      };
    };
    // eslint-disable-next-line func-names
    return function (...arg) {
      debounc(f, 1000)(arg);
    };
  };

  getMovie = this.decoratorOverService(this.getResurs);

  changePage = (pageNumber) => {
    this.setState({ loading: true });
    this.getResurs(pageNumber);
  };

  onRating = (_id, value) => {
    const sessionId = localStorage.getItem('guest_session_id');
    let reted = JSON.parse(localStorage.getItem('reted'));
    let map;
    if (!reted) {
      localStorage.setItem('reted', JSON.stringify([[_id, value]]));
      reted = JSON.parse(localStorage.getItem('reted'));
    }
    // eslint-disable-next-line prefer-const
    map = new Map(reted);

    const recordingData = () => {
      if (value === 0) {
        map.delete(_id);
      } else {
        map.set(_id, value);
      }
      localStorage.setItem('reted', JSON.stringify([...map]));
      this.setState((pre) => {
        const { movies } = pre;
        const updateMovies = movies.map((movie) => {
          if (movie.id === _id) {
            return {
              ...movie,
              rateValue: value,
            };
          }
          return movie;
        });
        return {
          movies: updateMovies,
        };
      });
    };

    if (value === 0) {
      this.service.deleteRateMovie(_id, sessionId).then((response) => {
        if (response.ok) {
          recordingData();
        }
      });
    }

    if ((map.has(_id) && map.get(_id) !== value && value !== 0) || !map.has(_id)) {
      this.service.setRatingMovies(_id, sessionId, value).then((response) => {
        if (response.ok) {
          recordingData();
        }
      });
    }
  };

  render() {
    const { movies, error, notFound, page, loading } = this.state;
    const s = {
      onAlertShowBlock: this.onAlertShowBlock,
      changePage: this.changePage,
      getMovie: this.getMovie,
      onRating: this.onRating,
      getResurs: this.getResurs,
      movies,
      error,
      notFound,
      page,
      loading,
    };
    return (
      <div className="container">
        <Provider value={s}>
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: '1',
                label: `Search`,
                children: <Search />,
              },
              {
                key: '2',
                label: `Rated`,
                children: <GoodMovies />,
              },
            ]}
            centered
            state={this.state}
            tabBarStyle={{ margin: 'auto', marginTop: '32px' }}
          />
        </Provider>
      </div>
    );
  }
}
export { HeaderTabs };
