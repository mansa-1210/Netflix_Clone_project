import React from 'react'
import './Home.css'
import Navbar from '../../components/Navbar/Navbar'
import hero_banner from '../../assets/hero_banner.jpg'
import hero_title from '../../assets/hero_title.png'
import play_icon from '../../assets/play_icon.png'
import info_icon from '../../assets/info_icon.png'
import TitleCards from '../../components/TitileCards/TitleCards'
import Footer from '../../components/Footer/Footer'
import { useSearchParams } from 'react-router-dom'


const Home = () => {
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view') || 'home';

  return (
    <div className='home'>
      <Navbar/>
      
      <div className="page-content">
        {view === 'home' && (
          <>
            <div className="hero">
              <img src={hero_banner} alt="" className='banner-img'/>
              <div className="hero-caption">
                <img src={hero_title} alt="" className='caption-img'/>
                <p>Discovering his ties to a secret ancient order, a young man living in modern Istanbul embarks on a quest to save the city from an immortal enemy.</p>
                <div className="hero-btns">
                  <button className='btn'><img src={play_icon} alt="" />Play</button>
                  <button className='btn dark-btn'><img src={info_icon} alt="" />More Info</button>
                </div>
                <TitleCards mode="normal"/>
              </div>
            </div>
            <div className="more-cards">
            <TitleCards title={"Blockbuster Movies"} category={"top_rated"} mode="reverse"/>
            <TitleCards title={"Only on Netflix"} category={"popular"} mode="shuffle"/>
            <TitleCards title={"Upcoming"} category={"upcoming"} mode="offset"/>
            <TitleCards title={"Top Pics for You"} category={"now_playing"} mode="reverse"/>
            </div>
          </>
        )}

        {view === 'tvshows' && (
          <div className="more-cards">
            <h1 style={{marginLeft: '20px', marginTop: '20px'}}>TV Shows</h1>
            <TitleCards title={"Popular TV Shows"} category={"tv/popular"} mode="normal"/>
            <TitleCards title={"Top Rated TV Shows"} category={"tv/top_rated"} mode="reverse"/>
            <TitleCards title={"On The Air"} category={"tv/on_the_air"} mode="shuffle"/>
            <TitleCards title={"Airing Today"} category={"tv/airing_today"} mode="offset"/>
          </div>
        )}

        {view === 'movies' && (
          <div className="more-cards">
            <h1 style={{marginLeft: '20px', marginTop: '20px'}}>Movies</h1>
            <TitleCards title={"Popular Movies"} category={"popular"} mode="normal"/>
            <TitleCards title={"Top Rated Movies"} category={"top_rated"} mode="reverse"/>
            <TitleCards title={"Upcoming Movies"} category={"upcoming"} mode="shuffle"/>
            <TitleCards title={"Now Playing"} category={"now_playing"} mode="offset"/>
          </div>
        )}

        {view === 'newpopular' && (
          <div className="more-cards">
            <h1 style={{marginLeft: '20px', marginTop: '20px'}}>New & Popular</h1>
            <TitleCards title={"Recently Released"} category={"upcoming"} mode="normal"/>
            <TitleCards title={"Popular Now"} category={"popular"} mode="shuffle"/>
            <TitleCards title={"Trending"} category={"top_rated"} mode="reverse"/>
          </div>
        )}

        {view === 'mylist' && (
          <div className="more-cards">
            <h1 style={{marginLeft: '20px', marginTop: '20px'}}>My List</h1>
            <p style={{marginLeft: '20px', color: '#999'}}>Your watchlist is empty</p>
          </div>
        )}

        {view === 'languages' && (
          <div className="more-cards">
            <h1 style={{marginLeft: '20px', marginTop: '20px'}}>Browse by Language</h1>
            <TitleCards title={"English Movies"} category={"popular"} mode="normal"/>
            <TitleCards title={"Hindi Movies"} category={"top_rated"} mode="reverse"/>
            <TitleCards title={"Spanish Movies"} category={"upcoming"} mode="shuffle"/>
          </div>
        )}
      </div>

      <Footer/>
    </div>
  )
}

export default Home

