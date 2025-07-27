import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon, FilmIcon, HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid';
import { useMovies } from '../../contexts/MoviesContext';

export default function SocialFeed() {
  const { activities } = useMovies();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'watched':
        return <FilmIcon className="h-5 w-5 text-green-400" />;
      case 'rated':
        return <StarIcon className="h-5 w-5 text-yellow-400" />;
      case 'reviewed':
        return <ChatBubbleLeftIcon className="h-5 w-5 text-blue-400" />;
      case 'added':
        return <HeartIcon className="h-5 w-5 text-red-400" />;
      default:
        return <FilmIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case 'watched':
        return `finished watching`;
      case 'rated':
        return `rated`;
      case 'reviewed':
        return `reviewed`;
      case 'added':
        return `added to watchlist`;
      default:
        return 'interacted with';
    }
  };

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
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
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
            Social Feed
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-400 text-lg"
          >
            See what your friends are watching and discover new favorites
          </motion.p>
        </motion.div>

        {/* Activity Feed */}
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
              className="bg-gray-900/60 backdrop-blur-sm rounded-xl shadow-2xl border border-red-900/30 p-6 hover:border-red-500/50 transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                {/* User Avatar */}
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  src={activity.userAvatar} 
                  alt={activity.userName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-red-500/30"
                />

                <div className="flex-1">
                  {/* Activity Header */}
                  <div className="flex items-center space-x-2 mb-2">
                    {getActivityIcon(activity.type)}
                    <p className="text-white">
                      <span className="font-medium">{activity.userName}</span>
                      {' '}{getActivityText(activity)}{' '}
                      <span className="font-medium text-red-400">{activity.movieTitle}</span>
                      {activity.rating && (
                        <span className="ml-2 flex items-center space-x-1">
                          {Array.from({ length: activity.rating }).map((_, i) => (
                            <StarIcon key={i} className="h-3 w-3 text-yellow-400" />
                          ))}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Activity Content */}
                  <div className="flex items-start space-x-4">
                    <motion.img 
                      whileHover={{ scale: 1.05 }}
                      src={activity.moviePoster} 
                      alt={activity.movieTitle}
                      className="w-16 h-24 object-cover rounded-lg shadow-lg border border-red-900/30"
                    />
                    <div className="flex-1">
                      {activity.review && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                          className="text-gray-300 text-sm mb-2 italic"
                        >
                          "{activity.review}"
                        </motion.p>
                      )}
                      <p className="text-gray-500 text-xs">{activity.date}</p>
                    </div>
                  </div>

                  {/* Interaction Buttons */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                    className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-800"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <HeartIcon className="h-4 w-4" />
                      <span className="text-sm">Like</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <ChatBubbleLeftIcon className="h-4 w-4" />
                      <span className="text-sm">Comment</span>
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="text-center mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(239, 68, 68, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-3 rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-200"
          >
            Load More Activities
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}