import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ContentToggle from '../components/ContentToggle';
import TrendingSection from '../components/TrendingSection';
import VideoPlayer from '../components/VideoPlayer';

const Home = () => {
  const [activeMode, setActiveMode] = useState('movies');
  const [content, setContent] = useState({
    movies: [],
    tv: []
  });
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  const API_KEY = 'b7cd3340a794e5a2f35e3abb820b497f';

  useEffect(() => {
    fetchTrendingContent('movies');
    fetchTrendingContent('tv');
  }, []);

  const fetchTrendingContent = async (type) => {
    try {
      setLoading(true);
      
      const endpoint = type === 'movies' 
        ? `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
        : `https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`;

      const response = await fetch(endpoint);
      const data = await response.json();

      setContent(prev => ({
        ...prev,
        [type]: data.results?.slice(0, 6) || []
      }));

    } catch (error) {
      console.error(`Error fetching trending ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = async (newMode) => {
    if (newMode === activeMode) return;
    
    setLoading(true);
    setActiveMode(newMode);
    
    // Add a small delay for smooth transition
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  const handlePlayClick = async (movie) => {
    try {
      // Fetch detailed movie information
      const response = await fetch(
        `https://api.themoviedb.org/3/${activeMode === 'movies' ? 'movie' : 'tv'}/${movie.id}?api_key=${API_KEY}`
      );
      const detailedMovie = await response.json();
      
      setSelectedMovie(detailedMovie);
      setShowVideoPlayer(true);
      
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setSelectedMovie(movie);
      setShowVideoPlayer(true);
    }
  };

  const handleClosePlayer = () => {
    setShowVideoPlayer(false);
    setSelectedMovie(null);
  };

  return (
    <div className="home-page">
      <VideoPlayer 
        movie={selectedMovie}
        onClose={handleClosePlayer}
        isVisible={showVideoPlayer}
      />
      
      <motion.div
        className="content-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section with Featured Content */}
        <section className="hero-section-enhanced">
          <div className="hero-background">
            <img 
              src="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2" 
              alt="Hero background"
            />
            <div className="hero-gradient" />
          </div>
          
          <div className="hero-content-enhanced">
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="hero-title-enhanced">
                  F1 The Movie (2025)
                </h1>
                <div className="hero-meta-enhanced">
                  <span className="hero-rating">
                    ⭐ 7.9
                  </span>
                  <span className="hero-year">2025</span>
                </div>
                <p className="hero-description-enhanced">
                  Racing legend Sonny Hayes is coaxed out of retirement to lead a struggling Formula 1 
                  team—and mentor a young hotshot driver—while chasing one more chance at glory.
                </p>
                <div className="hero-buttons-enhanced">
                  <button className="hero-btn-play">
                    ▶ Watch Now
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content Toggle */}
        <section className="toggle-section">
          <div className="container">
            <ContentToggle 
              activeMode={activeMode}
              onModeChange={handleModeChange}
              loading={loading}
            />
          </div>
        </section>

        {/* Trending Content */}
        <TrendingSection
          content={content[activeMode]}
          loading={loading}
          contentType={activeMode}
          onPlayClick={handlePlayClick}
        />
      </motion.div>
    </div>
  );
};

export default Home;