import React from "react";

const MoviesList = (props) => {
  const renderMovieList = () => {
    return <ul className='cards'>{renderMovies()}</ul>;
  };

  const renderMovies = () => {
    return props.movies.map((movie) => {
      console.log(movie);
      return (
        <a key={movie.idmovies} href={"/movie/" + movie.idmovies}>
          <li className='card'>
            <img
              className='card__img'
              src={movie.image}
              alt={`Carátula de ${movie.title}`}
            />
            <h3 className='card__title'>{movie.title}</h3>
            <p className='card__description'>Género: {movie.genre}</p>
          </li>
        </a>
      );
    });
  };

  const renderEmptyList = () => {
    return <p>No hay películas en este listado</p>;
  };

  return props.movies.length ? renderMovieList() : renderEmptyList();
};

export default MoviesList;
