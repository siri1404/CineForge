import React from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FilterOptions } from '../../contexts/MoviesContext';

interface FilterPanelProps {
  genres: string[];
  movies: any[];
  filterOptions: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export default function FilterPanel({ genres, movies, filterOptions, onFilterChange }: FilterPanelProps) {
  const handleGenreToggle = (genre: string) => {
    const newGenres = filterOptions.genres.includes(genre)
      ? filterOptions.genres.filter(g => g !== genre)
      : [...filterOptions.genres, genre];
    
    onFilterChange({ ...filterOptions, genres: newGenres });
  };

  const handleYearRangeChange = (index: number, value: number) => {
    const newRange: [number, number] = [...filterOptions.yearRange];
    newRange[index] = value;
    onFilterChange({ ...filterOptions, yearRange: newRange });
  };

  const handleRatingRangeChange = (index: number, value: number) => {
    const newRange: [number, number] = [...filterOptions.ratingRange];
    newRange[index] = value;
    onFilterChange({ ...filterOptions, ratingRange: newRange });
  };

  const handleSortChange = (sortBy: string, sortOrder: string) => {
    onFilterChange({ 
      ...filterOptions, 
      sortBy: sortBy as any, 
      sortOrder: sortOrder as any 
    });
  };

  const clearFilters = () => {
    onFilterChange({
      genres: [],
      yearRange: [1990, 2024],
      ratingRange: [0, 10],
      sortBy: 'popularity',
      sortOrder: 'desc'
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900/60 backdrop-blur-sm rounded-xl shadow-2xl border border-red-900/30 p-6 sticky top-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={clearFilters}
          className="text-gray-400 hover:text-red-400 transition-colors"
        >
          <XMarkIcon className="h-5 w-5" />
        </motion.button>
      </div>

      <div className="space-y-6">
        {/* Genres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h4 className="text-sm font-medium text-gray-300 mb-3">Genres</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {genres.map((genre, index) => (
              <motion.label 
                key={genre}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
                className="flex items-center space-x-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filterOptions.genres.includes(genre)}
                  onChange={() => handleGenreToggle(genre)}
                  className="w-4 h-4 text-red-600 bg-gray-800 border-gray-700 rounded focus:ring-red-500 focus:ring-2"
                />
                <span className="text-gray-400 group-hover:text-white transition-colors">
                  {genre}
                </span>
                <span className="text-xs text-gray-500 ml-auto">
                  {movies.filter(movie => movie.genres.includes(genre)).length}
                </span>
              </motion.label>
            ))}
          </div>
        </motion.div>

        {/* Year Range */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h4 className="text-sm font-medium text-gray-300 mb-3">Release Year</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1900"
                max="2024"
                value={filterOptions.yearRange[0]}
                onChange={(e) => handleYearRangeChange(0, parseInt(e.target.value))}
                className="w-20 px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded focus:ring-1 focus:ring-red-500 focus:border-transparent text-white"
              />
              <span className="text-gray-400">to</span>
              <input
                type="number"
                min="1900"
                max="2024"
                value={filterOptions.yearRange[1]}
                onChange={(e) => handleYearRangeChange(1, parseInt(e.target.value))}
                className="w-20 px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded focus:ring-1 focus:ring-red-500 focus:border-transparent text-white"
              />
            </div>
            <input
              type="range"
              min="1900"
              max="2024"
              value={filterOptions.yearRange[1]}
              onChange={(e) => handleYearRangeChange(1, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>
        </motion.div>

        {/* Rating Range */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h4 className="text-sm font-medium text-gray-300 mb-3">Rating</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={filterOptions.ratingRange[0]}
                onChange={(e) => handleRatingRangeChange(0, parseFloat(e.target.value))}
                className="w-16 px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded focus:ring-1 focus:ring-red-500 focus:border-transparent text-white"
              />
              <span className="text-gray-400">to</span>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={filterOptions.ratingRange[1]}
                onChange={(e) => handleRatingRangeChange(1, parseFloat(e.target.value))}
                className="w-16 px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded focus:ring-1 focus:ring-red-500 focus:border-transparent text-white"
              />
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={filterOptions.ratingRange[1]}
              onChange={(e) => handleRatingRangeChange(1, parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>
        </motion.div>

        {/* Sort Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h4 className="text-sm font-medium text-gray-300 mb-3">Sort By</h4>
          <div className="space-y-2">
            <select
              value={filterOptions.sortBy}
              onChange={(e) => handleSortChange(e.target.value, filterOptions.sortOrder)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
            >
              <option value="popularity">Popularity</option>
              <option value="rating">Rating</option>
              <option value="release_date">Release Date</option>
              <option value="title">Title</option>
            </select>
            <select
              value={filterOptions.sortOrder}
              onChange={(e) => handleSortChange(filterOptions.sortBy, e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}