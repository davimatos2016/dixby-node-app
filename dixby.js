// Core node package for reading and writing files
var fs = require('fs');

// NPM packages
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');

// Command line arguments
var commands = process.argv[2];
var songName = process.argv[3];

//Function to get tweets
function tweets() {

    var keys = require('./keys.js');
    var client = new twitter(keys.twitterKeys);
    var paramaters = {
        screen_name: 'davimatos',
        count: 20
    };

    client.get('statuses/user_timeline', function(error, tweets, response) {
        if (error) {
            console.log(err);
        }
        var twitterData = [];
        for (var i = 0; i < tweets.length; i++) {
            twitterData.push({
                'Date': tweets[i].created_at,
                'Update': tweets[i].text
            })
        }
        console.log(twitterData);
        writeTextFile(twitterData);
    })
}

//Function to get spotify info
function spotifyInfo() {
    spotify.search({type: 'track', query: songName }, function(err, data){
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        } else if (songName === undefined){
            songName = 'I saw the sign';
        }

        var objData = data.tracks.items;
        var dataArr = [];
        for (var i = 0; i < objData.length; i++) {
            dataArr.push({
                'Artist': objData[i].artists.map(artistName),
                'Song': objData[i].name,
                'Link': objData[i].preview_url,
                'Album': objData[i].album.name
            })
        }

        console.log(dataArr);
        writeTextFile(dataArr);
    });
}

//Function to find artist name from spotify
function artistName(artist) {
    return artist.name;
};

//Function to get movie info
function movieFacts() {

    var movieName = process.argv[3];

    if (movieName === undefined){
    	movieName = 'Mr Nobody';
    }

    request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&r=json", function(error, response, body) {

        if (!error && response.statusCode === 200) {

            var movieData = [];

            movieData.push({
                'Title': JSON.parse(body).Title,
                'Year': JSON.parse(body).Year,
                'IMDB Rating': JSON.parse(body).imdbRating,
                'Country': JSON.parse(body).Country,
                'Language': JSON.parse(body).Language,
                'Plot': JSON.parse(body).Plot,
                'Actors': JSON.parse(body).Actors,
                'Rotten Tomatoes Rating': JSON.parse(body).tomatoRating,
                'Rotten Tomatoes URL': JSON.parse(body).tomatoURL
            })
            console.log(movieData);
            writeTextFile(movieData);
        }
    });

}

//Read random.txt and execute command
function readRandom() {
    fs.readFile('random.txt', 'utf8', function(err, data) {
        var dataArr = data.split(',');
        var command = dataArr[0];
        switch (command) {
            case 'my-tweets':
                tweets();
                break;
            case 'spotify-this-song':
                var songName = "";
                songName = dataArr[1];
                spotifyInfo(songName);
                break;
            case "movie-this":
                var movieName = "";
                movieName = dataArr[1];
                movieFacts(movieName);
                break;
            default:
                console.log('error please revise your random.txt');;

        }

    })
}

//Function to write to txt file
function writeTextFile(n) {
    fs.appendFile('log.txt', JSON.stringify(n), function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('content added to log.txt');
        }
    })
}

//DIXBY commands
switch (commands) {
    case 'my-tweets':
        tweets();
        break;
    case 'spotify-this-song':
        spotifyInfo();
        break;
    case 'movie-this':
        movieFacts();
        break;
    case 'do-what-it-says':
        readRandom();
        break;
    default:
        console.log('I do not understand');
}