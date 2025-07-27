import React from 'react';
import { motion } from 'framer-motion';
import { Movie } from '../../contexts/MoviesContext';
import MovieCard from './MovieCard';

interface SimilarMoviesProps {
  movies: Movie[];
}

export default function SimilarMovies({ movies }: SimilarMoviesProps) {
  if (movies.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gray-900/60 backdrop-blur-sm rounded-xl shadow-2xl border border-red-900/30 p-6"
    >
      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-2xl font-bold text-white mb-6"
      >
        You May Also Like
      </motion.h2>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        {movies.map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              delay: 0.6 + index * 0.1, 
              duration: 0.6,
              type: "spring",
              stiffness: 100
            }}
          >
            <MovieCard movie={movie} />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}