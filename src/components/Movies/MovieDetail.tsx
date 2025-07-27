import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovieData } from '../../hooks/useMovieData';
import { MovieApiService } from '../../services/movieApi';
import { StarIcon, ClockIcon, CalendarIcon, TagIcon, PlayIcon, HeartIcon } from '@heroicons/react/24/solid';
import { ArrowLeftIcon, PlusIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useMovies } from '../../contexts/MoviesContext';
import { useAuth } from '../../contexts/AuthContext';
import { AISummaryService, MovieSummary } from '../../services/aiSummaryApi';
import ReviewSection from './ReviewSection';
import StreamingProviders from './StreamingProviders';
import CastCrew from './CastCrew';
import SimilarMovies from './SimilarMovies';

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, addToFavorites, removeFromFavorites, isFavorite } = useAuth();
  const { movies, userMovies, addToShelf, rateMovie, getMovieReviews, getSimilarMovies } = useMovies();
  
  // Use real movie data hook
  const { 
    movie: realMovie, 
    credits, 
    reviews: tmdbReviews, 
    videos, 
    similar, 
    watchProviders,
    loading: movieLoading 
  } = useMovieData(parseInt(id || '0'));
  
  const [selectedShelf, setSelectedShelf] = useState('want-to-watch');
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [aiSummary, setAiSummary] = useState<MovieSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Use real movie data if available, fallback to mock data
  const movie = realMovie ? {
    id: realMovie.id.toString(),
    title: realMovie.title,
    director: credits?.crew.find(c => c.job === 'Director')?.name || 'Director TBD',
    poster: MovieApiService.getImageUrl(realMovie.poster_path, 'w500') || '',
    backdrop: MovieApiService.getImageUrl(realMovie.backdrop_path, 'w1280') || '',
    rating: realMovie.vote_average,
    ratingsCount: realMovie.vote_count,
    runtime: realMovie.runtime || 120,
    releaseYear: new Date(realMovie.release_date).getFullYear(),
    description: realMovie.overview,
    genres: realMovie.genres?.map((g: any) => g.name) || [],
    imdbId: realMovie.imdb_id || '',
    tmdbId: realMovie.id.toString(),
    cast: credits?.cast.slice(0, 10).map(c => ({
      id: c.id.toString(),
      name: c.name,
      character: c.character,
      profilePath: MovieApiService.getImageUrl(c.profile_path, 'w200') || ''
    })) || [],
    crew: credits?.crew.slice(0, 5).map(c => ({
      id: c.id.toString(),
      name: c.name,
      job: c.job,
      department: c.department,
      profilePath: MovieApiService.getImageUrl(c.profile_path, 'w200') || ''
    })) || [],
    streamingProviders: watchProviders?.results?.US ? [
      ...(watchProviders.results.US.flatrate?.map(p => ({
        provider: p.provider_name,
        logo: '🎬',
        type: 'stream' as const,
        link: watchProviders.results.US.link
      })) || []),
      ...(watchProviders.results.US.rent?.map(p => ({
        provider: p.provider_name,
        logo: '💰',
        type: 'rent' as const,
        link: watchProviders.results.US.link
      })) || [])
    ] : [],
    trending: false,
    popularity: realMovie.popularity || 0
  } : movies.find(m => m.id === id);
  
  const userMovie = userMovies.find(m => m.id === id);
  const movieReviews = movie ? [
    ...getMovieReviews(movie.id),
    ...(tmdbReviews?.results.slice(0, 5).map(r => ({
      id: r.id,
      userId: r.author_details.username,
      userName: r.author_details.name || r.author,
      userAvatar: r.author_details.avatar_path 
        ? MovieApiService.getImageUrl(r.author_details.avatar_path, 'w200') 
        : 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100',
      movieId: movie.id,
      rating: r.author_details.rating || 5,
      review: r.content.length > 500 ? r.content.substring(0, 500) + '...' : r.content,
      date: new Date(r.created_at).toLocaleDateString(),
      likes: Math.floor(Math.random() * 50),
      replies: [],
      isLiked: false
    })) || [])
  ] : [];
  const similarMovies = movie ? getSimilarMovies(movie.id) : [];

  if (movieLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white uppercase tracking-wide">Loading Movie...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 flex items-center justify-center">
        <p className="text-center text-gray-400">Movie not found</p>
      </div>
    );
  }

  const handleAddToShelf = () => {
    addToShelf(movie, selectedShelf);
  };

  const handleRateMovie = () => {
    if (userRating > 0) {
      rateMovie(movie.id, userRating, review);
      setShowReviewModal(false);
      setUserRating(0);
      setReview('');
    }
  };

  const handleFavoriteToggle = () => {
    if (!movie) return;
    
    console.log('Toggling favorite for movie:', movie.id);
    console.log('Current favorites:', user?.favoriteMovies);
    console.log('Is currently favorite:', isFavorite(movie.id));
    
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
      console.log('Removed from favorites');
    } else {
      addToFavorites(movie.id);
      console.log('Added to favorites');
    }
    
    console.log('New favorites:', user?.favoriteMovies);
  };

  const handleGenerateSummary = async () => {
    if (!movie) return;
    
    setSummaryLoading(true);
    setShowSummaryModal(true);
    
    try {
      const summary = await AISummaryService.generateMovieSummary({
        title: movie.title,
        description: movie.description,
        director: movie.director,
        genres: movie.genres,
        releaseYear: movie.releaseYear,
        cast: movie.cast.map(c => c.name)
      });
      
      setAiSummary(summary);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 relative">
      {/* Hero Section with Backdrop */}
      <div className="relative h-screen overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img 
            src={movie.backdrop} 
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40" />
        </motion.div>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 z-20 flex items-center space-x-2 text-white/80 hover:text-red-400 transition-colors bg-black/30 backdrop-blur-sm rounded-full px-4 py-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back</span>
        </motion.button>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
              {/* Movie Poster */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-1"
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  transition={{ duration: 0.3 }}
                  className="relative group max-w-sm mx-auto lg:mx-0"
                >
                  <img 
                    src={movie.poster} 
                    alt={movie.title}
                    className="w-full rounded-xl shadow-2xl border border-red-900/30"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <PlayIcon className="h-16 w-16 text-red-500" />
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Movie Info */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="lg:col-span-2 space-y-6"
              >
                <div>
                  <motion.h1 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent mb-4"
                  >
                    {movie.title}
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-xl text-gray-300 mb-4"
                  >
                    Directed by {movie.director}
                  </motion.p>
                  
                  {/* Rating and Stats */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="flex items-center space-x-6 text-sm text-gray-300 mb-6"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon 
                            key={i} 
                            className={`h-5 w-5 ${i < Math.floor(movie.rating) ? 'text-yellow-400' : 'text-gray-600'}`} 
                          />
                        ))}
                      </div>
                      <span className="font-medium text-white text-lg">{movie.rating}</span>
                      <span>({movie.ratingsCount.toLocaleString()} ratings)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-4 w-4 text-red-400" />
                      <span>{movie.runtime} min</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-red-400" />
                      <span>{movie.releaseYear}</span>
                    </div>
                  </motion.div>

                  {/* Genres */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="flex flex-wrap gap-2 mb-6"
                  >
                    {movie.genres.map((genre, index) => (
                      <motion.span 
                        key={genre}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.4 + index * 0.1, duration: 0.4 }}
                        className="px-3 py-1 bg-red-900/30 text-red-300 text-sm rounded-full border border-red-800/30"
                      >
                        {genre}
                      </motion.span>
                    ))}
                  </motion.div>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                    className="text-gray-300 text-lg leading-relaxed max-w-3xl"
                  >
                    {movie.description}
                  </motion.p>
                </div>

                {/* Action Buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 0.6 }}
                  className="flex flex-wrap gap-4"
                >
                  {!userMovie ? (
                    <>
                      <select
                        value={selectedShelf}
                        onChange={(e) => setSelectedShelf(e.target.value)}
                        className="px-4 py-2 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                      >
                        <option value="want-to-watch">Want to Watch</option>
                        <option value="currently-watching">Currently Watching</option>
                        <option value="watched">Watched</option>
                      </select>
                      <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(239, 68, 68, 0.5)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddToShelf}
                        className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-200"
                      >
                        <PlusIcon className="h-5 w-5" />
                        <span>Add to Watchlist</span>
                      </motion.button>
                    </>
                  ) : (
                    <div className="bg-green-900/30 border border-green-700/50 text-green-300 px-6 py-3 rounded-lg">
                      ✓ In your {userMovie.shelf.replace('-', ' ')} list
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowReviewModal(true)}
                    className="flex items-center space-x-2 bg-gray-800/80 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-gray-700/80 transition-colors border border-gray-700"
                  >
                    <StarIcon className="h-5 w-5" />
                    <span>Rate & Review</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFavoriteToggle}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 border ${
                      isFavorite(movie.id)
                        ? 'bg-red-600 text-white border-red-500 hover:bg-red-700'
                        : 'bg-gray-800/80 backdrop-blur-sm text-white border-gray-700 hover:bg-gray-700/80'
                    }`}
                  >
                    <HeartIcon className="h-5 w-5" />
                    <span>{isFavorite(movie.id) ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGenerateSummary}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 border border-blue-500"
                  >
                    <ChatBubbleLeftIcon className="h-5 w-5" />
                    <span>AI Summary</span>
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Streaming Providers */}
        <StreamingProviders providers={movie.streamingProviders} />

        {/* Cast & Crew */}
        <CastCrew cast={movie.cast} crew={movie.crew} />

        {/* Reviews */}
        <ReviewSection 
          reviews={movieReviews} 
          movieId={movie.id}
          userMovie={userMovie}
        />

        {/* Similar Movies */}
        <SimilarMovies movies={similarMovies} />
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-red-900/30"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Rate & Review</h3>
            
            {/* Star Rating */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-300 mb-2">Your Rating:</p>
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setUserRating(i + 1)}
                    className="p-1"
                  >
                    <StarIcon 
                      className={`h-8 w-8 ${
                        i < userRating ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'
                      } transition-colors`} 
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Write a review (optional):
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
                placeholder="Share your thoughts about this movie..."
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRateMovie}
                disabled={userRating === 0}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white py-2 px-4 rounded-lg hover:from-red-700 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Submit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowReviewModal(false)}
                className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* AI Summary Modal */}
      {showSummaryModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-red-900/30"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-white">AI Movie Analysis</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowSummaryModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              <p className="text-gray-400 mt-2">Comprehensive analysis of "{movie?.title}"</p>
            </div>

            {/* Content */}
            <div className="p-6">
              {summaryLoading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white text-lg">Generating AI Analysis...</p>
                  <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
                </div>
              ) : aiSummary ? (
                <div className="space-y-8">
                  {/* Quick Summary */}
                  <section>
                    <h4 className="text-xl font-semibold text-red-400 mb-3">Quick Summary</h4>
                    <p className="text-gray-300 leading-relaxed">{aiSummary.shortSummary}</p>
                  </section>

                  {/* Detailed Analysis */}
                  <section>
                    <h4 className="text-xl font-semibold text-red-400 mb-3">Detailed Analysis</h4>
                    <div className="text-gray-300 leading-relaxed whitespace-pre-line">{aiSummary.detailedSummary}</div>
                  </section>

                  {/* Key Themes */}
                  <section>
                    <h4 className="text-xl font-semibold text-red-400 mb-3">Key Themes</h4>
                    <div className="flex flex-wrap gap-2">
                      {aiSummary.keyThemes.map((theme, index) => (
                        <span key={index} className="px-3 py-1 bg-red-900/30 text-red-300 rounded-full text-sm">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </section>

                  {/* Plot Points */}
                  <section>
                    <h4 className="text-xl font-semibold text-red-400 mb-3">Main Plot Points</h4>
                    <ul className="space-y-2">
                      {aiSummary.plotPoints.map((point, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-red-400 mt-1">•</span>
                          <span className="text-gray-300">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Character Analysis */}
                  <section>
                    <h4 className="text-xl font-semibold text-red-400 mb-3">Character Analysis</h4>
                    <p className="text-gray-300 leading-relaxed">{aiSummary.characterAnalysis}</p>
                  </section>

                  {/* Cinematic Elements */}
                  <section>
                    <h4 className="text-xl font-semibold text-red-400 mb-3">Cinematic Elements</h4>
                    <p className="text-gray-300 leading-relaxed">{aiSummary.cinematicElements}</p>
                  </section>

                  {/* Cultural Impact */}
                  <section>
                    <h4 className="text-xl font-semibold text-red-400 mb-3">Cultural Impact</h4>
                    <p className="text-gray-300 leading-relaxed">{aiSummary.culturalImpact}</p>
                  </section>

                  {/* Recommendation */}
                  <section>
                    <h4 className="text-xl font-semibold text-red-400 mb-3">Recommendation</h4>
                    <p className="text-gray-300 leading-relaxed">{aiSummary.recommendation}</p>
                  </section>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">Failed to generate summary. Please try again.</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}