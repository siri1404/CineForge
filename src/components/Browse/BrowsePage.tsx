import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { MovieApiService } from '../../services/movieApi';
import { useMovies } from '../../contexts/MoviesContext';
import MovieCard from '../Movies/MovieCard';
import FilterPanel from './FilterPanel';

export default function BrowsePage() {
  const { movies, filterMovies, filterOptions, setFilterOptions, searchQuery, setSearchQuery, loadMoreMovies, hasMoreMovies, isLoading } = useMovies();
  const [showFilters, setShowFilters] = useState(false);
  const [filteredMovies, setFilteredMovies] = useState(movies);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [realTimeResults, setRealTimeResults] = useState<any[]>([]);

  useEffect(() => {
    // Debounced search and filter
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      const performSearch = async () => {
        let results = movies;
        
        if (searchQuery.trim()) {
          // Search real-time with TMDB API
          try {
            const tmdbResults = await MovieApiService.searchMovies(searchQuery);
            const transformedResults = tmdbResults.results.slice(0, 20).map((movie: any) => ({
              id: movie.id.toString(),
              title: movie.title,
              director: 'Director TBD',
              poster: MovieApiService.getImageUrl(movie.poster_path, 'w500') || '',
              backdrop: MovieApiService.getImageUrl(movie.backdrop_path, 'w780') || '',
              rating: movie.vote_average,
              ratingsCount: movie.vote_count,
              runtime: 120,
              releaseYear: new Date(movie.release_date).getFullYear(),
              description: movie.overview,
              genres: [],
              trending: false,
              popularity: movie.popularity
            }));
            setRealTimeResults(transformedResults);
            return;
          } catch (error) {
            console.error('Search error:', error);
          }
          
          // Fallback to local search
          results = results.filter(movie => 
            movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
            movie.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        } else {
          setRealTimeResults([]);
        }
        
        results = filterMovies(filterOptions);
        setFilteredMovies(results);
      }

      performSearch();
    }, 300);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchQuery, filterOptions, movies, filterMovies]);

  // Use real-time results if searching, otherwise use filtered movies
  const displayMovies = searchQuery.trim() && realTimeResults.length > 0 
    ? realTimeResults 
    : filteredMovies;
  
  // Get all unique genres from movies
  const allGenres = Array.from(new Set(movies.flatMap(movie => movie.genres)))
    .filter(genre => genre && genre.trim() !== '')
    .sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/3 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent mb-2"
          >
            Browse Movies
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-400 text-lg"
          >
            Discover your next cinematic adventure
          </motion.p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="bg-gray-900/60 backdrop-blur-sm rounded-xl shadow-2xl border border-red-900/30 p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search movies, directors, genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>

            {/* Filter Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              <FunnelIcon className="h-5 w-5" />
              <span>Filters</span>
            </motion.button>
          </div>

          {/* Results Count */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-4 text-gray-400"
          >
            Showing {displayMovies.length} {searchQuery.trim() ? 'search results' : `of ${movies.length} movies`}
          </motion.div>
        </motion.div>

        <div className="flex gap-8">
          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.5 }}
              className="w-80 flex-shrink-0"
            >
              <FilterPanel
                genres={allGenres}
                movies={movies}
                filterOptions={filterOptions}
                onFilterChange={setFilterOptions}
              />
            </motion.div>
          )}

          {/* Movies Grid */}
          <div className="flex-1">
            {displayMovies.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              >
                {displayMovies.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      delay: 1.2 + index * 0.05, 
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    <MovieCard movie={movie} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="text-center py-12"
              >
                <div className="max-w-md mx-auto">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.6, type: "spring" }}
                    className="bg-red-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-red-500/30"
                  >
                    <MagnifyingGlassIcon className="h-8 w-8 text-red-500" />
                  </motion.div>
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                    className="text-lg font-medium text-white mb-2"
                  >
                    No movies found
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6, duration: 0.6 }}
                    className="text-gray-400"
                  >
                    Try adjusting your search terms or filters
                  </motion.p>
                </div>
              </motion.div>
            )}
            
            {/* Load More Button */}
            {!searchQuery.trim() && hasMoreMovies && displayMovies.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="text-center mt-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={loadMoreMovies}
                  disabled={isLoading}
                  className="bg-white text-black px-8 py-3 font-bold uppercase tracking-wide hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? 'Loading More Movies...' : 'Load More Movies'}
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}