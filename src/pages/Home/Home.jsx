import React, { useMemo, useState } from 'react'
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

const Home = () => {
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view') || 'home';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [videoMovie, setVideoMovie] = useState(null);

  const featuredMovie = {
    ...cards_data[6],
    name: 'The Protector',
    genre: 'Action, Drama',
    year: '2018',
    rating: '8.5/10',
    duration: '2h 10m',
    description: 'Discovering his ties to a secret ancient order, a young man living in modern Istanbul embarks on a quest to save the city from an immortal enemy.',
    image: hero_banner,
    trailerKey: '80dqOwAOhbo',
    trailerAvailable: true
  };

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    return cards_data.filter((movie) => movie.name.toLowerCase().includes(query));
  }, [searchQuery]);

  const openMovieModal = (movie) => {
    setSelectedMovie(movie);
  };

  const openVideoModal = (movie) => {
    setVideoMovie(movie);
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
                onMovieSelect={openMovieModal}
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
                </div>
                <TitleCards mode="normal" onMovieSelect={openMovieModal}/>
              </div>
            </div>
            <div className="more-cards">
              <TitleCards title={"Blockbuster Movies"} mode="reverse" onMovieSelect={openMovieModal}/>
              <TitleCards title={"Only on Netflix"} mode="shuffle" onMovieSelect={openMovieModal}/>
              <TitleCards title={"Upcoming"} mode="offset" onMovieSelect={openMovieModal}/>
              <TitleCards title={"Top Pics for You"} mode="reverse" onMovieSelect={openMovieModal}/>
            </div>
          </>
        )}

        {view === 'tvshows' && !searchQuery.trim() && (
          <div className="more-cards">
            <h1 style={{marginLeft: '20px', marginTop: '20px'}}>TV Shows</h1>
            <TitleCards title={"Popular TV Shows"} mode="normal" onMovieSelect={openMovieModal}/>
            <TitleCards title={"Top Rated TV Shows"} mode="reverse" onMovieSelect={openMovieModal}/>
            <TitleCards title={"On The Air"} mode="shuffle" onMovieSelect={openMovieModal}/>
            <TitleCards title={"Airing Today"} mode="offset" onMovieSelect={openMovieModal}/>
          </div>
        )}

        {view === 'movies' && !searchQuery.trim() && (
          <div className="more-cards">
            <h1 style={{marginLeft: '20px', marginTop: '20px'}}>Movies</h1>
            <TitleCards title={"Popular Movies"} mode="normal" onMovieSelect={openMovieModal}/>
            <TitleCards title={"Top Rated Movies"} mode="reverse" onMovieSelect={openMovieModal}/>
            <TitleCards title={"Upcoming Movies"} mode="shuffle" onMovieSelect={openMovieModal}/>
            <TitleCards title={"Now Playing"} mode="offset" onMovieSelect={openMovieModal}/>
          </div>
        )}

        {view === 'newpopular' && !searchQuery.trim() && (
          <div className="more-cards">
            <h1 style={{marginLeft: '20px', marginTop: '20px'}}>New & Popular</h1>
            <TitleCards title={"Recently Released"} mode="normal" onMovieSelect={openMovieModal}/>
            <TitleCards title={"Popular Now"} mode="shuffle" onMovieSelect={openMovieModal}/>
            <TitleCards title={"Trending"} mode="reverse" onMovieSelect={openMovieModal}/>
          </div>
        )}

        {view === 'mylist' && !searchQuery.trim() && (
          <div className="more-cards">
            <h1 style={{marginLeft: '20px', marginTop: '20px'}}>My List</h1>
            <p style={{marginLeft: '20px', color: '#999'}}>Your watchlist is empty</p>
          </div>
        )}

        {view === 'languages' && !searchQuery.trim() && (
          <div className="more-cards">
            <h1 style={{marginLeft: '20px', marginTop: '20px'}}>Browse by Language</h1>
            <TitleCards title={"English Movies"} mode="normal" onMovieSelect={openMovieModal}/>
            <TitleCards title={"Hindi Movies"} mode="reverse" onMovieSelect={openMovieModal}/>
            <TitleCards title={"Spanish Movies"} mode="shuffle" onMovieSelect={openMovieModal}/>
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
        />
      )}
      {videoMovie && <VideoModal movie={videoMovie} onClose={() => setVideoMovie(null)} />}
    </div>
  )
}

export default Home
