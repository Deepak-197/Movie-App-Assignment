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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
