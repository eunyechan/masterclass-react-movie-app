import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useParams } from "react-router-dom";
import {
  // allTrending,
  getMovies,
  IGetMoviesResult,
  topMovies,
  upcomingMovie,
  IGetMovieDetail,
  getMovieDetail,
} from "../api";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import Detail from "../Components/Detail";
import noPoster from "../assets/noPoster.jpg";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
  overflow-x: hidden;
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
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const SliderContainer = styled.div`
  margin-top: 8em;
  font-weight: bolder;
`;

const Slider = styled.div`
  position: relative;
  padding-bottom: 13rem;
  &:hover {
    button {
      opacity: 1;
      transition: 0.5s ease;
      background-color: rgba(0, 0, 0, 0.6);
      border: none;
    }
  }
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
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

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
  overflow: visible;
  display: flex;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const AllTrendingMovie = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  margin-bottom: 20px;
`;

const MoviesTitle = styled.h3`
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  color: ${(props) => props.theme.white.lighter};
  margin-top: 100px;
  margin-bottom: 20px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const SliderLeftBtn = styled(motion.button)`
  background-color: transparent;
  height: 12.5rem;
  width: 5rem;
  position: absolute;
  left: 0;
  color: ${(props) => props.theme.white.lighter};
  font-size: 30px;
  font-weight: bold;
  opacity: 0;
`;

const SliderRightBtn = styled(motion.button)`
  background-color: transparent;
  position: absolute;
  height: 12.5rem;
  width: 5rem;
  right: 0;
  color: ${(props) => props.theme.white.lighter};
  font-size: 30px;
  font-weight: bold;
  opacity: 0;
