import React, { useEffect, useRef } from 'react'
import './MovieModal.css'
import play_icon from '../../assets/play_icon.png'

const MovieModal = ({ movie, onClose, onPlay, onToggleMyList, isInMyList }) => {
  const overlayRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const handleOverlayClick = (event) => {
    if (event.target === overlayRef.current) {
      onClose()
    }
  }

  if (!movie) return null

  const added = isInMyList?.(movie.id)

  return (
    <div className="movie-modal-overlay" ref={overlayRef} onMouseDown={handleOverlayClick}>
      <div className="movie-modal">
        <button className="movie-modal-close" type="button" onClick={onClose} aria-label="Close movie details">x</button>
        <div className="movie-modal-visual">
          <img src={movie.image} alt={movie.name} />
          <div className="movie-modal-gradient" />
        </div>
        <div className="movie-modal-content">
          <h2>{movie.name}</h2>
          <div className="movie-meta">
            <span>{movie.genre || 'Drama'}</span>
            <span>{movie.year || movie.published_at?.slice(0, 4) || '2024'}</span>
            <span>{movie.rating || '8.5/10'}</span>
            <span>{movie.duration || '2h 10m'}</span>
          </div>
          <p>{movie.description || 'Discover a gripping Netflix story packed with drama, suspense, and unforgettable characters.'}</p>
          <div className="movie-modal-actions">
            <button className="movie-play-btn" type="button" onClick={() => onPlay(movie)}>
              <img src={play_icon} alt="" />
              Play
            </button>
            {onToggleMyList && (
              <button className={`movie-list-btn ${added ? 'added' : ''}`} type="button" onClick={() => onToggleMyList(movie)}>
                {added ? 'Remove from List' : '+ My List'}
              </button>
            )}
            <button className="movie-close-btn" type="button" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieModal
