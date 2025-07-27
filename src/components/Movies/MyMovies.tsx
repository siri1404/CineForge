import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FilmIcon } from '@heroicons/react/24/outline';
import { useMovies } from '../../contexts/MoviesContext';
import MovieCard from './MovieCard';

export default function MyMovies() {
  const { userMovies } = useMovies();
  const [activeTab, setActiveTab] = useState<'want-to-watch' | 'currently-watching' | 'watched'>('want-to-watch');

  const tabs = [
    { id: 'want-to-watch', label: 'Want to Watch' },
    { id: 'currently-watching', label: 'Currently Watching' },
    { id: 'watched', label: 'Watched' }
  ] as const;

  const filteredMovies = userMovies.filter(movie => movie.shelf === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
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
            scale: [1.1, 1, 1.1],
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
            My Movies
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-400 text-lg"
          >
            Organize and track your cinematic journey
          </motion.p>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="border-b border-gray-800 mb-8"
        >
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-400'
                    : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700'
                }`}
              >
                {tab.label}
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
                  className="ml-2 bg-gray-800 text-gray-400 py-0.5 px-2 rounded-full text-xs"
                >
                  {userMovies.filter(movie => movie.shelf === tab.id).length}
                </motion.span>
              </motion.button>
            ))}
          </nav>
        </motion.div>

        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            {filteredMovies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  delay: 1.4 + index * 0.1, 
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
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.4, duration: 0.6, type: "spring" }}
                className="bg-red-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-red-500/30"
              >
                <FilmIcon className="h-8 w-8 text-red-500" />
              </motion.div>
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.6 }}
                className="text-lg font-medium text-white mb-2"
              >
                No movies in this list yet
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.6 }}
                className="text-gray-400 mb-6"
              >
                {activeTab === 'want-to-watch' && "Start building your watchlist by adding movies you'd like to see."}
                {activeTab === 'currently-watching' && "Begin your viewing journey by moving movies from your 'Want to Watch' list."}
                {activeTab === 'watched' && "Mark movies as watched to track your viewing progress and build your collection."}
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.6 }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(239, 68, 68, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.history.back()}
                className="bg-gradient-to-r from-red-600 to-red-500 text-white py-2 px-4 rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-200"
              >
                Discover Movies
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}