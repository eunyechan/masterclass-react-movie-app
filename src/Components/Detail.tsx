import React from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovieDetail, getTvDetail, IGetDetail } from "../api";
import { makeImagePath } from "../utils";
import noPoster from "../assets/noPoster.jpg";
import { useParams } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";

const Container = styled.div`
  border-radius: 20px;
  height: 100%;
  position: relative;
`;

const BigImage = styled.div`
  display: flex;
  width: 100%;
  height: 500px;
  background-position: center top;
  background-size: cover;
`;

const ContainerInlineBox = styled.div`
  position: relative;
  padding: 20px;
  top: -60px;
`;

const Loader = styled.div`
  height: 100%;
  width: 100%;
`;

const BigHeader = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BigTitle = styled.h2`
  font-size: 32px;
  color: ${(props) => props.theme.white.lighter};
`;

const BigRate = styled.div`
  font-size: 15px;
  font-weight: bold;
  color: #f3ef17;
`;

const BigOverView = styled.p`
  padding: 20px 0px 40px 0px;
  position: relative;
  font-size: 14px;
  color: ${(props) => props.theme.white.lighter};
`;

const BigRunTimeGenresBox = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 0px;
`;

const BigRunTime = styled.span`
  padding: 5px 5px;
  position: relative;
  border-radius: 5px;
  font-weight: bold;
  color: ${(props) => props.theme.white.lighter};
`;

const BigGenres = styled.ul`
  display: flex;
  position: relative;
`;

const BigRelease = styled.span`
  padding: 20px 5px;
  border-radius: 5px;
  font-weight: bold;
  color: ${(props) => props.theme.white.lighter};
`;

const BigReleaseDate = styled.span`
  background-color: rgba(238, 205, 116, 0.7);
  border-radius: 5px;
  margin-left: 5px;
  padding: 5px;
`;

const Genre = styled.li`
  margin-left: 5px;
  margin-right: 5px;
  font-size: 17px;
  font-weight: bold;
  border-radius: 5px;
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
  width: 100%;
  padding-top: 20px;
`;

const CompanyInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border-radius: 10px;
`;

const CompanyLogo = styled.div<{ bgPhoto: string }>`
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  width: 60px;
  height: 60px;
  /* border-radius: 50%; */
  margin: 5px 0px;
`;

const CompanyName = styled.span`
  font-size: 12px;
  font-weight: bold;
  color: white;
`;

const CompanyTitle = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: white;
  border-radius: 5px;
  margin-top: 20px;
  padding: 5px 5px;
  background-color: rgba(92, 139, 143, 0.7);
  font-weight: bold;
`;

const OverViewSpan = styled.span`
  opacity: 0.3;
`;

interface RouteParams {
  movieId: string;
  tvId: string;
}
const Detail = () => {
  const { movieId, tvId } = useParams() as RouteParams;

  const { data, isLoading: movieLoading } = useQuery<IGetDetail>(
    ["movieDetail"],
    () => (movieId ? getMovieDetail(movieId) : getTvDetail(tvId)),
    { keepPreviousData: true }
  );

  return (
    <>
      {movieLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <Container>
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
          <ContainerInlineBox>
            <HelmetProvider>
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
            </HelmetProvider>

            <BigHeader>
              <BigTitle>{movieId ? data?.title : data?.name}</BigTitle>
              <BigRate>{`⭐ ${data && data?.vote_average}`}</BigRate>
            </BigHeader>
            <BigOverView>{data && data?.overview}</BigOverView>
            <BigRunTimeGenresBox>
              <span style={{ marginRight: "5px" }}>overview</span>
              <OverViewSpan>|</OverViewSpan>
              <BigGenres>
                {data &&
                  data?.genres.map((genre) => (
                    <Genre key={genre.id}>{genre.name}</Genre>
                  ))}
              </BigGenres>
              <OverViewSpan>|</OverViewSpan>
              <BigRunTime>
                {movieId
                  ? `runtime: ${data?.runtime}`
                  : `runtime: ${data?.episode_run_time}`}
              </BigRunTime>
            </BigRunTimeGenresBox>

            <BigRelease>
              {movieId ? (
                <span>
                  relaseDate:
                  <BigReleaseDate>{data?.release_date}</BigReleaseDate>
                </span>
              ) : (
                <span>
                  firstAirDate:
                  <BigReleaseDate>{data?.first_air_date}</BigReleaseDate>
                </span>
              )}
            </BigRelease>

            <CompanyTitle>Production company</CompanyTitle>
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
          </ContainerInlineBox>
        </Container>
      )}
    </>
  );
};

export default Detail;
