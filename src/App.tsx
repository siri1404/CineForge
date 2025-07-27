import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MoviesProvider } from './contexts/MoviesContext';
import Header from './components/Layout/Header';
import LoginPage from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';
import Dashboard from './components/Dashboard/Dashboard';
import MovieDetail from './components/Movies/MovieDetail';
import MyMovies from './components/Movies/MyMovies';
import Profile from './components/Profile/Profile';
import WatchingChallenge from './components/WatchingChallenge/WatchingChallenge';
import BrowsePage from './components/Browse/BrowsePage';
import SocialFeed from './components/Social/SocialFeed';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/" />;
}

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black">
      {user && <Header />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignupPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/movie/:id" element={
          <ProtectedRoute>
            <MovieDetail />
          </ProtectedRoute>
        } />
        <Route path="/my-movies" element={
          <ProtectedRoute>
            <MyMovies />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/watching-challenge" element={
          <ProtectedRoute>
            <WatchingChallenge />
          </ProtectedRoute>
        } />
        <Route path="/browse" element={
          <ProtectedRoute>
            <BrowsePage />
          </ProtectedRoute>
        } />
        <Route path="/social" element={
          <ProtectedRoute>
            <SocialFeed />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MoviesProvider>
        <Router>
          <AppContent />
        </Router>
      </MoviesProvider>
    </AuthProvider>
  );
}

export default App;