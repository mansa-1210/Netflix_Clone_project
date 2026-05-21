import React, { useEffect, useRef } from 'react'
import './TitleCards.css'
import { Link } from 'react-router-dom'
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

const TitleCards = ({ title, category, mode = 'normal' }) => {

  const cardsRef = useRef();
  const wheelEventRef = useRef(null);

  const fallbackCards = cards_data.map((card, index) => ({
    id: `local-${index}`,
    name: card.name,
    image: card.image,
    trailerKey: card.trailerKey,
    published_at: card.published_at,
    trailerAvailable: card.trailerAvailable,
    isFallback: true,
  }));
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
            const cardId = card.id || `local-${index}`;
            const backdropPath = card.backdrop_path || card.poster_path;
            const cardImage = card.image || (backdropPath ? `https://image.tmdb.org/t/p/w500${backdropPath}` : 'https://via.placeholder.com/240x135?text=No+Image');
            
            return (
              <Link 
                to={`/player/${cardId}`} 
                state={{
                  title: cardTitle,
                  mediaType: category?.startsWith('tv') ? 'tv' : 'movie',
                  fallbackTrailer: card.isFallback,
                  trailerKey: card.trailerKey,
                  published_at: card.published_at,
                  trailerAvailable: card.trailerAvailable
                }}
                className="card" 
                key={`card-${cardId}`}
                title={cardTitle}
              >
                <img
                  src={cardImage}
                  alt={cardTitle}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/240x135?text=No+Image';
                  }}
                />
                <p>{cardTitle}</p>
              </Link>
            );
          })}
      </div>
    </div>
  )
}

export default TitleCards
