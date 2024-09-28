import React, { useState, useEffect } from 'react';
import BarChart from './components/BarChart';
import FilterComponent from './components/FilterComponent';
import axios from 'axios';

const MOVIE_API_KEY = 'TMDB_API_KEY';
const WEATHER_API_KEY = 'OPENWEATHER_API_KEY';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [books, setBooks] = useState([]);
  const [weather, setWeather] = useState(null);
  const [category, setCategory] = useState('movies');
  const [sortType, setSortType] = useState('rating');
  const [filteredData, setFilteredData] = useState([]);

  // Fetch data from TMDb (Movies)
  const fetchMovies = async () => {
    const res = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${MOVIE_API_KEY}`);
    return res.data.results.map(movie => ({
      title: movie.title,
      rating: movie.vote_average,
      type: 'movie'
    }));
  };

  // Fetch data from Open Library (Books)
  const fetchBooks = async () => {
    const res = await axios.get(`https://openlibrary.org/subjects/popular.json`);
    return res.data.works.map(book => ({
      title: book.title,
      rating: book.cover_edition_key ? 4.5 : 3.5, // Mock ratings as OpenLibrary doesn't provide ratings
      type: 'book'
    }));
  };

  // Fetch data from OpenWeather API (Weather for a city)
  const fetchWeather = async () => {
    const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=London&appid=${WEATHER_API_KEY}`);
    return {
      title: `Weather in ${res.data.name}`,
      rating: res.data.main.temp - 273.15, // Convert Kelvin to Celsius
      type: 'weather'
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      const moviesData = await fetchMovies();
      const booksData = await fetchBooks();
      const weatherData = await fetchWeather();
      setMovies(moviesData);
      setBooks(booksData);
      setWeather(weatherData);
    };
    fetchData();
  }, []);

  // Filter and sort data based on category
  useEffect(() => {
    let data = [];
    if (category === 'movies') {
      data = [...movies];
    } else if (category === 'books') {
      data = [...books];
    } else if (category === 'weather') {
      data = weather ? [weather] : [];
    }

    if (sortType === 'rating') {
      data.sort((a, b) => b.rating - a.rating);
    }
    setFilteredData(data);
  }, [category, sortType, movies, books, weather]);

  return (
    <div className="dashboard-container">
      <h1>Simple Data Dashboard</h1>
      <FilterComponent
        category={category}
        setCategory={setCategory}
        sortType={sortType}
        setSortType={setSortType}
      />
      <BarChart data={filteredData} />
    </div>
  );
};

export default App;
