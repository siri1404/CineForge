import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const WATCHMODE_API_KEY = import.meta.env.VITE_WATCHMODE_API_KEY;
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;

// TMDB API Client
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

// Watchmode API Client (for streaming data)
const watchmodeApi = axios.create({
  baseURL: 'https://api.watchmode.com/v1',
  params: {
    apikey: WATCHMODE_API_KEY,
  },
});

// OMDB API Client (for additional data)
const omdbApi = axios.create({
  baseURL: 'https://www.omdbapi.com',
  params: {
    apikey: OMDB_API_KEY,
  },
});

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  genres: { id: number; name: string }[];
  imdb_id: string;
  production_companies: { id: number; name: string; logo_path: string }[];
  spoken_languages: { iso_639_1: string; name: string }[];
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
}

export interface TMDBCredits {
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string;
    order: number;
  }[];
  crew: {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string;
  }[];
}

export interface TMDBReviews {
  results: {
    id: string;
    author: string;
    author_details: {
      name: string;
      username: string;
      avatar_path: string;
      rating: number;
    };
    content: string;
    created_at: string;
    updated_at: string;
    url: string;
  }[];
}

export interface StreamingProvider {
  provider_id: number;
  provider_name: string;
  provider_logo_path: string;
  display_priority: number;
  logo_100px: string;
}

export interface WatchProviders {
  results: {
    [countryCode: string]: {
      link: string;
      flatrate?: StreamingProvider[];
      rent?: StreamingProvider[];
      buy?: StreamingProvider[];
    };
  };
}

export class MovieApiService {
  // Get trending movies
  static async getTrendingMovies(timeWindow: 'day' | 'week' = 'week') {
    try {
      const response = await tmdbApi.get(`/trending/movie/${timeWindow}`);
      return response.data.results;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      return [];
    }
  }

  // Get popular movies
  static async getPopularMovies(page: number = 1) {
    try {
      const response = await tmdbApi.get('/movie/popular', { params: { page } });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return { results: [], total_pages: 0 };
    }
  }

  // Search movies
  static async searchMovies(query: string, page: number = 1) {
    try {
      const response = await tmdbApi.get('/search/movie', {
        params: { query, page }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      return { results: [], total_pages: 0 };
    }
  }

  // Get movie details
  static async getMovieDetails(movieId: number): Promise<TMDBMovie | null> {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  }

  // Get movie credits (cast & crew)
  static async getMovieCredits(movieId: number): Promise<TMDBCredits | null> {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/credits`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie credits:', error);
      return null;
    }
  }

  // Get movie reviews
  static async getMovieReviews(movieId: number, page: number = 1): Promise<TMDBReviews | null> {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/reviews`, {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movie reviews:', error);
      return null;
    }
  }

  // Get movie videos (trailers, teasers, etc.)
  static async getMovieVideos(movieId: number) {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/videos`);
      return response.data.results;
    } catch (error) {
      console.error('Error fetching movie videos:', error);
      return [];
    }
  }

  // Get similar movies
  static async getSimilarMovies(movieId: number, page: number = 1) {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/similar`, {
        params: { page }
      });
      return response.data.results;
    } catch (error) {
      console.error('Error fetching similar movies:', error);
      return [];
    }
  }

  // Get movie recommendations
  static async getMovieRecommendations(movieId: number, page: number = 1) {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/recommendations`, {
        params: { page }
      });
      return response.data.results;
    } catch (error) {
      console.error('Error fetching movie recommendations:', error);
      return [];
    }
  }

  // Get streaming providers (where to watch)
  static async getWatchProviders(movieId: number): Promise<WatchProviders | null> {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/watch/providers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching watch providers:', error);
      return null;
    }
  }

  // Get movies by genre
  static async getMoviesByGenre(genreId: number, page: number = 1) {
    try {
      const response = await tmdbApi.get('/discover/movie', {
        params: {
          with_genres: genreId,
          page,
          sort_by: 'popularity.desc'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      return { results: [], total_pages: 0 };
    }
  }

  // Get all genres
  static async getGenres() {
    try {
      const response = await tmdbApi.get('/genre/movie/list');
      return response.data.genres;
    } catch (error) {
      console.error('Error fetching genres:', error);
      // Return default genres if API fails
      return [
        { id: 28, name: 'Action' },
        { id: 12, name: 'Adventure' },
        { id: 16, name: 'Animation' },
        { id: 35, name: 'Comedy' },
        { id: 80, name: 'Crime' },
        { id: 99, name: 'Documentary' },
        { id: 18, name: 'Drama' },
        { id: 10751, name: 'Family' },
        { id: 14, name: 'Fantasy' },
        { id: 36, name: 'History' },
        { id: 27, name: 'Horror' },
        { id: 10402, name: 'Music' },
        { id: 9648, name: 'Mystery' },
        { id: 10749, name: 'Romance' },
        { id: 878, name: 'Science Fiction' },
        { id: 10770, name: 'TV Movie' },
        { id: 53, name: 'Thriller' },
        { id: 10752, name: 'War' },
        { id: 37, name: 'Western' }
      ];
    }
  }

  // Advanced movie discovery with filters
  static async discoverMovies(filters: {
    genre?: number[];
    year?: number;
    minRating?: number;
    sortBy?: string;
    page?: number;
  }) {
    try {
      const params: any = {
        page: filters.page || 1,
        sort_by: filters.sortBy || 'popularity.desc',
      };

      if (filters.genre && filters.genre.length > 0) {
        params.with_genres = filters.genre.join(',');
      }

      if (filters.year) {
        params.year = filters.year;
      }

      if (filters.minRating) {
        params['vote_average.gte'] = filters.minRating;
      }

      const response = await tmdbApi.get('/discover/movie', { params });
      return response.data;
    } catch (error) {
      console.error('Error discovering movies:', error);
      return { results: [], total_pages: 0 };
    }
  }

  // Get streaming availability using Watchmode API
  static async getStreamingAvailability(tmdbId: number) {
    try {
      // First, get the title from TMDB to search in Watchmode
      const movieDetails = await this.getMovieDetails(tmdbId);
      if (!movieDetails) return null;

      // Search for the movie in Watchmode
      const searchResponse = await watchmodeApi.get('/search/', {
        params: {
          search_field: 'name',
          search_value: movieDetails.title,
          types: 'movie'
        }
      });

      if (searchResponse.data.title_results.length === 0) return null;

      const watchmodeId = searchResponse.data.title_results[0].id;

      // Get streaming sources
      const sourcesResponse = await watchmodeApi.get(`/title/${watchmodeId}/sources/`);
      return sourcesResponse.data;
    } catch (error) {
      console.error('Error fetching streaming availability:', error);
      return null;
    }
  }

  // Helper function to get full image URL
  static getImageUrl(path: string, size: 'w200' | 'w300' | 'w400' | 'w500' | 'w780' | 'original' = 'w500') {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  // Helper function to get YouTube trailer URL
  static getYouTubeUrl(videoKey: string) {
    return `https://www.youtube.com/watch?v=${videoKey}`;
  }

  // Helper function to get YouTube embed URL
  static getYouTubeEmbedUrl(videoKey: string) {
    return `https://www.youtube.com/embed/${videoKey}`;
  }
}