`;

const rowVariants = {
  hidden: (back: boolean) => ({
    x: back ? -window.outerWidth + 5 : window.outerWidth - 5,
  }),
  visible: {
    x: 0,
  },
  exit: (back: boolean) => ({
    x: back ? window.outerWidth - 5 : -window.outerWidth + 5,
  }),
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.3,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

interface RouteParams {
  movieId: string;
  tvId: string;
}

const offset = 6;

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const { movieId, tvId } = useParams() as RouteParams;
  const { data, isLoading: Loading } = useQuery<IGetMovieDetail>(
    ["movie"],
    () => getMovieDetail(movieId)
    // { keepPreviousData: true }
  );
  const { scrollY } = useViewportScroll();
  const { data: allTrendingMovieData, isLoading: TrendingMovieLoading } =
    useQuery<IGetMoviesResult>(["movies", "AllTrending"], getMovies);
  const { data: upcomingMovieData, isLoading: moviesLoading } =
    useQuery<IGetMoviesResult>(["movies", "UpComingmovies"], upcomingMovie);
  const { data: topRateMovieData, isLoading: topRateMoviesLoading } =
    useQuery<IGetMoviesResult>(["movies", "TopMovies"], topMovies);

  const [index, setIndex] = useState(0);
  const [moviesIndex, setmoviesIndex] = useState(0);
  const [topMoviesIndex, settopMoviesIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const [back, setBack] = useState(false);

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const incraseAllTrendingLeftIndex = () => {
    setBack(false);
    if (allTrendingMovieData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = allTrendingMovieData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const incraseAllTrendingRightIndex = () => {
    setBack(true);
    if (allTrendingMovieData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = allTrendingMovieData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  // Movies Btn
  const incraseMoviesLeftIndex = () => {
    setBack(false);
    if (upcomingMovieData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = upcomingMovieData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setmoviesIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const incraseMoviesRightIndex = () => {
    setBack(true);
    if (upcomingMovieData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = upcomingMovieData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setmoviesIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  // // TopRate Movies
  const incraseTopLeftIndex = () => {
    setBack(false);
    if (topRateMovieData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = topRateMovieData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      settopMoviesIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const incraseTopRightIndex = () => {
    setBack(true);
    if (topRateMovieData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = topRateMovieData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      settopMoviesIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };
  const onOverlayClick = () => history.push("/");

  const clickedMovie =
    (bigMovieMatch?.params.movieId &&
      allTrendingMovieData?.results.find(
        (movie) => movie.id === +bigMovieMatch.params.movieId
      )) ||
    (bigMovieMatch?.params.movieId &&
      upcomingMovieData?.results.find(
        (movie) => movie.id === +bigMovieMatch.params.movieId
      )) ||
    (bigMovieMatch?.params.movieId &&
      topRateMovieData?.results.find(
        (movie) => movie.id === +bigMovieMatch.params.movieId
      ));

  const isLoading =
    TrendingMovieLoading || moviesLoading || topRateMoviesLoading;

  const time = data?.runtime;
  const hour = time && Math.floor(time / 60);
  const minutes = time && time % 60;
  console.log(data);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(
              allTrendingMovieData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{allTrendingMovieData?.results[0].title}</Title>
            <Overview>{allTrendingMovieData?.results[0].overview}</Overview>
          </Banner>
          <SliderContainer>
            <AllTrendingMovie>AllTrending Movie</AllTrendingMovie>
            <Slider>
              <AnimatePresence
                custom={back}
                initial={false}
                onExitComplete={toggleLeaving}
              >
                <div key={index}>
                  <Row
                    custom={back}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                  >
                    {allTrendingMovieData?.results
                      .slice(1)
                      .slice(offset * index, offset * index + offset)

                      .map((movie) => (
                        <Box
                          layoutId={movie.id + ""}
                          key={movie.id}
                          whileHover="hover"
                          initial="nomal"
                          variants={boxVariants}
                          onClick={() => onBoxClicked(movie.id)}
                          transition={{ type: "tween" }}
                          bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                        >
                          <Info variants={infoVariants}>
                            <h4>{movie.title}</h4>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                  <SliderLeftBtn onClick={incraseAllTrendingLeftIndex}>
                    &lt;
                  </SliderLeftBtn>
                  <SliderRightBtn onClick={incraseAllTrendingRightIndex}>
                    &gt;
                  </SliderRightBtn>
                </div>
              </AnimatePresence>
            </Slider>

            {/* Movies */}
            <MoviesTitle>Movies</MoviesTitle>
            <Slider>
              <AnimatePresence
                custom={back}
                initial={false}
                onExitComplete={toggleLeaving}
              >
                <div key={moviesIndex}>
                  <Row
                    custom={back}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                  >
                    {upcomingMovieData?.results
                      .slice(1)
                      .slice(
                        offset * moviesIndex,
                        offset * moviesIndex + offset
                      )
                      .map((movie) => (
                        <Box
                          layoutId={movie.id + ""}
                          key={movie.id}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          onClick={() => onBoxClicked(movie.id)}
                          transition={{ type: "tween" }}
                          bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                        >
                          <Info variants={infoVariants}>
                            <h4>{movie.title}</h4>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                  <SliderLeftBtn onClick={incraseMoviesLeftIndex}>
                    &lt;
                  </SliderLeftBtn>
                  <SliderRightBtn onClick={incraseMoviesRightIndex}>
                    &gt;
                  </SliderRightBtn>
                </div>
              </AnimatePresence>
            </Slider>

            {/* TopMovies */}
            <MoviesTitle>Top Movies</MoviesTitle>
            <Slider>
              <AnimatePresence
                custom={back}
                initial={false}
                onExitComplete={toggleLeaving}
              >
                <div key={topMoviesIndex}>
                  <Row
                    custom={back}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                  >
                    {topRateMovieData?.results
                      .slice(1)
                      .slice(
                        offset * topMoviesIndex,
                        offset * topMoviesIndex + offset
                      )
                      .map((movie) => (
                        <Box
                          layoutId={movie.id + ""}
                          key={movie.id}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          onClick={() => onBoxClicked(movie.id)}
                          transition={{ type: "tween" }}
                          bgphoto={makeImagePath(
                            movie.backdrop_path,
                            "w500" || null
                          )}
                        >
                          <Info variants={infoVariants}>
                            <h4>{movie.title}</h4>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                  <SliderLeftBtn onClick={incraseTopLeftIndex}>
                    &lt;
                  </SliderLeftBtn>
                  <SliderRightBtn onClick={incraseTopRightIndex}>
                    &gt;
                  </SliderRightBtn>
                </div>
              </AnimatePresence>
            </Slider>
          </SliderContainer>

          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{
                    top: scrollY.get() + 100,
                    bottom: scrollY.get() + 100,
                  }}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      {/* <Detail /> */}
                      <BigRunTime>
                        {bigMovieMatch
                          ? `${hour}시간 ${minutes}분`
                          : `시즌: ${data?.number_of_seasons}`}
                      </BigRunTime>
                      {/* <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview> */}
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
