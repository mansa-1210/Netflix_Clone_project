import React, { useEffect, useRef, useState } from 'react'
import './VideoModal.css'

const FALLBACK_TRAILER = 'oqxAJKy0ii4'

const VideoModal = ({ movie, onClose }) => {
  const modalRef = useRef(null)
  const [muted, setMuted] = useState(false)

  const trailerKey = movie?.trailerKey || FALLBACK_TRAILER
  const title = movie?.name || movie?.title || 'Netflix trailer'

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
    if (event.target === modalRef.current) {
      onClose()
    }
  }

  const iframeSrc = `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${muted ? 1 : 0}&controls=1&rel=0&modestbranding=1`

  return (
    <div className="video-modal-overlay" ref={modalRef} onMouseDown={handleOverlayClick}>
      <div className="video-modal">
        <button className="video-close" type="button" onClick={onClose} aria-label="Close video">x</button>
        <div className="video-frame-wrap">
          <iframe
            src={iframeSrc}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
        <div className="video-controls">
          <div>
            <span className="video-eyebrow">Now Playing</span>
            <h3>{title}</h3>
          </div>
          <div className="video-actions">
            <button type="button" onClick={() => setMuted((current) => !current)}>
              {muted ? 'Unmute' : 'Mute'}
            </button>
            <button type="button" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoModal
