const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/movie_playlist', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Create Mongoose schema and model
const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  movies: [{ type: String }],
  isPublic: { type: Boolean, default: false },
});

const Playlist = mongoose.model('Playlist', playlistSchema);

// API endpoints
app.post('/api/playlists', (req, res) => {
  const { name, movies, isPublic } = req.body;

  const newPlaylist = new Playlist({ name, movies, isPublic });

  newPlaylist.save((err, playlist) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving playlist');
    } else {
      res.json(playlist);
    }
  });
});

app.get('/api/playlists', (req, res) => {
  Playlist.find({}, (err, playlists) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching playlists');
    } else {
      res.json(playlists);
    }
  });
});


// API endpoint to remove a movie from the selected playlist
app.put('/api/playlists/:id/removeMovie', (req, res) => {
  const playlistId = req.params.id;
  const movieId = req.body.movieId;

  Playlist.findById(playlistId, (err, playlist) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching playlist');
    } else {
      const index = playlist.movies.indexOf(movieId);
      if (index !== -1) {
        playlist.movies.splice(index, 1);
        playlist.save((err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error saving playlist');
          } else {
            res.json(playlist);
          }
        });
      } else {
        res.status(404).send('Movie not found in the playlist');
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
