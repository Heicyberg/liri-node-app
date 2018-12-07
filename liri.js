require("dotenv").config();

var Spotify = require("node-spotify-api")
var axios = require("axios");
var fs = require("fs")

var action = process.argv[2]
var searchTerm = process.argv[3]

var keys = require("./keys.js")
var spotify = new Spotify(keys.spotify);
  
function movieOmdb(title){
   axios.get("http://www.omdbapi.com/?t="+title+"&y=&plot=short&apikey=trilogy").then(
   function(response) {
    console.log( '\n * Title : '+response.data.Title);
    console.log( ' * Year : '+response.data.Year);
    console.log( ' * IMDB Rating : '+response.data.imdbRating);
    console.log( ' * Rotten Tomatoes Rating: '+response.data.Ratings[1]["Value"]);
    console.log( ' * Country : '+response.data.Country);
    console.log( ' * Language : '+response.data.Language);
    console.log( ' * Plot : '+response.data.Plot);
    console.log( ' * Actors : '+response.data.Actors);

    var text = '\n  * Title : '+response.data.Title+'\n  * Year : '+response.data.Year+ '\n  * IMDB Rating : '+response.data.imdbRating+'\n  * Country : '+response.data.Country+
    '\n  * Language : '+response.data.Language + '\n  * Plot : '+response.data.Plot + '\n  * Actors : '+response.data.Actors;
    infoLog(text)

    });
    
}

function concert(title){
    axios.get("https://rest.bandsintown.com/artists/" + title + "/events?app_id=codingbootcamp").then(
   function(response){

       response.data.forEach(function(elment){
           console.log("\n")
           console.log("Name of the venue : " + elment.venue.name)
           console.log("Venue location : " + elment.venue.city+" , "+elment.venue.country)
          
           var d = new Date(elment.datetime)
           var yy = d.getUTCFullYear();
           var mm = d.getUTCMonth() +1 ;
           var dd = d.getUTCDate();
           var datePrint = mm + '/'+ dd + '/' + yy;
           console.log("Date of the Event : " + datePrint)
           var text = "\n  * Name of the venue : " + elment.venue.name + "\n  * Venue location : " + elment.venue.city+" , "+elment.venue.country + "\n  * Date of the Event : " + datePrint;
           infoLog(text)
       })
   })
}

function dothis(){
    fs.readFile("./random.txt", "utf8", function(err, data) {
        if (err) {
          return console.log(err);
        }
        var dataArray = data.split(",")
        appMain(dataArray[0],dataArray[1])
    })
}

var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;

function appMain(action,searchTerm){
    // log data of command, including command time
    var text = '* Time : ' + dateTime + '\n* Command : ' + action+ ' '+ searchTerm;
    infoLog(text);

    switch(action){
        case 'movie-this':
        if (!searchTerm){
            searchTerm = "Mr. Nobody."
        }
        movieOmdb(searchTerm)
        break;
        case 'concert-this':
        concert(searchTerm)
        break;
        case 'spotify-this-song':
        spotify.search({ type: 'track', query: searchTerm})
        .then(function(response){
            //console.log(response)
        response.tracks.items.forEach(function(elment){
             var text =  "\n  * Artist(s) : "
             console.log("\n")
             elment.artists.forEach(function(semielment){console.log("Artist(s) : ")+ console.log(semielment.name); text += semielment.name + ' ';})
             console.log("Song's name : " +elment.name)
             console.log("Link of the song : " + elment.external_urls.spotify)
             console.log("Album : "+elment.album.name)
             text = text + "\n  * Song's name : " +elment.name + "\n  * Link of the song : " + elment.external_urls.spotify + "\n  * Album : "+elment.album.name;
             infoLog(text)
            })
         }).catch(function(err){
        console.log(err)})
        break;
        case 'do-what-it-says':
        dothis()
        break;
    }
}

//creat a function to output the command as well as data to a .txt file called log.txt.
function infoLog(text){
    fs.appendFile("log.txt", '\n'+text+'\n', function(err) {

        // If an error was experienced we will log it.
        if (err) {
          console.log(err);
        }
      
      });
}

//Excution of the main function
  
appMain(action,searchTerm);
