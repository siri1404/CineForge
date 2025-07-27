import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrophyIcon, CalendarIcon, FilmIcon, FireIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useMovies } from '../../contexts/MoviesContext';

export default function WatchingChallenge() {
  const { user, updateUser } = useAuth();
  const { userMovies } = useMovies();
  const [newGoal, setNewGoal] = useState(user?.watchingGoal || 0);
  const [isEditing, setIsEditing] = useState(false);

  const currentYear = new Date().getFullYear();
  const moviesWatched = userMovies.filter(movie => movie.shelf === 'watched').length;
  const progress = Math.min((moviesWatched / (user?.watchingGoal || 1)) * 100, 100);
  const remainingMovies = Math.max(0, (user?.watchingGoal || 0) - moviesWatched);
  
  // Calculate days remaining in year
  const endOfYear = new Date(currentYear, 11, 31);
  const today = new Date();
  const daysRemaining = Math.ceil((endOfYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate watching pace
  const averageMoviesPerMonth = moviesWatched / (12 - daysRemaining / 30);
  const moviesPerMonth = remainingMovies / (daysRemaining / 30);

  const handleUpdateGoal = () => {
    updateUser({ watchingGoal: newGoal });
    setIsEditing(false);
  };

  const achievements = [
    { id: 1, title: 'First Movie', description: 'Watch your first movie', achieved: moviesWatched >= 1 },
    { id: 2, title: 'Movie Buff', description: 'Watch 25 movies', achieved: moviesWatched >= 25 },
    { id: 3, title: 'Cinema Streak', description: 'Watch movies for 7 days straight', achieved: moviesWatched >= 10 },
    { id: 4, title: 'Goal Crusher', description: 'Reach your watching goal', achieved: moviesWatched >= (user?.watchingGoal || 0) },
  ];

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
            className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4 border border-red-500/30"
          >
            <TrophyIcon className="h-8 w-8 text-red-500" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent mb-2"
          >
            {currentYear} Watching Challenge
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-gray-400 text-lg"
          >
            Track your viewing progress and achieve your cinematic goals
          </motion.p>
        </motion.div>

        {/* Main Challenge Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="bg-gradient-to-r from-red-600 via-red-500 to-red-400 rounded-xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden"
        >
          {/* Animated background elements */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full"
          />
          
          <div className="text-center relative z-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, duration: 0.8, type: "spring" }}
              className="text-6xl font-bold mb-2"
            >
              {moviesWatched}
            </motion.div>
            {isEditing ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>of</span>
                  <input
                    type="number"
                    value={newGoal}
                    onChange={(e) => setNewGoal(parseInt(e.target.value) || 0)}
                    className="w-20 px-2 py-1 text-gray-900 rounded focus:ring-2 focus:ring-white focus:outline-none"
                  />
                  <span>movies</span>
                </div>
                <div className="flex justify-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUpdateGoal}
                    className="bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Save
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(false)}
                    className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors border border-white/30"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="space-y-2"
              >
                <div className="text-xl">of {user?.watchingGoal} movies</div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
                >
                  Update Goal
                </motion.button>
              </motion.div>
            )}
            
            {/* Progress Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.6 }}
              className="mt-6"
            >
              <div className="w-full bg-red-800/30 rounded-full h-4 overflow-hidden">
                <motion.div 
                  className="bg-white h-4 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, delay: 1.8 }}
                />
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.6 }}
                className="mt-2 text-lg font-medium"
              >
                {Math.round(progress)}% Complete
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {[
            { icon: CalendarIcon, value: daysRemaining, label: 'Days Remaining', color: 'text-blue-400' },
            { icon: FilmIcon, value: remainingMovies, label: 'Movies to Go', color: 'text-green-400' },
            { icon: FireIcon, value: Math.ceil(moviesPerMonth), label: 'Movies/Month Needed', color: 'text-red-400' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.4 + index * 0.1, duration: 0.6 }}
              className="bg-gray-900/60 backdrop-blur-sm rounded-xl shadow-2xl border border-red-900/30 p-6 text-center hover:border-red-500/50 transition-all duration-300"
            >
              <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 2.6 + index * 0.1, duration: 0.6, type: "spring" }}
                className="text-2xl font-bold text-white mb-1"
              >
                {stat.value}
              </motion.div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Achievements */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.8 }}
          className="bg-gray-900/60 backdrop-blur-sm rounded-xl shadow-2xl border border-red-900/30 p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div 
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 3 + index * 0.1, duration: 0.6 }}
                className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all duration-300 ${
                  achievement.achieved 
                    ? 'border-green-500/50 bg-green-900/20' 
                    : 'border-gray-700/50 bg-gray-800/20'
                }`}
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 3.2 + index * 0.1, duration: 0.4, type: "spring" }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    achievement.achieved ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <TrophyIcon className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <h3 className={`font-medium ${
                    achievement.achieved ? 'text-green-300' : 'text-gray-300'
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm ${
                    achievement.achieved ? 'text-green-400' : 'text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
                {achievement.achieved && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 3.4 + index * 0.1, duration: 0.4 }}
                    className="ml-auto"
                  >
                    <span className="text-green-400 text-2xl">✓</span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Watching Insights */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.4, duration: 0.8 }}
          className="bg-gray-900/60 backdrop-blur-sm rounded-xl shadow-2xl border border-red-900/30 p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Viewing Insights</h2>
          <div className="space-y-4 text-gray-300">
            {moviesWatched > 0 && (
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 3.6, duration: 0.6 }}
              >
                🎬 You've watched an average of {averageMoviesPerMonth.toFixed(1)} movies per month so far.
              </motion.p>
            )}
            {remainingMovies > 0 && (
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 3.8, duration: 0.6 }}
              >
                🎯 To reach your goal, you need to watch {moviesPerMonth.toFixed(1)} movies per month for the rest of the year.
              </motion.p>
            )}
            {progress >= 100 && (
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 4, duration: 0.6 }}
              >
                🎉 Congratulations! You've exceeded your watching goal for {currentYear}!
              </motion.p>
            )}
            {progress >= 50 && progress < 100 && (
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 4, duration: 0.6 }}
              >
                🔥 You're more than halfway to your goal! Keep up the great work!
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}