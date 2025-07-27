# 🎥 CineForge — A Modern Movie Discovery & Tracking Platform  
*A full-stack web app for exploring, tracking, and streaming movies powered by real-time APIs.*

---

## 🚀 What is CineForge?

CineForge is a beautifully designed, scalable movie discovery and tracking platform built using modern full-stack technologies. It integrates real-world movie databases, user interaction flows, and streaming metadata to provide users with a seamless cinematic experience.

> Think **Goodreads**, but for movies.

---

## 🔥 Key Features

- 🎬 **Live Movie Metadata**: Pulls real-time trending, search, and movie data from TMDB  
- 📍 **Streaming Availability**: Find where to watch every movie (Netflix, Prime, etc.) via Watchmode API  
- 📚 **Dynamic Watchlist**: Track “Watched”, “Watching”, “Want to Watch” lists across all users  
- 🗣️ **Reviews & Ratings**: Community ratings from TMDB + ability to plug in user reviews  
- 🔍 **Advanced Search & Filters**: Sort by title, year, genre, language, popularity, and rating  
- 🤝 **Social Integration**: Follow users, activity feed, watch challenges, and recent activity  
- 📊 **Analytics Dashboard (optional)**: Your watch stats over time and across genres

---

## 🧰 Tech Stack

| Layer        | Tech                                          |
|--------------|-----------------------------------------------|
| **Frontend** | React, TailwindCSS, Axios, React Router DOM   |
| **Backend**  | Node.js / Flask (optional for auth or custom API wrapper) |
| **APIs**     | TMDB, Watchmode, OMDB                         |
| **Storage**  | Firebase (for user data + auth)               |
| **Hosting**  | Vercel (frontend), Render (backend)           |
| **Extras**   | .env configs, caching, pagination, error boundaries |

---

## 🔐 API Keys Setup

> Create a `.env` file in the root directory of your project:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_WATCHMODE_API_KEY=your_watchmode_api_key_here
VITE_OMDB_API_KEY=your_omdb_api_key_here


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


The platform supports real movie data integration! Just add your API keys and you'll have access to millions of movies with real images, reviews, and streaming information.
