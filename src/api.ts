const API_KEY = "d6f3886503ed1a63a64352baf5a2d3d3";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  release_date: number;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetTv {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

interface ITv {
  id: number;
  backdrop_path: string;
  overview: string;
  poster_path: string;
  name: string;
  release_date?: string;
}

export interface IGetMovieDetail {
  adult: boolean;
  backdrop_path: string;
  genres: IGenres[];
  homepage: string;
  id: number;
  production_companies: ICompanies[];
  title: string;
  vote_average: number;
  overview: string;
  poster_path?: string;
  name: string;
  runtime: number;
  number_of_seasons: number;
}

interface ICompanies {
  id: number;
  name: string;
  logo_path: string;
}

interface IGenres {
  id: number;
  name: string;
}

export function allTrending() {
  return fetch(
    `${BASE_PATH}/trending/all/week?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}

export function getMovies() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}

export function topMovies() {
  return fetch(
    `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}
export function upcomingMovie() {
  return fetch(
    `${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=ko-KR&page=5`
  ).then((response) => response.json());
}
export function getMovieDetail(movieId: string) {
  return fetch(
    `${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}
export function getTvDetail(tvId: string) {
  return fetch(
    `${BASE_PATH}/tv/${tvId}?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}
export function similarMovie(movieId: string) {
  return fetch(
    `${BASE_PATH}/movie/${movieId}/similar?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}
export function similarTv(tvId: string) {
  return fetch(
    `${BASE_PATH}/tv/${tvId}/similar?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}

export function getTv() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
export function getPopularTv() {
  return fetch(
    `${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=ko-KR&page=4`
  ).then((response) => response.json());
}
export function getTopRatedTv() {
  return fetch(
    `${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=ko-KR&page=2`
  ).then((response) => response.json());
}

export function searchAll(keyword: string | null) {
  return fetch(
    `${BASE_PATH}/search/multi?api_key=${API_KEY}&language=ko-KR&query=${keyword}`
  ).then((response) => response.json());
}
