import React, { useEffect, useRef } from 'react'
import './TitleCards.css'
import cards_data from '../../assets/cards/Cards_data'

const shuffleCards = (cards) => {
  return [...cards].sort((a, b) => {
    const first = a.name.length + a.id.length;
    const second = b.name.length + b.id.length;
    return (first % 5) - (second % 5);
  });
};

const getOrderedCards = (cards, mode) => {
  let orderedCards = cards;

  if (mode === 'reverse') {
    orderedCards = [...cards].reverse();
  } else if (mode === 'shuffle') {
    orderedCards = shuffleCards(cards);
  } else if (mode === 'offset') {
    orderedCards = [...cards.slice(4), ...cards.slice(0, 4)];
  }

  const availableCards = orderedCards.filter(card => card.trailerAvailable);
  const unavailableCards = orderedCards.filter(card => !card.trailerAvailable);
  return [...availableCards, ...unavailableCards];
};

const getMovieId = (card, index = 0) => {
  if (card.id) return card.id;
  if (card.name) return card.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `local-${index}`;
};

const normalizeCards = (cards) => cards.map((card, index) => ({
  id: getMovieId(card, index),
  name: card.name,
  image: card.image,
  genre: card.genre,
  year: card.year,
  rating: card.rating,
  duration: card.duration,
  description: card.description,
  trailerKey: card.trailerKey,
  published_at: card.published_at,
  trailerAvailable: card.trailerAvailable,
  isFallback: true,
}));

const TitleCards = ({
  title,
  mode = 'normal',
  cards,
  onMovieSelect,
  onToggleMyList,
  isInMyList
}) => {

  const cardsRef = useRef();
  const wheelEventRef = useRef(null);

  const fallbackCards = normalizeCards(cards || cards_data);
  const orderedCards = getOrderedCards(fallbackCards, mode);

  useEffect(() => {
    const handleWheelEvent = (event) => {
      if (cardsRef.current) {
        event.preventDefault();
        cardsRef.current.scrollLeft += event.deltaY;
      }
    };

    if (cardsRef.current) {
      cardsRef.current.addEventListener('wheel', handleWheelEvent, { passive: false });
      wheelEventRef.current = handleWheelEvent;
    }

    return () => {
      if (cardsRef.current && wheelEventRef.current) {
        cardsRef.current.removeEventListener('wheel', wheelEventRef.current);
      }
    };
  }, []);

  return (
    <div className='title-cards'>
      <h2>{title ? title : "Popular on Netflix"}</h2>

      <div className="card-list" ref={cardsRef}>
        {orderedCards.map((card, index) => {
            const cardTitle = card.original_title || card.name || 'Movie';
            const cardId = getMovieId(card, index);
            const backdropPath = card.backdrop_path || card.poster_path;
            const cardImage = card.image || (backdropPath ? `https://image.tmdb.org/t/p/w500${backdropPath}` : 'https://via.placeholder.com/240x135?text=No+Image');
            
            return (
              <div className="card" key={`card-${cardId}`}>
                <button
                  type="button"
                  className="card-poster"
                  title={cardTitle}
                  onClick={() => onMovieSelect?.(card)}
                >
                  <img
                    src={cardImage}
                    alt={cardTitle}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/240x135?text=No+Image';
                    }}
                  />
                  <p>{cardTitle}</p>
                </button>
                {onToggleMyList && (
                  <button
                    type="button"
                    className={`card-list-btn ${isInMyList?.(cardId) ? 'added' : ''}`}
                    onClick={() => onToggleMyList(card)}
                    aria-label={`${isInMyList?.(cardId) ? 'Remove from' : 'Add to'} My List`}
                  >
                    {isInMyList?.(cardId) ? 'Added' : '+ My List'}
                  </button>
                )}
              </div>
            );
          })}
      </div>
    </div>
  )
}

export default TitleCards
