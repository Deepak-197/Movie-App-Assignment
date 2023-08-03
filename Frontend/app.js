// Constants
const apiKey = '50726e83';
const apiUrl = 'https://www.omdbapi.com/';
const apibackendUrl = 'http://localhost:5000/api/playlists'; // Update with your backend URL
// Global variables
let searchTermInput = document.getElementById('searchTerm');
let searchResultsDiv = document.getElementById('searchResults');
let playlistsUl = document.getElementById('playlists');
let playlistNameInput = document.getElementById('playlistName');
let isPublicCheckbox = document.getElementById('isPublic');
let playlistMoviesDiv = document.getElementById('playlistMovies');
let playlists = [];
let selectedPlaylist = null;
let currentPlaylistIndex = -1; // for multiple playlists

// Function to display movie search results
function displaySearchResults(results) {
  searchResultsDiv.innerHTML = '';
  if (results && results.length > 0) {
    results.forEach((movie) => {
      let movieDiv = document.createElement('div');
      movieDiv.innerHTML = `<h3>${movie.Title}</h3>
                            <p>${movie.Year}</p>
                            <img src="${movie.Poster}" alt="${movie.Title}">
                            <button onclick="addToPlaylist('${movie.imdbID}', '${movie.Title}')">Add</button>`;
      searchResultsDiv.appendChild(movieDiv);
    });
  } else {
    searchResultsDiv.innerHTML = '<p>No results found.</p>';
  }
}

// Function to search movies
function searchMovies() {
  let searchTerm = searchTermInput.value;
  if (searchTerm.trim() !== '') {
    let url = `${apiUrl}?apikey=${apiKey}&s=${encodeURIComponent(searchTerm)}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        displaySearchResults(data.Search);
      })
      .catch((error) => console.error(error));
  }
}

// Function to add a movie to the playlist
function addToPlaylist(imdbID, title) {
  let movieDiv = document.createElement('div');
  movieDiv.innerHTML = `<p>${title}</p>`;
  
  playlistMoviesDiv.appendChild(movieDiv);
  selectedPlaylist.movies.push(imdbID);
}

// Function to create a new playlist from frontend line no. 57 to 72
// function createPlaylist() {
//   let playlistName = playlistNameInput.value;
//   if (playlistName.trim() !== '') {
//     let isPublic = isPublicCheckbox.checked;
//     let playlist = {
//       name: playlistName,
//       movies: [],
//       isPublic: isPublic,
//       ownerId: 'USER_ID_HERE', // Replace with the actual user ID
//     };
//     playlists.push(playlist);
//     displayPlaylists();
//     playlistNameInput.value = '';
//     isPublicCheckbox.checked = false;
//   }
// }


// Function to create a new playlist   frombackend line 76 to 120
function createPlaylist() {
    let playlistName = playlistNameInput.value;
    if (playlistName.trim() !== '') {
      let isPublic = isPublicCheckbox.checked;
      let playlist = {
        name: playlistName,
        movies: [],
        isPublic: isPublic,
        ownerId: 'USER_ID_HERE', // Replace with the actual user ID
      };
  
      // Send the playlist data to the backend
      fetch(apibackendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playlist),
      })
        .then((response) => response.json())
        .then((data) => {
          playlists.push(data);
          displayPlaylists();
          playlistNameInput.value = '';
          isPublicCheckbox.checked = false;
        })
        .catch((error) => console.error(error));
    }
  }
  
  // Function to fetch playlists from the backend
  function fetchPlaylists() {
    fetch(apibackendUrl)
      .then((response) => response.json())
      .then((data) => {
        playlists = data;
        displayPlaylists();
      })
      .catch((error) => console.error(error));
  }
  
  // ... (Previous JavaScript code)
  
  // Initial setup
  fetchPlaylists();



// Function to display playlists
function displayPlaylists() {
  playlistsUl.innerHTML = '';
  playlists.forEach((playlist, index) => {
    let playlistLi = document.createElement('li');
    playlistLi.textContent = playlist.name;
    playlistLi.onclick = () => selectPlaylist(index);
    playlistsUl.appendChild(playlistLi);


    if (index === currentPlaylistIndex) {                       //FOr multiple playlists
        playlistLi.classList.add('selected');
      }
  });
}

// Function to display movies in the selected playlist
function displayPlaylistMovies() {
  playlistMoviesDiv.innerHTML = '';
  if (selectedPlaylist) {
    selectedPlaylist.movies.forEach((imdbID) => {
      let url = `${apiUrl}?apikey=${apiKey}&i=${imdbID}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          let movieDiv = document.createElement('div');
          movieDiv.innerHTML = `<p>${data.Title} (${data.Year})</p>  
                                 <img src="${data.Poster}" alt="${data.Title}">
                                <button onclick="removeFromPlaylist(${index})">Remove</button>`;
          
          playlistMoviesDiv.appendChild(movieDiv);
        })
        .catch((error) => console.error(error));
    });
  }
}

// Function to select a playlist
function selectPlaylist(index) {
  selectedPlaylist = playlists[index];
  displayPlaylists();
  displayPlaylistMovies();
}

function removeFromPlaylist(index) {
    if (selectedPlaylist) {
      selectedPlaylist.movies.splice(index, 1);
      displayPlaylistMovies();
    }
  }
  

// Initial setup
displayPlaylists();
