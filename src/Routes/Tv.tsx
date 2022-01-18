import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { getPopularTv, getTopRatedTv, getTv, IGetTv } from "../api";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import noPoster from "../assets/noPoster.jpg";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
  overflow-x: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
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
  display: flex;
  flex-direction: column;
  margin-top: 8em;
  font-weight: bolder;
`;

const SliderInlineBox = styled.div`
  position: relative;
  margin-top: 30px;
  margin-bottom: 160px;
`;

const Slider = styled.div`
  position: relative;
  &:hover {
    button {
      opacity: 1;
      transition: 0.5s ease;
      background-color: rgba(0, 0, 0, 0.6);
      border: none;
    }
  }
`;

const PopSlider = styled.div`
  position: relative;
  &:hover {
    button {
      opacity: 1;
      transition: 0.5s ease;
      background-color: rgba(0, 0, 0, 0.6);
      border: none;
    }
  }
`;

const TopSlider = styled.div`
  position: relative;
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

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-image: url(${(props) => props.bgPhoto});
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

const BigTv = styled(motion.div)`
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

const TodayTvTitle = styled.h3`
  /* color: ${(props) => props.theme.white.lighter}; */
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  color: ${(props) => props.theme.white.lighter};

  margin-bottom: 20px;
`;

const PopTvTitle = styled.h3`
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

const offset = 6;

