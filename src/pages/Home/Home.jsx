import React, { useEffect, useMemo, useState } from 'react'
import './Home.css'
import Navbar from '../../components/Navbar/Navbar'
import hero_banner from '../../assets/hero_banner.jpg'
import hero_title from '../../assets/hero_title.png'
import play_icon from '../../assets/play_icon.png'
import info_icon from '../../assets/info_icon.png'
import TitleCards from '../../components/TitileCards/TitleCards'
import { useSearchParams } from 'react-router-dom'
import cards_data from '../../assets/cards/Cards_data'
import VideoModal from '../../components/VideoModal/VideoModal'
import MovieModal from '../../components/MovieModal/MovieModal'
import MyList from '../../components/MyList/MyList'

const MY_LIST_STORAGE_KEY = 'netflixCloneMyList'

const getMovieId = (movie) => {
  if (movie.id) return movie.id;
  return movie.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const prepareMovieForList = (movie) => ({
  ...movie,
  id: getMovieId(movie)
})

const loadSavedMyList = () => {
  try {
    const savedList = JSON.parse(localStorage.getItem(MY_LIST_STORAGE_KEY) || '[]');
    return Array.isArray(savedList) ? savedList : [];
  } catch {
    return [];
  }
}

const Home = () => {
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view') || 'home';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [videoMovie, setVideoMovie] = useState(null);
  const [myListMovies, setMyListMovies] = useState(loadSavedMyList);

  const featuredMovie = {
    ...cards_data[6],
    name: 'The Protector',
    genre: 'Action, Drama',
    year: '2018',
    rating: '8.5/10',
    duration: '2h 10m',
    description: 'Discovering his ties to a secret ancient order, a young man living in modern Istanbul embarks on a quest to save the city from an immortal enemy.',
    image: hero_banner,
    id: 'the-protector',
    trailerKey: '80dqOwAOhbo',
    trailerAvailable: true
  };

  useEffect(() => {
    localStorage.setItem(MY_LIST_STORAGE_KEY, JSON.stringify(myListMovies));
  }, [myListMovies]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    return cards_data.filter((movie) => movie.name.toLowerCase().includes(query));
  }, [searchQuery]);

  const openMovieModal = (movie) => {
    setSelectedMovie(prepareMovieForList(movie));
  };

  const openVideoModal = (movie) => {
    setVideoMovie(prepareMovieForList(movie));
  };

  const isInMyList = (movieOrId) => {
    const movieId = typeof movieOrId === 'string' ? movieOrId : getMovieId(movieOrId);
    return myListMovies.some((movie) => movie.id === movieId);
  };

  const addToMyList = (movie) => {
    const normalizedMovie = prepareMovieForList(movie);
    setMyListMovies((currentMovies) => {
      if (currentMovies.some((item) => item.id === normalizedMovie.id)) {
        return currentMovies;
      }
      return [...currentMovies, normalizedMovie];
    });
  };

  const removeFromMyList = (movieOrId) => {
    const movieId = typeof movieOrId === 'string' ? movieOrId : getMovieId(movieOrId);
    setMyListMovies((currentMovies) => currentMovies.filter((movie) => movie.id !== movieId));
  };

  const toggleMyList = (movie) => {
    if (isInMyList(movie)) {
      removeFromMyList(movie);
    } else {
      addToMyList(movie);
    }
  };

  const cardListProps = {
    onMovieSelect: openMovieModal,
    onToggleMyList: toggleMyList,
    isInMyList
  };

  return (
    <div className='home'>
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery}/>
      
      <div className="page-content">
        {searchQuery.trim() ? (
          <div className="more-cards search-results">
            <h1>Search Results</h1>
            {searchResults.length > 0 ? (
              <TitleCards
                title={`${searchResults.length} match${searchResults.length === 1 ? '' : 'es'} found`}
                cards={searchResults}
                {...cardListProps}
              />
            ) : (
              <div className="no-movies">No Movies Found</div>
            )}
          </div>
        ) : view === 'home' && (
          <>
            <div className="hero">
              <img src={hero_banner} alt="" className='banner-img'/>
              <div className="hero-caption">
                <img src={hero_title} alt="" className='caption-img'/>
                <p>Discovering his ties to a secret ancient order, a young man living in modern Istanbul embarks on a quest to save the city from an immortal enemy.</p>
                <div className="hero-btns">
                  <button className='btn' onClick={() => openVideoModal(featuredMovie)}><img src={play_icon} alt="" />Play</button>
                  <button className='btn dark-btn' onClick={() => openMovieModal(featuredMovie)}><img src={info_icon} alt="" />More Info</button>
                  <button className={`btn list-hero-btn ${isInMyList(featuredMovie) ? 'added' : ''}`} onClick={() => toggleMyList(featuredMovie)}>
                    {isInMyList(featuredMovie) ? 'Added' : '+ My List'}
                  </button>
                </div>
                <TitleCards mode="normal" {...cardListProps}/>
              </div>
            </div>
            <div className="more-cards">
              <TitleCards title={"Blockbuster Movies"} mode="reverse" {...cardListProps}/>
              <TitleCards title={"Only on Netflix"} mode="shuffle" {...cardListProps}/>
              <TitleCards title={"Upcoming"} mode="offset" {...cardListProps}/>
              <TitleCards title={"Top Pics for You"} mode="reverse" {...cardListProps}/>
            </div>
          </>
        )}

        {view === 'tvshows' && !searchQuery.trim() && (
          <div className="more-cards">
            <h1 style={{marginLeft: '20px', marginTop: '20px'}}>TV Shows</h1>
            <TitleCards title={"Popular TV Shows"} mode="normal" {...cardListProps}/>
            <TitleCards title={"Top Rated TV Shows"} mode="reverse" {...cardListProps}/>
            <TitleCards title={"On The Air"} mode="shuffle" {...cardListProps}/>
            <TitleCards title={"Airing Today"} mode="offset" {...cardListProps}/>
          </div>
        )}

        {view === 'movies' && !searchQuery.trim() && (
          <div className="more-cards">
            <h1 style={{marginLeft: '20px', marginTop: '20px'}}>Movies</h1>
            <TitleCards title={"Popular Movies"} mode="normal" {...cardListProps}/>
            <TitleCards title={"Top Rated Movies"} mode="reverse" {...cardListProps}/>
            <TitleCards title={"Upcoming Movies"} mode="shuffle" {...cardListProps}/>
            <TitleCards title={"Now Playing"} mode="offset" {...cardListProps}/>
          </div>
        )}

        {view === 'newpopular' && !searchQuery.trim() && (
          <div className="more-cards">
            <h1 style={{marginLeft: '20px', marginTop: '20px'}}>New & Popular</h1>
            <TitleCards title={"Recently Released"} mode="normal" {...cardListProps}/>
            <TitleCards title={"Popular Now"} mode="shuffle" {...cardListProps}/>
            <TitleCards title={"Trending"} mode="reverse" {...cardListProps}/>
          </div>
        )}

        {view === 'mylist' && !searchQuery.trim() && (
          <MyList
            movies={myListMovies}
            onMovieSelect={openMovieModal}
            onRemove={removeFromMyList}
          />
        )}

        {view === 'languages' && !searchQuery.trim() && (
          <div className="more-cards">
            <h1 style={{marginLeft: '20px', marginTop: '20px'}}>Browse by Language</h1>
            <TitleCards title={"English Movies"} mode="normal" {...cardListProps}/>
            <TitleCards title={"Hindi Movies"} mode="reverse" {...cardListProps}/>
            <TitleCards title={"Spanish Movies"} mode="shuffle" {...cardListProps}/>
          </div>
        )}
      </div>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onPlay={(movie) => {
            setSelectedMovie(null);
            openVideoModal(movie);
          }}
          onToggleMyList={toggleMyList}
          isInMyList={isInMyList}
        />
      )}
      {videoMovie && <VideoModal movie={videoMovie} onClose={() => setVideoMovie(null)} />}
    </div>
  )
}

export default Home
