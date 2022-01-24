import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "react-query";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ISearchResult, searchAll } from "../api";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { makeImagePath } from "../utils";
import Detail from "../Components/Detail";

const Wrapper = styled.div`
  background-color: black;
  margin: 100px 0px;
  width: 100%;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SearchTitle = styled.h1`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BoxContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 60px;
  gap: 10px;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  height: 200px;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  margin-bottom: 20px;
  border-radius: 5px;
  position: relative;
  box-shadow: 0px 2px 15px 0px rgba(255, 255, 255, 0.22);
  cursor: pointer;
`;

const Info = styled(motion.div)`
  padding: 20px;
  background-color: ${(props) => props.theme.black.darker};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 14px;
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
  width: 50vw;
  height: 80vh;
  background-color: ${(props) => props.theme.black.darker};
  box-shadow: 0px 2px 15px 0px rgba(255, 255, 255, 0.22);
  left: 0;
  right: 0;
  margin: 0 auto;
  overflow-y: scroll;
  bottom: 50px;
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -30,
    zIndex: 99,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

interface ISearch {
  search: string;
}

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation() as ISearch;
  const keyword = new URLSearchParams(location.search).get("keyword");
  const movieMatch = useMatch("/search/movies/:movieId");
  const tvMatch = useMatch("/search/tv/:tvId");
  const { data, isLoading } = useQuery<ISearchResult>("search", () =>
    searchAll(keyword)
  );
  const onClickBox = (mediaType: string, searchId: number) => {
    if (mediaType === "movie") {
      navigate(`/search/movies/${searchId}`);
    } else if (mediaType === "tv") {
      navigate(`/search/tv/${searchId}`);
    } else {
      return;
    }
  };

  const onOverlayClick = () => navigate(-1);
  return (
    <Wrapper>
      <HelmetProvider>
        <Helmet>
          <title>{`Search | ${keyword}`}</title>
        </Helmet>
      </HelmetProvider>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <SearchTitle>Movie</SearchTitle>
          <BoxContainer>
            {data?.results.map((search, index) => (
              <AnimatePresence key={index}>
                {search.media_type === "movie" && (
                  <Box
                    initial="normal"
                    whileHover="hover"
                    variants={boxVariants}
                    key={search.id}
                    onClick={() => {
                      onClickBox(search.media_type, search.id);
                    }}
                    bgphoto={
                      search.backdrop_path
                        ? makeImagePath(search.backdrop_path, "w500")
                        : makeImagePath(search.poster_path, "w500")
                    }
                  >
                    <Info variants={infoVariants}>
                      <h4>{search.title ? search.title : search.name}</h4>
                    </Info>
                  </Box>
                )}
              </AnimatePresence>
            ))}
          </BoxContainer>
          <SearchTitle>Tv</SearchTitle>
          <BoxContainer>
            {data?.results.map((search, index) => (
              <AnimatePresence key={index}>
                {search.media_type === "tv" && (
                  <Box
                    initial="normal"
                    whileHover="hover"
                    variants={boxVariants}
                    key={search.id}
                    onClick={() => {
                      onClickBox(search.media_type, search.id);
                    }}
                    bgphoto={
                      search.backdrop_path
                        ? makeImagePath(search.backdrop_path, "w500")
                        : makeImagePath(search.poster_path, "w500")
                    }
                  >
                    <Info variants={infoVariants}>
                      <h4>{search.name}</h4>
                    </Info>
                  </Box>
                )}
              </AnimatePresence>
            ))}
          </BoxContainer>
          <AnimatePresence>
            {movieMatch ? (
              <Overlay
                onClick={onOverlayClick}
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <BigMovie layoutId={movieMatch.params.movieId}>
                  <Detail />
                </BigMovie>
              </Overlay>
            ) : null}
            {tvMatch ? (
              <Overlay
                onClick={onOverlayClick}
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <BigMovie layoutId={tvMatch.params.tvId}>
                  <Detail />
                </BigMovie>
              </Overlay>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
};

export default Search;
