import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, ClockIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { Movie } from '../../contexts/MoviesContext';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <motion.div
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 }
      }}
      className="group relative"
    >
      <Link to={`/movie/${movie.id}`} className="block">
        <div className="bg-gray-900 relative overflow-hidden">
          {/* Unique corner cuts */}
          <div className="absolute top-0 right-0 w-4 h-4 bg-black" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />
          <div className="absolute bottom-0 left-0 w-4 h-4 bg-black" style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }} />
          
          {/* Movie Poster */}
          <div className="aspect-[2/3] relative overflow-hidden">
            <motion.img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                whileHover={{ scale: 1, rotate: 0 }}
                className="w-16 h-16 border-2 border-white flex items-center justify-center"
              >
                <div className="w-0 h-0 border-l-8 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1"></div>
              </motion.div>
            </div>

            {/* Rating Badge */}
            <div className="absolute top-4 right-4 bg-black bg-opacity-80 px-2 py-1">
              <div className="flex items-center space-x-1">
                <StarIcon className="h-3 w-3 text-yellow-400" />
                <span className="text-white text-xs font-bold">{movie.rating}</span>
              </div>
            </div>

            {/* Runtime Badge */}
            <div className="absolute bottom-4 left-4 bg-red-600 px-2 py-1">
              <div className="flex items-center space-x-1">
                <ClockIcon className="h-3 w-3 text-white" />
                <span className="text-white text-xs font-bold">{movie.runtime}m</span>
              </div>
            </div>
          </div>

          {/* Movie Info */}
          <div className="p-4 relative">
            {/* Accent line */}
            <div className="absolute top-0 left-4 w-8 h-0.5 bg-red-600"></div>
            
            <motion.h3
              className="font-bold text-white text-sm mb-2 line-clamp-2 uppercase tracking-wide group-hover:text-red-400 transition-colors duration-300"
            >
              {movie.title}
            </motion.h3>
            
            <p className="text-gray-400 text-xs mb-3 uppercase tracking-wide">
              {movie.director}
            </p>

            {/* Genre Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {movie.genres.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-1 bg-gray-800 text-gray-300 text-xs uppercase tracking-wide border border-gray-700"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Bottom Info */}
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs font-bold">{movie.releaseYear}</span>
              
              {/* Trending Indicator */}
              {movie.trending && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-600"></div>
                  <span className="text-xs text-red-400 font-bold uppercase tracking-wide">Hot</span>
                </div>
              )}
            </div>
          </div>

          {/* Hover border effect */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-600 transition-colors duration-300 pointer-events-none"></div>
        </div>
      </Link>
    </motion.div>
  );
}