import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MovieApiService } from '../services/movieApi';

export interface Movie {
  id: string;
  title: string;
  director: string;
  poster: string;
  backdrop: string;
  rating: number;
  ratingsCount: number;
  runtime: number;
  releaseYear: number;
  description: string;
  genres: string[];
  imdbId: string;
  tmdbId: string;
  cast: CastMember[];
  crew: CrewMember[];
  trailer?: string;
  streamingProviders: StreamingProvider[];
  trending: boolean;
  popularity: number;
}

export interface CastMember {
  id: string;
  name: string;
  character: string;
  profilePath: string;
}

export interface CrewMember {
  id: string;
  name: string;
  job: string;
  department: string;
  profilePath: string;
}

export interface StreamingProvider {
  provider: string;
  logo: string;
  type: 'stream' | 'rent' | 'buy';
  link: string;
}

export interface UserMovie extends Movie {
  shelf: 'want-to-watch' | 'currently-watching' | 'watched';
  userRating?: number;
  userReview?: string;
  dateAdded: string;
  dateStarted?: string;
  dateFinished?: string;
  currentTime?: number;
  progress?: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  movieId: string;
  rating: number;
  review: string;
  date: string;
  likes: number;
  replies: Reply[];
  isLiked: boolean;
}

export interface Reply {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  date: string;
}

export interface ActivityItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'watched' | 'rated' | 'reviewed' | 'added';
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  rating?: number;
  review?: string;
  date: string;
}

export interface FilterOptions {
  genres: string[];
  yearRange: [number, number];
  ratingRange: [number, number];
  sortBy: 'popularity' | 'rating' | 'release_date' | 'title';
  sortOrder: 'asc' | 'desc';
}

interface MoviesContextType {
  movies: Movie[];
  userMovies: UserMovie[];
  reviews: Review[];
  activities: ActivityItem[];
  trendingMovies: Movie[];
  filterOptions: FilterOptions;
  searchQuery: string;
  isLoading: boolean;
  addToShelf: (movie: Movie, shelf: string) => void;
  updateMovieProgress: (movieId: string, currentTime: number) => void;
  rateMovie: (movieId: string, rating: number, review?: string) => void;
  moveMovie: (movieId: string, newShelf: string) => void;
  searchMovies: (query: string) => Movie[];
  filterMovies: (filters: FilterOptions) => Movie[];
  setFilterOptions: (filters: FilterOptions) => void;
  setSearchQuery: (query: string) => void;
  likeReview: (reviewId: string) => void;
  addReply: (reviewId: string, content: string) => void;
  getMovieReviews: (movieId: string) => Review[];
  getSimilarMovies: (movieId: string) => Movie[];
  getTrendingMovies: () => Movie[];
}

const MoviesContext = createContext<MoviesContextType | undefined>(undefined);

