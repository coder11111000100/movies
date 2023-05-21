/* eslint-disable no-nested-ternary */
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
      movies: new Map(),
      retedMovies: [],
      fromSearch: '',
      page: 1,
      goodsPage: 1,
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
    if (!localStorage.getItem('guest_session_id')) {
      pushGetIdSession();
    }
    this.getResurs();
    this.getResurs(1, false, '', true);
    // this.service.getRatedMovies(localStorage.getItem('guest_session_id')).then((data) => {
    //   console.log(data);
    // });
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

  getResurs = (pageNumber = 1, key = false, value = '', hasMount = false) => {
    this.setState({ loading: true, fromSearch: value });
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

    const movieList = key
      ? this.service.getSearchMovies(value, pageNumber)
      : hasMount
      ? this.service.getRatedMovies(localStorage.getItem('guest_session_id'))
      : this.service.getPopularMovies(pageNumber);
    const genreList = this.service.getGenresMovies();

    Promise.all([movieList, genreList])
      .then((data) => {
        if (data[0].results.length === 0 && hasMount === false) {
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

        this.setState((pre) => {
          const { movies, retedMovies } = pre;
          const pageArrayMovies = new Map(movies);
          pageArrayMovies.set(pageNumber, objArrayMovie);
          const storegIds = [...new Map(JSON.parse(localStorage.getItem('reted'))).keys()];
          const filtreObjArrayMovie = objArrayMovie.filter((item) => storegIds.includes(item.id));
          const uniqueMovies = [...retedMovies, ...filtreObjArrayMovie].filter(
            (v, index, self) => self.findIndex((item) => item.id === v.id) === index
          );

          return {
            movies: hasMount ? movies : pageArrayMovies,
            retedMovies: hasMount ? [...uniqueMovies] : key ? [...uniqueMovies] : [...retedMovies],
            loading: false,
            error: false,
            page: pageNumber,
            notFound: false,
          };
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
    return (...arg) => {
      const [page, key, e] = arg;
      if (e.target.value.trim() !== '' || e.target.value === ' ') {
        debounc(f, 1000)([page, key, e.target.value]);
      } else {
        this.getResurs(page, false, '');
      }
    };
  };

  getMovie = this.decoratorOverService(this.getResurs);

  onRating = (_id, value) => {
    const sessionId = localStorage.getItem('guest_session_id');
    const reted = JSON.parse(localStorage.getItem('reted'));
    let map;

    const recordingData = () => {
      const r = JSON.parse(localStorage.getItem('reted'));
      if (!r) {
        localStorage.setItem('reted', JSON.stringify([[_id, value]]));
      }
      // eslint-disable-next-line prefer-const
      map = new Map(r);
      if (value === 0) {
        map.delete(_id);
      } else {
        map.set(_id, value);
      }
      localStorage.setItem('reted', JSON.stringify([...map]));
      this.setState((pre) => {
        const { movies, page, retedMovies } = pre;
        const pageArrayMovies = new Map(movies);

        const moviesArr = pageArrayMovies.get(page);
        const ratedFilm = [];
        const updateMovies = moviesArr.map((movie) => {
          if (movie.id === _id && movie.value !== 0) {
            ratedFilm.push({
              ...movie,
              rateValue: value,
            });
            return {
              ...movie,
              rateValue: value,
            };
          }
          return movie;
        });
        pageArrayMovies.set(page, updateMovies);
        let resultsFilms = [];
        if (retedMovies.length) {
          resultsFilms = [...ratedFilm, ...retedMovies];
        } else {
          resultsFilms = ratedFilm;
        }

        const uniqueMovies = resultsFilms.filter(
          (v, index, self) => self.findIndex((item) => item.id === v.id) === index
        );

        return {
          movies: pageArrayMovies,
          retedMovies: uniqueMovies,
        };
      });
    };

    if (!reted) {
      this.service.setRatingMovies(_id, sessionId, value).then((response) => {
        if (response.ok) {
          recordingData();
        }
      });
    }
    // eslint-disable-next-line prefer-const
    map = new Map(reted);

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

  changePage = (pageNumber) => {
    const { fromSearch } = this.state;
    this.setState({ loading: true });
    if (fromSearch) {
      this.getResurs(pageNumber, true, fromSearch);
    } else {
      this.getResurs(pageNumber);
    }
  };

  goodsChangePage = (pageNumber) => {
    this.setState({ goodsPage: pageNumber });
  };

  render() {
    const { movies, retedMovies, error, notFound, page, loading, goodsPage } = this.state;
    const s = {
      onAlertShowBlock: this.onAlertShowBlock,
      changePage: this.changePage,
      onRating: this.onRating,
      goodsChangePage: this.goodsChangePage,
      goodsPage,
      retedMovies,
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
                children: <Search getMovie={this.getMovie} page={page} />,
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
