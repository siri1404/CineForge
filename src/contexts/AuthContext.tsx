import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedDate: string;
  watchingGoal: number;
  moviesWatched: number;
  favoriteMovies: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addToFavorites: (movieId: string) => void;
  removeFromFavorites: (movieId: string) => void;
  isFavorite: (movieId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@example.com',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
  joinedDate: '2020-03-15',
  watchingGoal: 100,
  moviesWatched: 67,
  favoriteMovies: ['1', '2'] // Initialize with some favorites for demo
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('goodreads_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would be an API call
    if (email && password) {
      setUser(mockUser);
      localStorage.setItem('goodreads_user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Mock signup - in real app, this would be an API call
    if (name && email && password) {
      const newUser = {
        ...mockUser,
        name,
        email,
        id: Math.random().toString(36).substr(2, 9)
      };
      setUser(newUser);
      localStorage.setItem('goodreads_user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('goodreads_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('goodreads_user', JSON.stringify(updatedUser));
    }
  };

  const addToFavorites = (movieId: string) => {
    console.log('addToFavorites called with:', movieId);
    console.log('Current user:', user);
    
    if (user && !(user.favoriteMovies || []).includes(movieId)) {
      const updatedUser = {
        ...user,
        favoriteMovies: [...(user.favoriteMovies || []), movieId]
      };
      console.log('Updating user with new favorites:', updatedUser.favoriteMovies);
      setUser(updatedUser);
      localStorage.setItem('goodreads_user', JSON.stringify(updatedUser));
    } else {
      console.log('User not found or movie already in favorites');
    }
  };

  const removeFromFavorites = (movieId: string) => {
    console.log('removeFromFavorites called with:', movieId);
    
    if (user) {
      const updatedUser = {
        ...user,
        favoriteMovies: (user.favoriteMovies || []).filter(id => id !== movieId)
      };
      console.log('Updating user, removing from favorites:', updatedUser.favoriteMovies);
      setUser(updatedUser);
      localStorage.setItem('goodreads_user', JSON.stringify(updatedUser));
    } else {
      console.log('User not found');
    }
  };

  const isFavorite = (movieId: string): boolean => {
    return (user?.favoriteMovies || []).includes(movieId);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      updateUser, 
      addToFavorites, 
      removeFromFavorites, 
      isFavorite 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}