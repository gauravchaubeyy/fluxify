import React, { useEffect, useState } from "react";
import Thumbnail from "../components/Thumbnail";

const Home = () => {
  const [movies, setMovies] = useState({});
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:3001/movies-stream");

    eventSource.onmessage = (event) => {
      const updatedMovie = JSON.parse(event.data);
      const movieUuid = updatedMovie.uuid;
      const thumbnailPath = updatedMovie.thumbnailPath;
      const imageUrl = `http://localhost:3001${thumbnailPath}`;
      setMovies((prevMovies) => ({
        ...prevMovies,
        [movieUuid]: updatedMovie,
      }));
      setImageUrls((prevImageUrls) => ({
        ...prevImageUrls,
        [movieUuid]: imageUrl,
      }));
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="bg-black min-h-screen">
    <div className="home-container">
      <h1 className="text-black text-lg font-semibold">Featured Videos</h1>
      <ul className="video-list flex flex-wrap justify-start">
        {Object.values(movies).map((movie) => {
          const movieUuid = movie.uuid;
          const imageUrl = imageUrls[movieUuid]; // Access image URL from state
          return (
            <Thumbnail key={movieUuid} video={movie} imageUrl={imageUrl} />
          );
        })}
      </ul>
    </div>
    </div>
  );
};

export default Home;