function Tv() {
  const history = useHistory();
  const bigTvMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");
  const { scrollY } = useViewportScroll();
  const { data: todayTvData, isLoading: todayTvLoading } = useQuery<IGetTv>(
    ["tv", "allTrending"],
    getTv
  );
  const { data: popularTvData, isLoading: popularTvLoading } = useQuery<IGetTv>(
    ["tv", "PopularTv"],
    getPopularTv
  );
  const { data: topRateTvData, isLoading: topRateTvLoading } = useQuery<IGetTv>(
    ["tv", "TopTv"],
    getTopRatedTv
  );

  const [todayTvindex, setTodayTvIndex] = useState(0);
  const [popTvindex, setPopTvIndex] = useState(0);
  const [topTvindex, setTopTvIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);

  const incraseTodayLeftIndex = () => {
    setBack(false);
    if (todayTvData) {
      if (leaving) return;
      toggleLeaving();
      const totalTv = todayTvData.results.length - 1;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      setTodayTvIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const incraseTodayRightIndex = () => {
    setBack(true);
    if (todayTvData) {
      if (leaving) return;
      toggleLeaving();
      const totalTv = todayTvData.results.length - 1;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      setTodayTvIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  // PopTv Btn
  const incrasePopLeftIndex = () => {
    setBack(false);
    if (popularTvData) {
      if (leaving) return;
      toggleLeaving();
      const totalTv = popularTvData.results.length - 1;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      setPopTvIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const incrasePopRightIndex = () => {
    setBack(true);
    if (popularTvData) {
      if (leaving) return;
      toggleLeaving();
      const totalTv = popularTvData.results.length - 1;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      setPopTvIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const incraseTopLeftIndex = () => {
    setBack(false);
    if (topRateTvData) {
      if (leaving) return;
      toggleLeaving();
      const totalTv = topRateTvData.results.length - 1;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      setTopTvIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const incraseTopRightIndex = () => {
    setBack(true);
    if (topRateTvData) {
      if (leaving) return;
      toggleLeaving();
      const totalTv = topRateTvData.results.length - 1;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      setTopTvIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onBoxClicked = (tvId: number) => {
    history.push(`/tv/${tvId}`);
  };
  const onOverlayClick = () => history.push("/tv");
  const clickedTv =
    bigTvMatch?.params.tvId &&
    todayTvData?.results.find((tv) => tv.id === +bigTvMatch.params.tvId);

  const isLoading = todayTvLoading || popularTvLoading || topRateTvLoading;

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(todayTvData?.results[0].backdrop_path || "")}
          >
            <Title>{todayTvData?.results[0].name}</Title>
            <Overview>{todayTvData?.results[0].overview}</Overview>
          </Banner>
          <SliderContainer>
            <TodayTvTitle>Today TV</TodayTvTitle>
            <SliderInlineBox>
              <Slider>
                <AnimatePresence
                  custom={back}
                  initial={false}
                  onExitComplete={toggleLeaving}
                >
                  <Row
                    custom={back}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                    key={todayTvindex}
                  >
                    {todayTvData?.results
                      .slice(1)
                      .slice(
                        offset * todayTvindex,
                        offset * todayTvindex + offset
                      )
                      .map((tv) => (
                        <>
                          <Box
                            layoutId={tv.id + ""}
                            key={tv.id}
                            whileHover="hover"
                            initial="normal"
                            variants={boxVariants}
                            onClick={() => onBoxClicked(tv.id)}
                            transition={{ type: "tween" }}
                            bgPhoto={
                              tv.backdrop_path
                                ? makeImagePath(tv.backdrop_path, "w500")
                                : tv.poster_path
                                ? makeImagePath(tv.poster_path, "w500")
                                : noPoster
                            }
                          >
                            <Info variants={infoVariants}>
                              <h4>{tv.name}</h4>
                            </Info>
                          </Box>
                        </>
                      ))}
                  </Row>
                  <SliderLeftBtn onClick={incraseTodayLeftIndex}>
                    &lt;
                  </SliderLeftBtn>
                  <SliderRightBtn onClick={incraseTodayRightIndex}>
                    &gt;
                  </SliderRightBtn>
                </AnimatePresence>
              </Slider>
            </SliderInlineBox>

            {/* PopTv */}
            <PopTvTitle>Popular TV</PopTvTitle>
            <SliderInlineBox>
              <PopSlider>
                <AnimatePresence
                  custom={back}
                  initial={false}
                  onExitComplete={toggleLeaving}
                >
                  <Row
                    custom={back}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                    key={popTvindex}
                  >
                    {popularTvData?.results
                      .slice(1)
                      .slice(offset * popTvindex, offset * popTvindex + offset)
                      .map((tv) => (
                        <>
                          <Box
                            layoutId={tv.id + ""}
                            key={tv.id}
                            whileHover="hover"
                            initial="normal"
                            variants={boxVariants}
                            onClick={() => onBoxClicked(tv.id)}
                            transition={{ type: "tween" }}
                            bgPhoto={
                              tv.backdrop_path
                                ? makeImagePath(tv.backdrop_path, "w500")
                                : noPoster
                            }
                          >
                            <Info variants={infoVariants}>
                              <h4>{tv.name}</h4>
                            </Info>
                          </Box>
                        </>
                      ))}
                  </Row>
                  <SliderLeftBtn onClick={incrasePopLeftIndex}>
                    &lt;
                  </SliderLeftBtn>
                  <SliderRightBtn onClick={incrasePopRightIndex}>
                    &gt;
                  </SliderRightBtn>
                </AnimatePresence>
              </PopSlider>
            </SliderInlineBox>

            {/* TopTv */}
            <PopTvTitle>TopRate TV</PopTvTitle>
            <SliderInlineBox>
              <TopSlider>
                <AnimatePresence
                  custom={back}
                  initial={false}
                  onExitComplete={toggleLeaving}
                >
                  <Row
                    custom={back}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                    key={topTvindex}
                  >
                    {topRateTvData?.results
                      .slice(1)
                      .slice(offset * topTvindex, offset * topTvindex + offset)
                      .map((tv) => (
                        <>
                          <Box
                            layoutId={tv.id + ""}
                            key={tv.id}
                            whileHover="hover"
                            initial="normal"
                            variants={boxVariants}
                            onClick={() => onBoxClicked(tv.id)}
                            transition={{ type: "tween" }}
                            bgPhoto={
                              tv.backdrop_path
                                ? makeImagePath(tv.backdrop_path, "w500")
                                : noPoster
                            }
                          >
                            <Info variants={infoVariants}>
                              <h4>{tv.name}</h4>
                            </Info>
                          </Box>
                        </>
                      ))}
                  </Row>
                  <SliderLeftBtn onClick={incraseTopLeftIndex}>
                    &lt;
                  </SliderLeftBtn>
                  <SliderRightBtn onClick={incraseTopRightIndex}>
                    &gt;
                  </SliderRightBtn>
                </AnimatePresence>
              </TopSlider>
            </SliderInlineBox>
          </SliderContainer>

          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigTv
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigTvMatch.params.tvId}
                >
                  {clickedTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedTv.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedTv.name}</BigTitle>
                      <BigOverview>{clickedTv.overview}</BigOverview>
                      <BigOverview>{clickedTv.release_date}</BigOverview>
                    </>
                  )}
                </BigTv>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Tv;
