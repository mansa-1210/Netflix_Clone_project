import React, { useEffect, useState } from 'react'
import './Player.css'
import back_arrow_icon from '../../assets/back_arrow_icon.png'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { TMDB_Access_Key } from '../../config'

const Player = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const mediaType = location.state?.mediaType || "movie";
  const movieTitle = location.state?.title || 'Trailer';
  const fallbackTrailer = location.state?.fallbackTrailer || id?.startsWith('local-');
  const localTrailerKey = location.state?.trailerKey;
  const localPublishedAt = location.state?.published_at || '2024-03-14';
  const localTrailerAvailable = location.state?.trailerAvailable !== false;

  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError('Invalid movie ID');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setTrailer(null);

    if (fallbackTrailer) {
      if (!localTrailerAvailable || !localTrailerKey) {
        setError('Trailer unavailable');
        setLoading(false);
        return;
      }

      setTrailer({
        key: localTrailerKey,
        published_at: localPublishedAt,
        type: 'Trailer'
      });
      setLoading(false);
      return;
    }

    const url = `https://api.themoviedb.org/3/${mediaType}/${id}/videos?language=en-US`;

    const controller = new AbortController();
    let didTimeout = false;
    const timeoutId = setTimeout(() => {
      didTimeout = true;
      controller.abort();
    }, 8000);

    const options = {
      method: 'GET',
      signal: controller.signal,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_Access_Key}`
      }
    };

    fetch(url, options)
      .then(res => {
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!data.results || data.results.length === 0) {
          setError('No trailer available');
          setLoading(false);
          return;
        }

        // Find YouTube trailer
        const foundTrailer = data.results.find(
          v => v.type === "Trailer" && v.site === "YouTube"
        );

        if (!foundTrailer) {
          setError('No YouTube trailer found');
          setLoading(false);
          return;
        }

        setTrailer(foundTrailer);
        setLoading(false);
      })
      .catch(err => {
        clearTimeout(timeoutId);
        if (controller.signal.aborted && !didTimeout) {
          return;
        }
        if (!localTrailerAvailable || !localTrailerKey) {
          setError('Trailer unavailable');
          setLoading(false);
          return;
        }

        setTrailer({
          key: localTrailerKey,
          published_at: localPublishedAt,
          type: 'Trailer'
        });
        setError(null);
        setLoading(false);
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [id, mediaType, fallbackTrailer, localTrailerKey, localPublishedAt, localTrailerAvailable]);

  return (
    <div className='player'>
      <img 
        src={back_arrow_icon} 
        alt="Back" 
        onClick={() => navigate(-1)}
        style={{ cursor: 'pointer', zIndex: 10 }}
      />

      {loading && (
        <div className="player-loading">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {error && !loading && (
        <div className="player-error">
          <p>{error}</p>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      )}

      {trailer && !loading && (
        <>
          <iframe 
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
            title={movieTitle}
            frameBorder='0' 
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          />
          <div className="player-info">
            <p>{trailer.published_at?.slice(0, 10) || 'N/A'}</p>
            <p>{movieTitle}</p>
            <p>{trailer.type}</p>
          </div>
        </>
      )}
    </div>
  )
}

export default Player
