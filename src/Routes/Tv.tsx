import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import {
  // allTrending,
  getTv,
  IGetTv,
  getTopRatedTv,
  getPopularTv,
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
  display: flex;
  flex-direction: column;
  margin-top: 8em;
  font-weight: bolder;
`;

const Slider = styled.div`
  position: relative;
  margin-bottom: 13rem;
  &:hover {
    button {
      opacity: 1;
      transition: 0.5s ease;
      background-color: rgba(0, 0, 0, 0.6);
      border: none;
    }
  }
`;

const TvSlider = styled.div`
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

const AllTrendingTv = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  margin-bottom: 20px;
`;

const TvTitle = styled.h3`
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

function Home() {
  const history = useHistory();
  const bigTvMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");
  const { scrollY } = useViewportScroll();
  const { data: TvData, isLoading: TrendingTvLoading } = useQuery<IGetTv>(
    ["Tv", "AllTrending"],
    getTv
  );
  const { data: popularTv, isLoading: TvLoading } = useQuery<IGetTv>(
    ["Tv", "PopularTv"],
    getPopularTv
  );
  const { data: topRateTvData, isLoading: topRateTvLoading } = useQuery<IGetTv>(
    ["Tv", "TopTv"],
    getTopRatedTv
  );

  const [index, setIndex] = useState(0);
  const [TvIndex, setTvIndex] = useState(0);
  const [topTvIndex, settopTvIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const [back, setBack] = useState(false);

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const incraseAllTrendingLeftIndex = () => {
    setBack(false);
    if (TvData) {
      if (leaving) return;
      toggleLeaving();
      const totalTv = TvData.results.length - 1;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const incraseAllTrendingRightIndex = () => {
    setBack(true);
    if (TvData) {
      if (leaving) return;
      toggleLeaving();
      const totalTv = TvData.results.length - 1;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  // Tv Btn
  const incraseTvLeftIndex = () => {
    setBack(false);
    if (popularTv) {
      if (leaving) return;
      toggleLeaving();
      const totalTv = popularTv.results.length - 1;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      setTvIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const incraseTvRightIndex = () => {
    setBack(true);
    if (popularTv) {
      if (leaving) return;
      toggleLeaving();
      const totalTv = popularTv.results.length - 1;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      setTvIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  // // TopRate Tv
  const incraseTopLeftIndex = () => {
    setBack(false);
    if (topRateTvData) {
      if (leaving) return;
      toggleLeaving();
      const totalTv = topRateTvData.results.length - 1;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      settopTvIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const incraseTopRightIndex = () => {
    setBack(true);
    if (topRateTvData) {
      if (leaving) return;
      toggleLeaving();
      const totalTv = topRateTvData.results.length - 1;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      settopTvIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const onBoxClicked = (TvId: number) => {
    history.push(`/Tv/${TvId}`);
  };
  const onOverlayClick = () => history.push("/");

  const isLoading = TrendingTvLoading || TvLoading || topRateTvLoading;

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(TvData?.results[0].backdrop_path || "")}
          >
            <Title>{TvData?.results[0].name}</Title>
            <Overview>{TvData?.results[0].overview}</Overview>
          </Banner>
          <SliderContainer>
            <AllTrendingTv>Tv</AllTrendingTv>
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
                    {TvData?.results.map((tv) => (
                      <Box
                        bgphoto={makeImagePath(tv.backdrop_path, "w500")}
                      ></Box>
                    )) ===
                    popularTv?.results.map((tv) => (
                      <Box
                        // layoutId={Tv.id + ""}
                        bgphoto={makeImagePath(tv.backdrop_path, "w500")}
                      ></Box>
                    ))
                      ? console.log("s")
                      : console.log("good")}

                    {TvData?.results
                      .slice(1)
                      .slice(offset * index, offset * index + offset)

                      .map((tv) => (
                        <Box
                          layoutId={tv.id + ""}
                          key={tv.id}
                          whileHover="hover"
                          initial="nomal"
                          variants={boxVariants}
                          onClick={() => onBoxClicked(tv.id)}
                          transition={{ type: "tween" }}
                          bgphoto={
                            tv.backdrop_path
                              ? makeImagePath(tv.backdrop_path, "w500")
                              : noPoster
                          }
                        >
                          {console.log(makeImagePath(tv.name))}
                          <Info variants={infoVariants}>
                            <h4>{tv.name}</h4>
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

            {/* Tv */}
            <TvTitle>Pop Tv</TvTitle>
            <Slider>
              <AnimatePresence
                custom={back}
                initial={false}
                onExitComplete={toggleLeaving}
              >
                <div key={TvIndex}>
                  <Row
                    custom={back}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                  >
                    {popularTv?.results
                      .slice(1)
                      .slice(offset * TvIndex, offset * TvIndex + offset)
                      .map((tv) => (
                        <Box
                          layoutId={tv.id + ""}
                          key={tv.id}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          onClick={() => onBoxClicked(tv.id)}
                          transition={{ type: "tween" }}
                          bgphoto={makeImagePath(tv.backdrop_path, "w500")}
                        >
                          <Info variants={infoVariants}>
                            <h4>{tv.name}</h4>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                  <SliderLeftBtn onClick={incraseTvLeftIndex}>
                    &lt;
                  </SliderLeftBtn>
                  <SliderRightBtn onClick={incraseTvRightIndex}>
                    &gt;
                  </SliderRightBtn>
                </div>
              </AnimatePresence>
            </Slider>

            {/* TopTv */}

            <TvTitle>Top Tv</TvTitle>
            <Slider>
              <AnimatePresence
                custom={back}
                initial={false}
                onExitComplete={toggleLeaving}
              >
                <div key={topTvIndex}>
                  <Row
                    custom={back}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                  >
                    {topRateTvData?.results
                      .slice(1)
                      .slice(offset * topTvIndex, offset * topTvIndex + offset)
                      .map((tv) => (
                        <Box
                          layoutId={tv.id + ""}
                          key={tv.id}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          onClick={() => onBoxClicked(tv.id)}
                          transition={{ type: "tween" }}
                          bgphoto={makeImagePath(
                            tv.backdrop_path,
                            "w500" || null
                          )}
                        >
                          <Info variants={infoVariants}>
                            <h4>{tv.name}</h4>
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
            {bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigTv
                  style={{
                    top: scrollY.get() + 100,
                    bottom: scrollY.get() + 100,
                  }}
                  layoutId={bigTvMatch.params.tvId}
                >
                  <Detail />
                </BigTv>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
