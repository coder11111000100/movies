class Service {
  APIKEY = 'api_key=d9e5c099ca8ba6f8195ed4b40ff8ecad';

  BASEURL = 'https://api.themoviedb.org/3/';

  // eslint-disable-next-line class-methods-use-this
  baseGetRequest = async (URL) => {
    const response = await fetch(URL);
    if (response.ok) {
      return response.json();
    }
    return null;
  };

  getSessionId = () => this.baseGetRequest(`${this.BASEURL}authentication/guest_session/new?${this.APIKEY}`);

  getPopularMovies = (pageNumber = 1) =>
    this.baseGetRequest(`${this.BASEURL}movie/popular?${this.APIKEY}&page=${pageNumber}`);

  getGenresMovies = () => this.baseGetRequest(`${this.BASEURL}genre/movie/list?${this.APIKEY}&language=en-US`);

  getSearchMovies = (name, pageNumber = 1) =>
    this.baseGetRequest(`${this.BASEURL}search/movie?${this.APIKEY}&query=${name}&page=${pageNumber}`);

  setRatingMovies = (id, sessionId, rate) => {
    const url = `${this.BASEURL}movie/${id}/rating?${this.APIKEY}&guest_session_id=${sessionId}`;
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({
        value: rate,
      }),
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Возникла проблема: ', err.message);
    });
  };

  getRatedMovies = async (sessionId) =>
    this.baseGetRequest(`${this.BASEURL}guest_session/${sessionId}/rated/movies?${this.APIKEY}`);

  deleteRateMovie = (id, sessionId) => {
    const url = `${this.BASEURL}movie/${id}/rating?${this.APIKEY}&guest_session_id=${sessionId}`;
    return fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
    });
  };
}

export { Service };
