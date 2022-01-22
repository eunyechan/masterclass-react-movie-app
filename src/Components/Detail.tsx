import React from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovieDetail, getTvDetail, IGetMovieDetail } from "../api";
import { makeImagePath } from "../utils";
import noPoster from "../assets/noPoster.jpg";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

const Container = styled.div`
  border-radius: 20px;
  height: 100%;
`;
const BigImage = styled.div`
  width: 100%;
  height: 500px;
  background-position: center top;
  background-size: cover;
`;
const Loader = styled.div`
  height: 100%;
  width: 100%;
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
  const { movieId, tvId } = useParams() as RouteParams;

  const { data, isLoading: movieLoading } = useQuery<IGetMovieDetail>(
    ["movieDetail"],
    () => (movieId ? getMovieDetail(movieId) : getTvDetail(tvId)),
    { keepPreviousData: true }
  );

  const time = data?.runtime;
  const hour = time && Math.floor(time / 60);
  const minutes = time && time % 60;

  return (
    <>
      {movieLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <Container>
          <Helmet>
            <title>
              {movieId ? (
                data?.title
              ) : movieLoading ? (
                <Loader>Loading...</Loader>
              ) : (
                data?.name
              )}
            </title>
          </Helmet>
          <BigImage
            style={{
              backgroundImage: data?.backdrop_path
                ? `linear-gradient(to top,black, transparent), url(${makeImagePath(
                    data.backdrop_path
                  )})`
                : data?.poster_path
                ? `linear-gradient(to top,black, transparent), url(${makeImagePath(
                    data.poster_path
                  )})`
                : noPoster,
            }}
          />
          <BigHeader>
            <BigTitle>{movieId ? data?.title : data?.name}</BigTitle>
            <BigRate>{`⭐️ ${data && data?.vote_average}`}</BigRate>
          </BigHeader>
          <BigOverView>{data && data?.overview}</BigOverView>
          <BigRunTime>
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
          <CompanyTitle>제작사</CompanyTitle>
          <BigCompany>
            {data &&
              data?.production_companies?.map((company, index) => (
                <CompanyInfo key={index}>
                  <CompanyLogo
                    bgPhoto={
                      company.logo_path
                        ? makeImagePath(company.logo_path, "w500")
                        : noPoster
                    }
                  ></CompanyLogo>
                  <CompanyName>{company.name}</CompanyName>
                </CompanyInfo>
              ))}
          </BigCompany>
        </Container>
      )}
    </>
  );
};

export default Detail;
