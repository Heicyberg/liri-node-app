require("dotenv").config();

var Spotify = require("node-spotify-api")
var axios = require("axios");

var action = process.argv[2]
var searchTerm = process.argv[3]

var keys = require("./keys.js")
//var spotify = new Spotify(keys.spotify);
var spotify = new Spotify({
    id: 'f8850de0c5b746a8ba7a2015d522edcd',
    secret: '32b51adba98b41b08e2477462ea9e006'
  });
//console.log(spotify)


 // .request('https://api.spotify.com/v1/tracks/shakeitoff')
spotify.search({ type: 'track', query: 'Sugar'})
  .then(function(response){
      response.tracks.items.forEach(function(elment){
           console.log("\n")
           console.log(elment.external_urls.spotify)
           console.log(elment.name)
           console.log(elment.album.name)
           console.log(elment.artists)
           console.log("\n")
      })
  })
  .catch(function(err){
      console.log(err)
  })


  
function movieOmdb(title){
    axios.get("http://www.omdbapi.com/?t="+title+"&y=&plot=short&apikey=trilogy").then(
   function(response) {
    // Then we print out the imdbRating
    console.log( ' * Title : '+response.data.Title);
    console.log( ' * Year : '+response.data.Year);
    console.log( ' * IMDB Rating : '+response.data.imdbRating);
    console.log( ' * Rotten Tomatoes Rating: '+response.data.Ratings[1]["Value"]);
    console.log( ' * Country : '+response.data.Country);
    console.log( ' * Language : '+response.data.Language);
    console.log( ' * Plot : '+response.data.Plot);
    console.log( ' * Actors : '+response.data.Actors);
    });
}

function concert(title){
    axios.get("https://rest.bandsintown.com/artists/" + title + "/events?app_id=codingbootcamp").then(
   function(response){

       response.data.forEach(function(elment){
           console.log("\n")
           console.log("Name of the venue : " + elment.venue.name)
           console.log("Venue location : " + elment.venue.city+" , "+elment.venue.country)
           console.log("Date of the Event : " + elment.datetime)
       })
   })
}

switch(action){
    case 'movie-this':
    movieOmdb(searchTerm)
    break;
    case 'concert-this':
    concert(searchTerm)
    break;
}