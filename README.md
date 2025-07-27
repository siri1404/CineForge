# CineForge - Movie Tracking Platform

A sophisticated movie tracking platform with real movie data integration.

## 🎬 Features

- **Real Movie Data**: Integration with TMDB API for comprehensive movie information
- **Streaming Availability**: Where to watch movies across different platforms
- **User Reviews**: Both TMDB reviews and user-generated content
- **Advanced Search**: Filter by genre, year, rating, and more
- **Watchlist Management**: Track movies you want to watch, are watching, or have watched
- **Social Features**: Activity feeds and user interactions

## 🔧 API Setup

To get real movie data, you'll need API keys from these services:

### 1. TMDB (The Movie Database) - **FREE**
- **What it provides**: Movie details, images, cast, crew, reviews, trailers
- **Free tier**: 1,000 requests per day
- **Sign up**: https://www.themoviedb.org/settings/api
- **Cost**: Free forever

### 2. Watchmode API - **FREE TIER AVAILABLE**
- **What it provides**: Streaming availability (Netflix, Prime, Hulu, etc.)
- **Free tier**: 1,000 requests per month
- **Sign up**: https://api.watchmode.com/
- **Cost**: Free tier, then $8/month for 10K requests

### 3. OMDB API - **FREE TIER AVAILABLE**
- **What it provides**: Additional movie metadata and ratings
- **Free tier**: 1,000 requests per day
- **Sign up**: http://www.omdbapi.com/apikey.aspx
- **Cost**: Free tier, then $10/month for unlimited

## 🚀 Setup Instructions

1. **Get API Keys**:
   ```bash
   # 1. Go to https://www.themoviedb.org/settings/api
   # 2. Create account and request API key
   # 3. Go to https://api.watchmode.com/ for streaming data
   # 4. Go to http://www.omdbapi.com/ for additional data
   ```

2. **Add API Keys to .env**:
   ```bash
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   VITE_WATCHMODE_API_KEY=your_watchmode_api_key_here
   VITE_OMDB_API_KEY=your_omdb_api_key_here
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Start Development**:
   ```bash
   npm run dev
   ```

## 📊 API Usage Examples

### Get Trending Movies
```javascript
import { MovieApiService } from './services/movieApi';

// Get trending movies
const trending = await MovieApiService.getTrendingMovies();

// Search movies
const results = await MovieApiService.searchMovies('Inception');

// Get movie details
const movie = await MovieApiService.getMovieDetails(27205);

// Get streaming providers
const providers = await MovieApiService.getWatchProviders(27205);
```

### Real-time Data Features
- **Trending Movies**: Updates hourly from TMDB
- **Search**: Instant results with debounced API calls
- **Streaming Data**: Live availability across platforms
- **Reviews**: Real user reviews from TMDB community

## 🎯 Data Sources

| Data Type | Source | Endpoint | Free Tier |
|-----------|--------|----------|-----------|
| Movie Metadata | TMDB | `/movie/{id}` | 1K/day |
| Search & Trending | TMDB | `/search/movie` | 1K/day |
| Cast & Crew | TMDB | `/movie/{id}/credits` | 1K/day |
| Reviews | TMDB | `/movie/{id}/reviews` | 1K/day |
| Trailers | TMDB | `/movie/{id}/videos` | 1K/day |
| Streaming | Watchmode | `/title/{id}/sources` | 1K/month |
| Additional Data | OMDB | `/?i={imdb_id}` | 1K/day |

## 🔄 Alternative APIs (if needed)

- **JustWatch API**: More comprehensive streaming data (paid)
- **Utelly API**: Alternative streaming availability
- **MovieGlu API**: Showtimes and cinema data
- **Rotten Tomatoes API**: Professional critic scores

## 💡 Pro Tips

1. **Cache API responses** to reduce API calls
2. **Use image optimization** for movie posters
3. **Implement pagination** for large result sets
4. **Add error handling** for API failures
5. **Use environment variables** for API keys

The platform now supports real movie data integration! Just add your API keys and you'll have access to millions of movies with real images, reviews, and streaming information.