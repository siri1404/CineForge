import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FilmIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Unique Geometric Background Pattern */}
      <div className="absolute inset-0">
        {/* Large geometric shapes */}
        <motion.div
          animate={{
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-10 right-10 w-96 h-96 border-2 border-gray-800"
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
        />
        
        <motion.div
          animate={{
            rotate: [360, 270, 180, 90, 0],
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 left-20 w-64 h-64 bg-gray-900"
          style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}
        />

        {/* Floating rectangles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(i) * 20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            className="absolute w-4 h-16 bg-gray-800"
            style={{
              left: `${10 + (i * 8)}%`,
              top: `${20 + Math.sin(i) * 30}%`,
              transformOrigin: 'center',
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Unique Card Design */}
          <div className="bg-gray-900 p-8 relative overflow-hidden">
            {/* Geometric corner decorations */}
            <div className="absolute top-0 left-0 w-16 h-16 bg-red-600" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-red-600" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />
            
            {/* Logo Section */}
            <div className="text-center mb-8 relative z-10">
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="inline-block mb-6"
              >
                <div className="w-20 h-20 bg-red-600 flex items-center justify-center relative">
                  <div className="absolute inset-2 border-2 border-white"></div>
                  <FilmIcon className="h-8 w-8 text-white relative z-10" />
                </div>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-4xl font-bold text-white mb-2 tracking-wider"
              >
                CINEFORGE
              </motion.h1>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 1, duration: 0.8 }}
                className="h-0.5 bg-red-600 mx-auto mb-4"
              />
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="text-gray-400 uppercase tracking-widest text-sm"
              >
                Craft Your Cinema
              </motion.p>
            </div>

            {/* Demo Credentials */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="bg-black border-l-4 border-red-600 p-4 mb-6"
            >
              <p className="text-sm font-bold text-red-400 mb-2 uppercase tracking-wide">Demo Access</p>
              <p className="text-xs text-gray-400">Email: any@email.com</p>
              <p className="text-xs text-gray-400">Password: any password</p>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-0 py-4 bg-transparent border-0 border-b-2 border-gray-700 focus:border-red-600 focus:outline-none text-white placeholder-gray-500 text-lg"
                    placeholder="EMAIL ADDRESS"
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 focus-within:w-full"></div>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-0 py-4 pr-12 bg-transparent border-0 border-b-2 border-gray-700 focus:border-red-600 focus:outline-none text-white placeholder-gray-500 text-lg"
                    placeholder="PASSWORD"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-4 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-6 w-6" />
                    ) : (
                      <EyeIcon className="h-6 w-6" />
                    )}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: '#dc2626'
                }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-4 px-6 font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {loading ? 'ENTERING...' : 'ENTER CINEFORGE'}
                </span>
                <div className="absolute inset-0 bg-black transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              </motion.button>
            </motion.form>

            {/* Sign Up Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-400 uppercase tracking-wide text-sm">
                New to CineForge?{' '}
                <Link 
                  to="/signup" 
                  className="text-red-400 hover:text-white font-bold transition-colors duration-300 border-b border-red-400 hover:border-white"
                >
                  CREATE ACCOUNT
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}