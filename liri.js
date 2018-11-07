require('dotenv').config();
var fs = require('fs');
var moment = require('moment');
var request = require('request');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');

//-----------------------------------------------------------------------------------------------------------------------

var concertThis = function(value) {      //Bands in Town API request function for "concert-this" command

    var requestURL = "https://rest.bandsintown.com/artists/" + value + "/events?app_id=" + keys.bandsInTown.id;

request(requestURL, function (error, response, body) {

  if (error) {
    return console.log('error:', error); // Print the error if one occurred
  };
  if (response) {
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  };
  
  var body = JSON.parse(body);

  for (var i in body) {
  console.log("\r");
  console.log("Venu: " + body[i].venue.name);
  console.log("Location: " + body[i].venue.city + " " + body[i].venue.region + " " + body[i].venue.country);
  console.log("Date: " + moment(body[i].datetime).format('MM/DD/YYYY'));
  console.log("------------------------------------------------------------");
  };
});
};

//-----------------------------------------------------------------------------------------------------------------------

var spotifyThisSong = function(value) {     //Spotify node package request for "spotify-this-song" command
    
    if (value === "") {
      value = "the sign";
    };
    
    var spotify = new Spotify({
      id: keys.spotify.id,
      secret: keys.spotify.secret
    });
     
    spotify.search({ type: 'track', query: value }, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      };
  
    for (var i in data.tracks.items) {
    console.log("\r");
    console.log("Artist: " + data.tracks.items[i].artists[0].name);
    console.log("Song Title: " + data.tracks.items[i].name);
    console.log("Song URL: " + data.tracks.items[i].external_urls.spotify);
    console.log("Album Title: " + data.tracks.items[i].album.name);
    console.log("------------------------------------------------------------");
    };
    });
};

//-----------------------------------------------------------------------------------------------------------------------

var movieThis = function(value) {        //OMDB API request function for "movie-this" command

  if (value === "") {
    value = "mr+nobody";
  };

  var requestURL = "http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=" + keys.omdb.id;

 request(requestURL, function (error, response, body) {
  if (error) {
    return console.log('error:', error); // Print the error if one occurred
  };
  if (response) {
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  };

  var body = JSON.parse(body);

  console.log("------------------------------------------------------------");
  console.log("Movie Title: " + body.Title);
  console.log("Year Released: " + moment(body.Year, 'YYYY').format('YYYY'));
  console.log(body.Ratings[0].Source + ": " + body.Ratings[0].Value);
  console.log(body.Ratings[1].Source + ": " + body.Ratings[1].Value);
  console.log("Produced in: " + body.Country);
  console.log("Movie Language: " + body.Language);
  console.log("Movie Plot: " + body.Plot);
  console.log("Movie Actors: " + body.Actors);
  console.log("------------------------------------------------------------");
});
};

//-----------------------------------------------------------------------------------------------------------------------

var doWhatItSays = function() {       //fs node package read to retrieve command and value

  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    };

    var results = data.split(",");

    switch(results[0]) {
      case 'spotify-this-song':
        spotifyThisSong(results[1]);
        break;
      case 'movie-this':
        movieThis(results[1]);
        break;
      case 'concert-this':
        concertThis(results[1]);
        break;
    };
  });
};

//-----------------------------------------------------------------------------------------------------------------------

var command = process.argv[2];
var value = process.argv.slice(3).join("+");

switch(command) {
  case 'concert-this':
    concertThis(value);
    break;
  case 'spotify-this-song':
    value = process.argv.slice(3).join(" ");
    spotifyThisSong(value);
    break;
  case 'movie-this':
    movieThis(value);
    break;
  case 'do-what-it-says':
    doWhatItSays();
    break;
};