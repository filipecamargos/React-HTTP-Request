import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  //Since function holds a diferent space in memory every time like a object
  //it is important to useCallBack so it is not rehandle everytime
  const fecthMovieHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://swapi.dev/api/films/");

      if (!response.ok) {
        throw new Error("Somthing wrong with the reponse");
      }

      const data = await response.json();

      const transformMovies = data.results.map((movie) => {
        return {
          id: movie.episode_id,
          title: movie.title,
          openingText: movie.opening_crawl,
          releaseDate: movie.release_date,
        };
      });
      setMovies(transformMovies);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  }, []);

  //useEffect is only called on the update of the second argument, since
  //there is an empty array that never changes, it will handle the first
  //time the app is loaded and never again
  useEffect(() => {
    fecthMovieHandler();
  }, [fecthMovieHandler]);

  return (
    <React.Fragment>
      <section>
        <button onClick={fecthMovieHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && (
          <p>No Movies Found Try to Fetch!</p>
        )}
        {isLoading && <p>Loading...</p>}
        {!isLoading && error && <p>{error}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
