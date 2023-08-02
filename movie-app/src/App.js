import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistMovies, setPlaylistMovies] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    axios
      .get('/api/playlists')
      .then((response) => setPlaylists(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleSearch = () => {
    axios
      .get(`https://www.omdbapi.com/?apikey=50726e83&s=${searchTerm}`)     
                                                                                  //  also we can replace t with s
      .then((response) => {
        setSearchResults(response.data.Search || []);
      })
      .catch((error) => console.error(error));
  };

  const handleAddToPlaylist = (movie) => {
    setPlaylistMovies([...playlistMovies, movie]);
  };

  const handleCreatePlaylist = () => {
    if (playlistName.trim() !== '') {
      axios
        .post('/api/playlists', {
          name: playlistName,
          movies: playlistMovies.map((movie) => movie.imdbID),
          isPublic: false, // Set to true for public playlists
        })
        .then((response) => {
          setPlaylists([...playlists, response.data]);
          setSelectedPlaylist(response.data);
          setPlaylistName('');
          setPlaylistMovies([]);
        })
        .catch((error) => console.error(error));
    }
  };

  const handleSelectPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
    setPlaylistName(playlist.name);
    setPlaylistMovies(playlist.movies);
  };

  return (
    <div className="App">
      <h1>Movie Playlist App</h1>
      <div className="search">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search movies"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="search-results">
        {searchResults.map((movie) => (
          <div key={movie.imdbID} className="movie">
          <img src={movie.Poster} />
            <h3>{movie.Title}</h3>
            <p>{movie.Year}</p>
            <button onClick={() => handleAddToPlaylist(movie)}>Add</button>
          </div>
        ))}
      </div>
      <div className="playlist">
        <input
          type="text"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          placeholder="Playlist name"
        />
        <button onClick={handleCreatePlaylist}>Create Playlist</button>
        <ul>
          {playlists.map((playlist) => (
            <li
              key={playlist._id}
              className={selectedPlaylist === playlist ? 'selected' : ''}
              onClick={() => handleSelectPlaylist(playlist)}
            >
              {playlist.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="playlist-movies">
        <h2>{selectedPlaylist ? selectedPlaylist.name : 'No playlist selected'}</h2>
        <ul>
          {playlistMovies.map((movie) => (
            <li key={movie.imdbID}>
              <img src={movie.Poster} /> {movie.Title} ({movie.Year})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
