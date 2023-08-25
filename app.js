require('dotenv').config();
​
const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
​
const app = express();
​
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
​
// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});
​
// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
​
// Our routes go here:
​
app.get('/', (req, res) =>{
    res.render('home')
})
​
// search artist(s)
app.get('/artist-search', (req, res) =>{
​
  const name = req.query.name
​
  spotifyApi
    .searchArtists(name)
    .then(data => {
      const artists = data.body.artists.items
​
      console.log('The received data from the API: ', data.body);
​
      res.render('artist-search-results', { artists })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
​
})
​
// search for an artist's album(s)
​
app.get('/albums/:id', (req, res) => {
​
  const {id} = req.params
​
  spotifyApi
    .getArtistAlbums(id)
    .then(data =>{
​
      const albums = data.body.items
​
      res.render('albums', {albums})
    })
    .catch(err => console.log('Error searching for albums:', err));
})
​
// search for the tracks
​
app.get('/tracks/:id', (req, res) =>{
​
  const {id} = req.params
​
  spotifyApi
    .getAlbumTracks(id)
    .then(data =>{
​
      const tracks = data.body.items
​
      res.render('tracks', {tracks, number: tracks.length})
    })
    .catch(err => console.log('Error searching for tracks:', err));
​
​
})
​
​
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));