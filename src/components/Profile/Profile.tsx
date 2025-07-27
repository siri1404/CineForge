import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CameraIcon, CalendarIcon, FilmIcon, TrophyIcon, KeyIcon, BellIcon, ShieldCheckIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useMovies } from '../../contexts/MoviesContext';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { userMovies } = useMovies();
  const favoriteMovies = userMovies.filter(movie => (user?.favoriteMovies || []).includes(movie.id));
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'privacy' | 'notifications'>('profile');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [watchingGoal, setWatchingGoal] = useState(user?.watchingGoal || 0);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    movieRecommendations: true,
    socialActivity: false,
    watchingReminders: true
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showWatchingActivity: true,
    showRatings: true,
    allowFriendRequests: true
  });

  const handleSave = () => {
    updateUser({ name, email, watchingGoal });
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    // In a real app, this would make an API call
    alert('Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FilmIcon },
    { id: 'account', label: 'Account', icon: ShieldCheckIcon },
    { id: 'privacy', label: 'Privacy', icon: EyeIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon }
  ] as const;
  const stats = {
    totalMovies: userMovies.length,
    moviesWatched: userMovies.filter(movie => movie.shelf === 'watched').length,
    currentlyWatching: userMovies.filter(movie => movie.shelf === 'currently-watching').length,
    wantToWatch: userMovies.filter(movie => movie.shelf === 'want-to-watch').length
  };

  const recentMovies = userMovies.slice(0, 6);

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
            Account Settings
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-400 text-lg"
          >
            Manage your profile and account preferences
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
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-400'
                    : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </nav>
        </motion.div>

        {/* Tab Content */}
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl shadow-2xl border border-red-900/30 p-8">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-8">
                {/* Avatar */}
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img 
                      src={user?.avatar} 
                      alt={user?.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-red-500/30"
                    />
                  </motion.div>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                  >
                    <CameraIcon className="h-4 w-4" />
                  </motion.button>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  {isEditing ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-2xl font-bold bg-transparent border-b-2 border-red-500 focus:outline-none focus:border-red-400 text-white w-full"
                        placeholder="Full Name"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-lg bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent text-white w-full"
                        placeholder="Email Address"
                      />
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">Watching Goal:</span>
                        <input
                          type="number"
                          value={watchingGoal}
                          onChange={(e) => setWatchingGoal(parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                        />
                        <span className="text-gray-400">movies/year</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSave}
                          className="bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-200"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
                        {user?.name}
                      </h1>
                      <p className="text-gray-400 flex items-center justify-center md:justify-start space-x-1">
                        <span>{user?.email}</span>
                      </p>
                      <p className="text-gray-400 flex items-center justify-center md:justify-start space-x-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>Joined {new Date(user?.joinedDate || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                      </p>
                      <p className="text-gray-400">Watching Goal: {user?.watchingGoal} movies this year</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(true)}
                        className="bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-200"
                      >
                        Edit Profile
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { value: stats.totalMovies, label: 'Total Movies', color: 'from-red-500 to-red-400' },
                  { value: stats.moviesWatched, label: 'Movies Watched', color: 'from-green-500 to-green-400' },
                  { value: (user?.favoriteMovies || []).length, label: 'Favorite Movies', color: 'from-pink-500 to-pink-400' },
                  { value: stats.wantToWatch, label: 'Want to Watch', color: 'from-purple-500 to-purple-400' }
                ].map((stat, index) => (
                  <div 
                    key={stat.label}
                    className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-gray-700/60 transition-all duration-300"
                  >
                    <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'account' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Account Security</h3>
              
              {/* Change Password */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-300">Change Password</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-200"
                    >
                      {showCurrentPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-200"
                    >
                      {showNewPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <button
                  onClick={handlePasswordChange}
                  className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-2 rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-200"
                >
                  Update Password
                </button>
              </div>

              {/* Account Actions */}
              <div className="border-t border-gray-700 pt-6">
                <h4 className="text-lg font-medium text-gray-300 mb-4">Account Actions</h4>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 bg-gray-800/60 rounded-lg hover:bg-gray-700/60 transition-colors text-gray-300">
                    Export My Data
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-800/60 rounded-lg hover:bg-gray-700/60 transition-colors text-gray-300">
                    Download Account Information
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-red-900/30 rounded-lg hover:bg-red-800/40 transition-colors text-red-300">
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Privacy Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/60 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">Profile Visibility</h4>
                    <p className="text-sm text-gray-400">Control who can see your profile</p>
                  </div>
                  <select
                    value={privacy.profileVisibility}
                    onChange={(e) => setPrivacy({...privacy, profileVisibility: e.target.value})}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/60 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">Show Watching Activity</h4>
                    <p className="text-sm text-gray-400">Let others see what you're watching</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacy.showWatchingActivity}
                      onChange={(e) => setPrivacy({...privacy, showWatchingActivity: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/60 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">Show Ratings</h4>
                    <p className="text-sm text-gray-400">Display your movie ratings publicly</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacy.showRatings}
                      onChange={(e) => setPrivacy({...privacy, showRatings: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/60 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">Allow Friend Requests</h4>
                    <p className="text-sm text-gray-400">Let others send you friend requests</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacy.allowFriendRequests}
                      onChange={(e) => setPrivacy({...privacy, allowFriendRequests: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Notification Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/60 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">Email Updates</h4>
                    <p className="text-sm text-gray-400">Receive updates about new features and movies</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailUpdates}
                      onChange={(e) => setNotifications({...notifications, emailUpdates: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/60 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">Movie Recommendations</h4>
                    <p className="text-sm text-gray-400">Get personalized movie suggestions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.movieRecommendations}
                      onChange={(e) => setNotifications({...notifications, movieRecommendations: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/60 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">Social Activity</h4>
                    <p className="text-sm text-gray-400">Notifications about friend activity</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.socialActivity}
                      onChange={(e) => setNotifications({...notifications, socialActivity: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/60 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">Watching Reminders</h4>
                    <p className="text-sm text-gray-400">Reminders about movies in your watchlist</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.watchingReminders}
                      onChange={(e) => setNotifications({...notifications, watchingReminders: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}