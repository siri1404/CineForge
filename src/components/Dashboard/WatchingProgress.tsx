import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMovies, UserMovie } from '../../contexts/MoviesContext';

interface WatchingProgressProps {
  movie: UserMovie;
}

export default function WatchingProgress({ movie }: WatchingProgressProps) {
  const { updateMovieProgress } = useMovies();
  const [currentTime, setCurrentTime] = useState(movie.currentTime || 0);

  const handleProgressUpdate = () => {
    updateMovieProgress(movie.id, currentTime);
  };

  const progress = Math.round((currentTime / movie.runtime) * 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Progress</span>
        <span className="text-red-400 font-medium">{progress}%</span>
      </div>
      
      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
        <motion.div 
          className="bg-gradient-to-r from-red-600 to-red-400 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="number"
          min="0"
          max={movie.runtime}
          value={currentTime}
          onChange={(e) => setCurrentTime(parseInt(e.target.value) || 0)}
          className="w-20 px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded focus:ring-1 focus:ring-red-500 focus:border-transparent text-white"
        />
        <span className="text-sm text-gray-400">of {movie.runtime} min</span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleProgressUpdate}
          className="px-3 py-1 text-xs bg-gradient-to-r from-red-600 to-red-500 text-white rounded hover:from-red-700 hover:to-red-600 transition-all duration-200"
        >
          Update
        </motion.button>
      </div>
    </div>
  );
}