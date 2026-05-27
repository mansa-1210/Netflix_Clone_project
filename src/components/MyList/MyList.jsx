import React from 'react'
import './MyList.css'

const MyList = ({ movies, onMovieSelect, onRemove }) => {
  if (movies.length === 0) {
    return (
      <section className="my-list-page">
        <h1>My List</h1>
        <div className="my-list-empty">No Movies Added Yet</div>
      </section>
    )
  }

  return (
    <section className="my-list-page">
      <h1>My List</h1>
      <div className="my-list-grid">
        {movies.map((movie) => (
          <article className="my-list-card" key={movie.id}>
            <button type="button" className="my-list-poster" onClick={() => onMovieSelect(movie)}>
              <img src={movie.image} alt={movie.name} />
              <span>{movie.name}</span>
            </button>
            <div className="my-list-details">
              <p>{movie.rating || '8.5/10'}</p>
              <button type="button" onClick={() => onRemove(movie.id)}>Remove</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default MyList
