import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { getMovieDetail, getTvDetail, IGetMovieDetail } from "../api";

const Container = styled.div`
  border-radius: 20px;
  height: 100%;
`;

interface RouteParams {
  movieId: string;
  tvId: string;
}

const MovieDetail = () => {
  // const { movieId, tvId } = useParams() as RouteParams;

  // const { data, isLoading } = useQuery<IGetMovieDetail>(
  //   ["movieDetail"],
  //   () => (movieId ? getMovieDetail(movieId) : getTvDetail(tvId)),
  //   { keepPreviousData: true }
  // );

  // const time = data?.runtime;
  // const hour = time && Math.floor(time / 60);
  // const minutes = time && time % 60;

  return (
    <>
      <h2>sdf</h2>
    </>
  );
};
export default MovieDetail;
