import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";
import Detail from "./Components/Detail";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path={"/*"} element={<Home />}>
          <Route path="movies/:movieId" element={<Detail />} />
        </Route>

        <Route path="/tv" element={<Tv />}>
          <Route path=":tvId" element={<Detail />} />
        </Route>

        <Route path="search" element={<Search />}>
          <Route path="movies/:movieId" element={<Detail />} />
          <Route path="tv/:tvId" element={<Detail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
