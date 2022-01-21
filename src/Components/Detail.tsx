import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { getMovieDetail, getTvDetail, IGetMovieDetail } from "../api";
import { useRouteMatch, useHistory } from "react-router-dom";
import { makeImagePath } from "../utils";
import { Helmet } from "react-helmet";
import noPoster from "../assets/noPoster.jpg";

const Container = styled.div`
  border-radius: 20px;
  height: 100%;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow-y: scroll;
  background-color: ${(props) => props.theme.black.lighter};
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BigCover = styled.div`
  width: 100%;
  height: 500px;
  background-position: center top;
  background-size: cover;
`;
const BigHeader = styled.div`
  padding: 20px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  top: -60px;
`;
const BigTitle = styled.h3`
  border: 15px solid white;
  font-size: 30px;
  color: ${(props) => props.theme.white.lighter};
`;
const BigRate = styled.div`
  font-size: 15px;
  font-weight: bold;
  color: red;
`;
const BigOverView = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  font-size: 14px;
  color: ${(props) => props.theme.white.lighter};
`;
const BigRunTime = styled.span`
  margin: 20px;
  padding: 5px 5px;
  position: relative;
  border-radius: 5px;
  font-weight: bold;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
  background-color: #fbc531;
`;
const BigGenres = styled.ul`
  display: flex;
  position: relative;
  top: -80px;
  padding: 20px;
`;
const Genre = styled.li`
  margin-right: 10px;
  background-color: red;
  font-size: 17px;
  font-weight: bold;
  border-radius: 5px;
  padding: 5px 5px;
  transition: all 0.3s linear;
  cursor: pointer;
  &:hover {
    color: black;
    background-color: white;
  }
`;

const BigCompany = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 20px;
  width: 100%;
`;
const CompanyInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: darkgray;
  border-radius: 10px;
`;
const CompanyLogo = styled.div<{ bgPhoto: string }>`
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 5px 0px;
`;
const CompanyName = styled.span`
  font-size: 12px;
  font-weight: bold;
  color: white;
`;
const CompanyTitle = styled.span`
  font-size: 18px;
  color: white;
  border-radius: 5px;
  margin: 0px 20px;
  padding: 5px 5px;
  background-color: #269251;
  font-weight: bold;
`;

interface RouteParams {
  movieId: string;
  tvId: string;
}

const Detail = () => {
  const history = useHistory();
  const { movieId, tvId } = useParams() as RouteParams;
  const { scrollY } = useViewportScroll();
  const onOverlayClick = () => history.push("/");

  // console.log(movieId);

  const { data, isLoading } = useQuery<IGetMovieDetail>(
    ["movieDetail"],
    () => getMovieDetail(movieId),
    { keepPreviousData: true }
  );

  const [index, setIndex] = useState(0);
  // const { data: tvData, isLoading: tvLoading } = useQuery<IGetTvDetail>(
  //   ["getTvDetail"],
  //   () => (movieId ? getMovieDetail(movieId) : getTvDetail(tvId)),
  //   { keepPreviousData: true }
  // );

  const time = data?.runtime;
  const hour = time && Math.floor(time / 60);
  const minutes = time && time % 60;

  return (
    <>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <Container>
          {/* <BigRunTime>
            {movieId
              ? `${hour}시간 ${minutes}분`
              : `시즌: ${data?.number_of_seasons}`}
          </BigRunTime> */}
          {/* <BigCover
              style={{
                backgroundImage: data?.backdrop_path
                  ? `linear-gradient(to top,black, transparent), url(${makeImagePath(
                      data.backdrop_path
                    )})`
                  : noPoster,
              }}
            ></BigCover>
            <BigCover>{data?.title}</BigCover> */}
          {/* <title>asd{console.log(data?.name)}</title> */}
          {/* <BigHeader>
            <BigTitle>{movieId ? data?.title : data?.name}</BigTitle>
            <BigRate>{`⭐️ ${data && data?.vote_average}`}</BigRate>
          </BigHeader>
          <BigOverView>sdf{console.log(data?.name)}</BigOverView> */}
          {/* <BigRunTime>
            {movieId
              ? `${hour}시간 ${minutes}분`
              : `시즌: ${data?.number_of_seasons}`}
          </BigRunTime>
          <BigGenres>
            {data &&
              data?.genres.map((genre) => (
                <Genre key={genre.id}>{genre.name}</Genre>
              ))}
          </BigGenres>
          <CompanyTitle>제작사</CompanyTitle> */}
          {/* <BigCompany>
            {data &&
              data?.production_companies?.map((company, index) => (
                <CompanyInfo>
                  <CompanyLogo
                    key={index}
                    bgPhoto={
                      company.logo_path
                        ? makeImagePath(company.logo_path, "w500")
                        : noPoster
                    }
                  ></CompanyLogo>
                  <CompanyName>{company.name}</CompanyName>
                </CompanyInfo>
              ))}
          </BigCompany> */}
        </Container>
      )}
    </>
  );
};
export default Detail;
