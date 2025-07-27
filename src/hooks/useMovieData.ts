import { useState, useEffect } from 'react';
import { MovieApiService } from '../services/movieApi';

export function useMovieData(movieId: number) {
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [watchProviders, setWatchProviders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        
        // Fetch all movie data in parallel
        const [
          movieData,
          creditsData,
          reviewsData,
          videosData,
          similarData,
          providersData
        ] = await Promise.all([
          MovieApiService.getMovieDetails(movieId),
          MovieApiService.getMovieCredits(movieId),
          MovieApiService.getMovieReviews(movieId),
          MovieApiService.getMovieVideos(movieId),
          MovieApiService.getSimilarMovies(movieId),
          MovieApiService.getWatchProviders(movieId)
        ]);

        setMovie(movieData);
        setCredits(creditsData);
        setReviews(reviewsData);
        setVideos(videosData);
        setSimilar(similarData);
        setWatchProviders(providersData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieData();
    }
  }, [movieId]);

  return {
    movie,
    credits,
    reviews,
    videos,
    similar,
    watchProviders,
    loading,
    error
  };
}

export function useTrendingMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      const data = await MovieApiService.getTrendingMovies();
      setMovies(data);
      setLoading(false);
    };

    fetchTrending();
  }, []);

  return { movies, loading };
}

export function useMovieSearch(query: string) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchMovies = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      const data = await MovieApiService.searchMovies(query);
      setResults(data.results);
      setLoading(false);
    };

    const timeoutId = setTimeout(searchMovies, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [query]);

  return { results, loading };
}