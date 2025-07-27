import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, FilmIcon, UserIcon, HomeIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useMovies } from '../../contexts/MoviesContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { user, logout } = useAuth();
  const { searchMovies } = useMovies();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchMovies(query);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', icon: HomeIcon, label: 'Home' },
    { to: '/browse', icon: MagnifyingGlassIcon, label: 'Browse' },
    { to: '/my-movies', icon: FilmIcon, label: 'My Movies' },
    { to: '/social', icon: UserIcon, label: 'Social' },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-black border-b border-gray-800 relative z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group mr-auto">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="w-10 h-10 bg-red-600 flex items-center justify-center relative">
                <div className="absolute inset-1 border border-white"></div>
                <FilmIcon className="h-5 w-5 text-white relative z-10" />
              </div>
            </motion.div>
            <span className="text-xl font-bold text-white uppercase tracking-wider group-hover:text-red-400 transition-colors">
              CineForge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            {navItems.map((item) => (
              <motion.div key={item.to} whileHover={{ y: -2 }}>
                <Link
                  to={item.to}
                  className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors uppercase tracking-wide text-sm font-bold"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="max-w-md mx-8 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="SEARCH MOVIES..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 uppercase tracking-wide text-sm"
              />
              <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            {/* Search Results */}
            {showResults && searchResults.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 bg-gray-900 border border-gray-700 mt-1 z-50 max-h-96 overflow-y-auto"
              >
                {searchResults.map(movie => (
                  <Link
                    key={movie.id}
                    to={`/movie/${movie.id}`}
                    className="flex items-center p-3 hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-b-0"
                    onClick={() => setShowResults(false)}
                  >
                    <img src={movie.poster} alt={movie.title} className="w-10 h-12 object-cover" />
                    <div className="ml-3">
                      <p className="font-bold text-white uppercase tracking-wide text-sm">{movie.title}</p>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">{movie.director}</p>
                    </div>
                  </Link>
                ))}
              </motion.div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative group">
            <Link
              to="/profile"
              className="flex items-center space-x-3 text-gray-300 hover:text-red-400 transition-colors"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-gray-700 flex items-center justify-center">
                  <img src={user?.avatar} alt={user?.name} className="w-6 h-6 object-cover" />
                </div>
                <span className="uppercase tracking-wide text-sm font-bold">{user?.name}</span>
              </motion.div>
            </Link>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="ml-2 text-gray-400 hover:text-red-400 transition-colors"
            >
              <span className="text-xs">▼</span>
            </motion.button>
            
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 0, y: -10 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
            >
              <Link to="/profile" className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-red-400 transition-colors uppercase tracking-wide text-sm font-bold border-b border-gray-800">Account Settings</Link>
              <Link to="/watching-challenge" className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-red-400 transition-colors uppercase tracking-wide text-sm font-bold border-b border-gray-800">Challenge</Link>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-red-400 transition-colors uppercase tracking-wide text-sm font-bold">Logout</button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-red-400 transition-colors"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900 border-t border-gray-800"
          >
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center space-x-3 text-gray-300 hover:text-red-400 transition-colors uppercase tracking-wide text-sm font-bold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}