// Enhanced mock movie data with more details
const mockMovies: Movie[] = [
  {
    id: '1',
    title: 'The Dark Knight',
    director: 'Christopher Nolan',
    poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400&h=600',
    backdrop: 'https://images.pexels.com/photos/7991225/pexels-photo-7991225.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600',
    rating: 9.0,
    ratingsCount: 2500000,
    runtime: 152,
    releaseYear: 2008,
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genres: ['Action', 'Crime', 'Drama'],
    imdbId: 'tt0468569',
    tmdbId: '155',
    cast: [
      { id: '1', name: 'Christian Bale', character: 'Bruce Wayne / Batman', profilePath: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' },
      { id: '2', name: 'Heath Ledger', character: 'The Joker', profilePath: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' },
      { id: '3', name: 'Aaron Eckhart', character: 'Harvey Dent', profilePath: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' },
      { id: '4', name: 'Michael Caine', character: 'Alfred', profilePath: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' }
    ],
    crew: [
      { id: '1', name: 'Christopher Nolan', job: 'Director', department: 'Directing', profilePath: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' },
      { id: '2', name: 'Hans Zimmer', job: 'Original Music Composer', department: 'Sound', profilePath: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' }
    ],
    streamingProviders: [
      { provider: 'Netflix', logo: '🎬', type: 'stream', link: '#' },
      { provider: 'Amazon Prime', logo: '📺', type: 'stream', link: '#' },
      { provider: 'Apple TV', logo: '🍎', type: 'rent', link: '#' }
    ],
    trending: true,
    popularity: 95.5
  },
  {
    id: '2',
    title: 'Inception',
    director: 'Christopher Nolan',
    poster: 'https://images.pexels.com/photos/7991225/pexels-photo-7991225.jpeg?auto=compress&cs=tinysrgb&w=400&h=600',
    backdrop: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600',
    rating: 8.8,
    ratingsCount: 2200000,
    runtime: 148,
    releaseYear: 2010,
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    imdbId: 'tt1375666',
    tmdbId: '27205',
    cast: [
      { id: '5', name: 'Leonardo DiCaprio', character: 'Dom Cobb', profilePath: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' },
      { id: '6', name: 'Marion Cotillard', character: 'Mal', profilePath: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' },
      { id: '7', name: 'Tom Hardy', character: 'Eames', profilePath: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' },
      { id: '8', name: 'Ellen Page', character: 'Ariadne', profilePath: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' }
    ],
    crew: [
      { id: '1', name: 'Christopher Nolan', job: 'Director', department: 'Directing', profilePath: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' },
      { id: '2', name: 'Hans Zimmer', job: 'Original Music Composer', department: 'Sound', profilePath: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' }
    ],
    streamingProviders: [
      { provider: 'HBO Max', logo: '🎭', type: 'stream', link: '#' },
      { provider: 'Hulu', logo: '📱', type: 'stream', link: '#' },
      { provider: 'Google Play', logo: '🎮', type: 'rent', link: '#' }
    ],
    trending: true,
    popularity: 92.3
  },
  {
    id: '3',
    title: 'Pulp Fiction',
    director: 'Quentin Tarantino',
    poster: 'https://images.pexels.com/photos/7991580/pexels-photo-7991580.jpeg?auto=compress&cs=tinysrgb&w=400&h=600',
    backdrop: 'https://images.pexels.com/photos/7991226/pexels-photo-7991226.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600',
    rating: 8.9,
    ratingsCount: 1900000,
    runtime: 154,
    releaseYear: 1994,
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    genres: ['Crime', 'Drama'],
    imdbId: 'tt0110912',
    tmdbId: '680',
    cast: [
      { id: '9', name: 'John Travolta', character: 'Vincent Vega', profilePath: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' },
      { id: '10', name: 'Uma Thurman', character: 'Mia Wallace', profilePath: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' },
      { id: '11', name: 'Samuel L. Jackson', character: 'Jules Winnfield', profilePath: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' },
      { id: '12', name: 'Bruce Willis', character: 'Butch Coolidge', profilePath: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' }
    ],
    crew: [
      { id: '3', name: 'Quentin Tarantino', job: 'Director', department: 'Directing', profilePath: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' }
    ],
    streamingProviders: [
      { provider: 'Netflix', logo: '🎬', type: 'stream', link: '#' },
      { provider: 'Amazon Prime', logo: '📺', type: 'rent', link: '#' }
    ],
    trending: false,
    popularity: 88.7
  },
  {
    id: '4',
    title: 'The Matrix',
    director: 'The Wachowskis',
    poster: 'https://images.pexels.com/photos/7991226/pexels-photo-7991226.jpeg?auto=compress&cs=tinysrgb&w=400&h=600',
    backdrop: 'https://images.pexels.com/photos/7991580/pexels-photo-7991580.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600',
    rating: 8.7,
    ratingsCount: 1800000,
    runtime: 136,
    releaseYear: 1999,
    description: 'A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.',
    genres: ['Action', 'Sci-Fi'],
    imdbId: 'tt0133093',
    tmdbId: '603',
    cast: [
      { id: '13', name: 'Keanu Reeves', character: 'Neo', profilePath: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' },
      { id: '14', name: 'Laurence Fishburne', character: 'Morpheus', profilePath: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' },
      { id: '15', name: 'Carrie-Anne Moss', character: 'Trinity', profilePath: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' },
      { id: '16', name: 'Hugo Weaving', character: 'Agent Smith', profilePath: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' }
    ],
    crew: [
      { id: '4', name: 'Lana Wachowski', job: 'Director', department: 'Directing', profilePath: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' },
      { id: '5', name: 'Lilly Wachowski', job: 'Director', department: 'Directing', profilePath: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' }
    ],
    streamingProviders: [
      { provider: 'HBO Max', logo: '🎭', type: 'stream', link: '#' },
      { provider: 'Apple TV', logo: '🍎', type: 'rent', link: '#' }
    ],
    trending: true,
    popularity: 90.1
  },
  {
    id: '5',
    title: 'Parasite',
    director: 'Bong Joon-ho',
    poster: 'https://images.pexels.com/photos/7991225/pexels-photo-7991225.jpeg?auto=compress&cs=tinysrgb&w=400&h=600',
    backdrop: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600',
    rating: 8.6,
    ratingsCount: 750000,
    runtime: 132,
    releaseYear: 2019,
    description: 'A poor family schemes to become employed by a wealthy family and infiltrate their household by posing as unrelated, highly qualified individuals.',
    genres: ['Comedy', 'Drama', 'Thriller'],
    imdbId: 'tt6751668',
    tmdbId: '496243',
    cast: [
      { id: '17', name: 'Song Kang-ho', character: 'Ki-taek', profilePath: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' },
      { id: '18', name: 'Lee Sun-kyun', character: 'Park Dong-ik', profilePath: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' }
    ],
    crew: [
      { id: '6', name: 'Bong Joon-ho', job: 'Director', department: 'Directing', profilePath: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' }
    ],
    streamingProviders: [
      { provider: 'Hulu', logo: '📱', type: 'stream', link: '#' },
      { provider: 'Amazon Prime', logo: '📺', type: 'rent', link: '#' }
    ],
    trending: true,
    popularity: 87.9
  },
  {
    id: '6',
    title: 'Interstellar',
    director: 'Christopher Nolan',
    poster: 'https://images.pexels.com/photos/7991580/pexels-photo-7991580.jpeg?auto=compress&cs=tinysrgb&w=400&h=600',
    backdrop: 'https://images.pexels.com/photos/7991226/pexels-photo-7991226.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600',
    rating: 8.6,
    ratingsCount: 1600000,
    runtime: 169,
    releaseYear: 2014,
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    imdbId: 'tt0816692',
    tmdbId: '157336',
    cast: [
      { id: '19', name: 'Matthew McConaughey', character: 'Cooper', profilePath: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' },
      { id: '20', name: 'Anne Hathaway', character: 'Brand', profilePath: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' }
    ],
    crew: [
      { id: '1', name: 'Christopher Nolan', job: 'Director', department: 'Directing', profilePath: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' }
    ],
    streamingProviders: [
      { provider: 'Netflix', logo: '🎬', type: 'stream', link: '#' },
      { provider: 'Apple TV', logo: '🍎', type: 'rent', link: '#' }
    ],
    trending: false,
    popularity: 85.4
  }
];

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Sarah Johnson',
    userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100',
    movieId: '1',
    rating: 5,
    review: 'Absolutely phenomenal! Heath Ledger\'s performance as the Joker is legendary. This movie redefined what superhero films could be.',
    date: '2024-01-15',
    likes: 42,
    replies: [
      {
        id: '1',
        userId: '2',
        userName: 'Mike Chen',
        userAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100',
        content: 'Couldn\'t agree more! The cinematography was also incredible.',
        date: '2024-01-16'
      }
    ],
    isLiked: false
  },
  {
    id: '2',
    userId: '3',
    userName: 'Emily Davis',
    userAvatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=100&h=100',
    movieId: '2',
    rating: 4,
    review: 'Mind-bending and visually stunning. Nolan at his finest, though it requires multiple viewings to fully appreciate.',
    date: '2024-01-10',
    likes: 28,
    replies: [],
    isLiked: true
  }
];

// Mock activity data
const mockActivities: ActivityItem[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Sarah Johnson',
    userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100',
    type: 'watched',
    movieId: '1',
    movieTitle: 'The Dark Knight',
    moviePoster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=100&h=150',
    rating: 5,
    date: '2024-01-15'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Mike Chen',
    userAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100',
    type: 'rated',
    movieId: '2',
    movieTitle: 'Inception',
    moviePoster: 'https://images.pexels.com/photos/7991225/pexels-photo-7991225.jpeg?auto=compress&cs=tinysrgb&w=100&h=150',
    rating: 4,
    date: '2024-01-14'
  },
  {
    id: '3',
    userId: '3',
    userName: 'Emily Davis',
    userAvatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=100&h=100',
    type: 'added',
    movieId: '3',
    movieTitle: 'Pulp Fiction',
    moviePoster: 'https://images.pexels.com/photos/7991580/pexels-photo-7991580.jpeg?auto=compress&cs=tinysrgb&w=100&h=150',
    date: '2024-01-13'
  }
];

export function MoviesProvider({ children }: { children: ReactNode }) {
  const [movies] = useState<Movie[]>(mockMovies);
  const [userMovies, setUserMovies] = useState<UserMovie[]>([]);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [activities] = useState<ActivityItem[]>(mockActivities);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [realMovies, setRealMovies] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMoreMovies, setHasMoreMovies] = useState(true);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    genres: [],
    yearRange: [1990, 2024],
    ratingRange: [0, 10],
    sortBy: 'popularity',
    sortOrder: 'desc'
  });

  const trendingMovies = movies.filter(movie => movie.trending).sort((a, b) => b.popularity - a.popularity);

  // Load real movie data with pagination
  useEffect(() => {
    const loadRealMovies = async () => {
      setIsLoading(true);
      try {
        // First get all available genres
        const genresData = await MovieApiService.getGenres();
        const genreMap = genresData.reduce((acc: any, genre: any) => {
          acc[genre.id] = genre.name;
          return acc;
        }, {});

        // Get many more pages of movies from TMDB for massive variety
        const trending = await MovieApiService.getTrendingMovies();
        
        // Load 20 pages of popular movies (400 movies)
        const popularPages = await Promise.all([
          MovieApiService.getPopularMovies(1),
          MovieApiService.getPopularMovies(2),
          MovieApiService.getPopularMovies(3),
          MovieApiService.getPopularMovies(4),
          MovieApiService.getPopularMovies(5),
          MovieApiService.getPopularMovies(6),
          MovieApiService.getPopularMovies(7),
          MovieApiService.getPopularMovies(8),
          MovieApiService.getPopularMovies(9),
          MovieApiService.getPopularMovies(10),
          MovieApiService.getPopularMovies(11),
          MovieApiService.getPopularMovies(12),
          MovieApiService.getPopularMovies(13),
          MovieApiService.getPopularMovies(14),
          MovieApiService.getPopularMovies(15),
          MovieApiService.getPopularMovies(16),
          MovieApiService.getPopularMovies(17),
          MovieApiService.getPopularMovies(18),
          MovieApiService.getPopularMovies(19),
          MovieApiService.getPopularMovies(20)
        ]);
        
        // Get multiple pages from different genres for massive variety (10 pages each = 200 movies per genre)
        const genrePages = await Promise.all([
          // Action movies (10 pages)
          ...Array.from({length: 10}, (_, i) => MovieApiService.getMoviesByGenre(28, i + 1)),
          // Drama movies (10 pages)
          ...Array.from({length: 10}, (_, i) => MovieApiService.getMoviesByGenre(18, i + 1)),
          // Comedy movies (10 pages)
          ...Array.from({length: 10}, (_, i) => MovieApiService.getMoviesByGenre(35, i + 1)),
          // Sci-Fi movies (10 pages)
          ...Array.from({length: 10}, (_, i) => MovieApiService.getMoviesByGenre(878, i + 1)),
          // Thriller movies (10 pages)
          ...Array.from({length: 10}, (_, i) => MovieApiService.getMoviesByGenre(53, i + 1)),
          // Horror movies (10 pages)
          ...Array.from({length: 10}, (_, i) => MovieApiService.getMoviesByGenre(27, i + 1)),
          // Romance movies (10 pages)
          ...Array.from({length: 10}, (_, i) => MovieApiService.getMoviesByGenre(10749, i + 1)),
          // Adventure movies (10 pages)
          ...Array.from({length: 10}, (_, i) => MovieApiService.getMoviesByGenre(12, i + 1)),
          // Animation movies (5 pages)
          ...Array.from({length: 5}, (_, i) => MovieApiService.getMoviesByGenre(16, i + 1)),
          // Crime movies (5 pages)
          ...Array.from({length: 5}, (_, i) => MovieApiService.getMoviesByGenre(80, i + 1)),
          // Documentary movies (5 pages)
          ...Array.from({length: 5}, (_, i) => MovieApiService.getMoviesByGenre(99, i + 1)),
          // Family movies (5 pages)
          ...Array.from({length: 5}, (_, i) => MovieApiService.getMoviesByGenre(10751, i + 1)),
          // Fantasy movies (5 pages)
          ...Array.from({length: 5}, (_, i) => MovieApiService.getMoviesByGenre(14, i + 1)),
          // History movies (5 pages)
          ...Array.from({length: 5}, (_, i) => MovieApiService.getMoviesByGenre(36, i + 1)),
          // Music movies (3 pages)
          ...Array.from({length: 3}, (_, i) => MovieApiService.getMoviesByGenre(10402, i + 1)),
          // Mystery movies (5 pages)
          ...Array.from({length: 5}, (_, i) => MovieApiService.getMoviesByGenre(9648, i + 1)),
          // War movies (3 pages)
          ...Array.from({length: 3}, (_, i) => MovieApiService.getMoviesByGenre(10752, i + 1)),
          // Western movies (3 pages)
          ...Array.from({length: 3}, (_, i) => MovieApiService.getMoviesByGenre(37, i + 1))
        ]);
        
        // Transform TMDB data to our format
        const transformMovie = (movie: any) => {
          // Map genre IDs to genre names
          const movieGenres = movie.genre_ids ? 
            movie.genre_ids.map((id: number) => genreMap[id]).filter(Boolean) : 
            [];

          return {
          id: movie.id.toString(),
          title: movie.title,
          director: 'Director TBD', // We'll get this from credits API
          poster: MovieApiService.getImageUrl(movie.poster_path, 'w500') || '',
          backdrop: MovieApiService.getImageUrl(movie.backdrop_path, 'w780') || '',
          rating: movie.vote_average,
          ratingsCount: movie.vote_count,
          runtime: 120, // Default, will be updated with detailed data
          releaseYear: new Date(movie.release_date).getFullYear(),
          description: movie.overview,
            genres: movieGenres,
          imdbId: '',
          tmdbId: movie.id.toString(),
          cast: [],
          crew: [],
          streamingProviders: [],
          trending: true,
          popularity: movie.popularity
          };
        };

        // Combine all movie sources
        const allMovieSources = [
          ...trending,
          ...popularPages.flatMap(page => page.results),
          ...genrePages.flatMap(page => page.results)
        ];

        // Transform and deduplicate movies
        const transformedMovies = allMovieSources.map(transformMovie);
        const uniqueMovies = transformedMovies.filter((movie, index, self) => 
          index === self.findIndex(m => m.id === movie.id)
        );
        
        // Sort by popularity for better user experience
        const sortedMovies = uniqueMovies.sort((a, b) => b.popularity - a.popularity);
        
        setRealMovies(sortedMovies);
        
        setTotalPages(Math.ceil(sortedMovies.length / 50));
        setHasMoreMovies(sortedMovies.length > 0);
        
        console.log(`Loaded ${sortedMovies.length} unique movies from TMDB!`);
      } catch (error) {
        console.error('Error loading real movie data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRealMovies();
  }, []);

  // Function to load more movies
  const loadMoreMovies = async () => {
    if (hasMoreMovies && !isLoading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      
      try {
        setIsLoading(true);
        // Load more movies from different sources
        const morePopular = await MovieApiService.getPopularMovies(nextPage + 20); // Continue from where we left off
        const moreAction = await MovieApiService.getMoviesByGenre(28, nextPage + 10); // Action
        const moreDrama = await MovieApiService.getMoviesByGenre(18, nextPage + 10); // Drama
        const moreComedy = await MovieApiService.getMoviesByGenre(35, nextPage + 10); // Comedy
        
        const transformMovie = (movie: any) => ({
          id: movie.id.toString(),
          title: movie.title,
          director: 'Director TBD',
          poster: MovieApiService.getImageUrl(movie.poster_path, 'w500') || '',
          backdrop: MovieApiService.getImageUrl(movie.backdrop_path, 'w780') || '',
          rating: movie.vote_average,
          ratingsCount: movie.vote_count,
          runtime: 120,
          releaseYear: new Date(movie.release_date).getFullYear(),
          description: movie.overview,
          genres: [],
          imdbId: '',
          tmdbId: movie.id.toString(),
          cast: [],
          crew: [],
          streamingProviders: [],
          trending: false,
          popularity: movie.popularity
        });
        
        const newMovies = [
          ...morePopular.results.map(transformMovie),
          ...moreAction.results.map(transformMovie),
          ...moreDrama.results.map(transformMovie),
          ...moreComedy.results.map(transformMovie)
        ];
        
        // Deduplicate with existing movies
        const uniqueNewMovies = newMovies.filter(newMovie => 
          !realMovies.some(existing => existing.id === newMovie.id)
        );
        
        setRealMovies(prev => [...prev, ...uniqueNewMovies]);
        setHasMoreMovies(uniqueNewMovies.length > 0);
      } catch (error) {
        console.error('Error loading more movies:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  // Use real movies if available, fallback to mock data
  const displayMovies = realMovies.length > 0 ? realMovies : movies;
  const displayTrendingMovies = realMovies.length > 0 
    ? realMovies.filter(movie => movie.trending) 
    : trendingMovies;

  const addToShelf = (movie: Movie, shelf: string) => {
    const userMovie: UserMovie = {
      ...movie,
      shelf: shelf as any,
      dateAdded: new Date().toISOString(),
      currentTime: shelf === 'currently-watching' ? 0 : undefined,
      progress: shelf === 'currently-watching' ? 0 : undefined
    };
    
    setUserMovies(prev => {
      const existing = prev.find(m => m.id === movie.id);
      if (existing) {
        return prev.map(m => m.id === movie.id ? { ...m, shelf: shelf as any } : m);
      }
      return [...prev, userMovie];
    });
  };

  const updateMovieProgress = (movieId: string, currentTime: number) => {
    setUserMovies(prev => prev.map(movie => {
      if (movie.id === movieId) {
        const progress = Math.min(Math.round((currentTime / movie.runtime) * 100), 100);
        return {
          ...movie,
          currentTime,
          progress,
          shelf: progress === 100 ? 'watched' : 'currently-watching',
          dateFinished: progress === 100 ? new Date().toISOString() : undefined
        };
      }
      return movie;
    }));
  };

  const rateMovie = (movieId: string, rating: number, review?: string) => {
    setUserMovies(prev => prev.map(movie => 
      movie.id === movieId ? { ...movie, userRating: rating, userReview: review } : movie
    ));

    if (review) {
      const newReview: Review = {
        id: Date.now().toString(),
        userId: 'current-user',
        userName: 'You',
        userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100',
        movieId,
        rating,
        review,
        date: new Date().toISOString().split('T')[0],
        likes: 0,
        replies: [],
        isLiked: false
      };
      setReviews(prev => [newReview, ...prev]);
    }
  };

  const moveMovie = (movieId: string, newShelf: string) => {
    setUserMovies(prev => prev.map(movie => 
      movie.id === movieId ? { ...movie, shelf: newShelf as any } : movie
    ));
  };

  const searchMovies = (query: string): Movie[] => {
    if (!query.trim()) return movies;
    
    // Search in real movies if available
    const moviesToSearch = realMovies.length > 0 ? realMovies : movies;
    return moviesToSearch.filter(movie => 
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.director.toLowerCase().includes(query.toLowerCase()) ||
      movie.genres.some(genre => genre.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const filterMovies = (filters: FilterOptions): Movie[] => {
    let filtered = realMovies.length > 0 ? realMovies : movies;

    // Filter by genres
    if (filters.genres.length > 0) {
      filtered = filtered.filter(movie => 
        filters.genres.some(genre => movie.genres.includes(genre))
      );
    }

    // Filter by year range
    filtered = filtered.filter(movie => 
      movie.releaseYear >= filters.yearRange[0] && movie.releaseYear <= filters.yearRange[1]
    );

    // Filter by rating range
    filtered = filtered.filter(movie => 
      movie.rating >= filters.ratingRange[0] && movie.rating <= filters.ratingRange[1]
    );

    // Sort results
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (filters.sortBy) {
        case 'popularity':
          aValue = a.popularity;
          bValue = b.popularity;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'release_date':
          aValue = a.releaseYear;
          bValue = b.releaseYear;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          return 0;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const likeReview = (reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            isLiked: !review.isLiked,
            likes: review.isLiked ? review.likes - 1 : review.likes + 1
          }
        : review
    ));
  };

  const addReply = (reviewId: string, content: string) => {
    const newReply: Reply = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100',
      content,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, replies: [...review.replies, newReply] }
        : review
    ));
  };

  const getMovieReviews = (movieId: string): Review[] => {
    return reviews.filter(review => review.movieId === movieId);
  };

  const getSimilarMovies = (movieId: string): Movie[] => {
    const moviesToSearch = realMovies.length > 0 ? realMovies : movies;
    const movie = moviesToSearch.find(m => m.id === movieId);
    if (!movie) return [];

    return moviesToSearch
      .filter(m => m.id !== movieId)
      .filter(m => m.genres.some(genre => movie.genres.includes(genre)))
      .slice(0, 5);
  };

  const getTrendingMovies = (): Movie[] => {
    return displayTrendingMovies;
  };

  return (
    <MoviesContext.Provider value={{
      movies: displayMovies,
      userMovies,
      reviews,
      activities,
      trendingMovies: displayTrendingMovies,
      filterOptions,
      searchQuery,
      isLoading,
      addToShelf,
      updateMovieProgress,
      rateMovie,
      moveMovie,
      searchMovies,
      filterMovies,
      setFilterOptions,
      setSearchQuery,
      likeReview,
      addReply,
      getMovieReviews,
      getSimilarMovies,
      getTrendingMovies,
      loadMoreMovies,
      hasMoreMovies,
      currentPage,
      totalPages
    }}>
      {children}
    </MoviesContext.Provider>
  );
}

export function useMovies() {
  const context = useContext(MoviesContext);
  if (context === undefined) {
    throw new Error('useMovies must be used within a MoviesProvider');
  }
  return context;
}