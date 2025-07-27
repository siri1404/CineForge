import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useMovies } from '../../contexts/MoviesContext';
import MovieCard from '../Movies/MovieCard';
import WatchingProgress from './WatchingProgress';
import ActivityFeed from './ActivityFeed';

export default function Dashboard() {
  const { user } = useAuth();
  const { movies, userMovies, trendingMovies, loadMoreMovies, hasMoreMovies, isLoading } = useMovies();

  const currentlyWatching = userMovies.filter(movie => movie.shelf === 'currently-watching');

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-12">
            {/* Currently Watching - Unique Layout */}
            {currentlyWatching.length > 0 && (
              <motion.section
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-red-600 mr-4" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
                  <h2 className="text-2xl font-bold text-white uppercase tracking-wide">Currently Watching</h2>
                </div>
                
                <div className="space-y-4">
                  {currentlyWatching.map((movie, index) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                      className="bg-gray-900 p-5 relative overflow-hidden group hover:bg-gray-800 transition-colors duration-300"
                    >
                      {/* Geometric accent */}
                      <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
                      
                      <div className="flex items-start space-x-5">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="relative"
                        >
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-20 h-30 object-cover"
                          />
                          <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-600 transition-colors duration-300"></div>
                        </motion.div>
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">
                            {movie.title}
                          </h3>
                          <p className="text-gray-400 mb-3 uppercase text-sm tracking-wide">{movie.director}</p>
                          <WatchingProgress movie={movie} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Trending Movies - Grid Layout */}
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-600 mr-4" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                  <h2 className="text-2xl font-bold text-white uppercase tracking-wide">Trending Now</h2>
                </div>
                <Link
                  to="/browse"
                  className="text-red-400 hover:text-white transition-colors font-bold uppercase tracking-wide text-sm border-b border-red-400 hover:border-white pb-1"
                >
                  View All ({movies.length}+ Movies)
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {trendingMovies.slice(0, 8).map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: 0.8 + index * 0.05, 
                      duration: 0.6
                    }}
                  >
                    <MovieCard movie={movie} />
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Recommendations */}
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-700 mr-4" style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }} />
                  <h2 className="text-2xl font-bold text-white uppercase tracking-wide">Recommended</h2>
                </div>
                <Link
                  to="/browse"
                  className="text-red-400 hover:text-white transition-colors font-bold uppercase tracking-wide text-sm border-b border-red-400 hover:border-white pb-1"
                >
                  Browse All Movies
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {movies.slice(0, 4).map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 + index * 0.05, duration: 0.6 }}
                  >
                    <MovieCard movie={movie} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Watching Challenge - Unique Design */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              className="bg-gray-900 p-5 relative overflow-hidden"
            >
              {/* Geometric decorations */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-600" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />
              <div className="absolute bottom-0 left-0 w-8 h-8 bg-gray-700" style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }} />
              
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-wide">
                  {new Date().getFullYear()} Challenge
                </h3>
                
                <div className="text-center mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="text-4xl font-bold text-red-400 mb-2"
                  >
                    {user?.moviesWatched}/{user?.watchingGoal}
                  </motion.div>
                  <p className="text-gray-400 uppercase tracking-wide text-sm">Movies Watched</p>
                </div>
                
                {/* Unique Progress Bar */}
                <div className="relative">
                  <div className="w-full h-2 bg-gray-800 mb-3"></div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${Math.min((user?.moviesWatched || 0) / (user?.watchingGoal || 1) * 100, 100)}%` 
                    }}
                    transition={{ delay: 1.4, duration: 1.5 }}
                    className="absolute top-0 left-0 h-2 bg-red-600"
                  />
                </div>
                
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  {Math.max(0, (user?.watchingGoal || 0) - (user?.moviesWatched || 0))} Remaining
                </p>
              </div>
            </motion.div>

            {/* Activity Feed */}
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
}