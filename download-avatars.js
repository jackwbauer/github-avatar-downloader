require('dotenv').config()
var request = require('request');
var fs = require('fs');
var mkdirp = require('mkdirp');

var myArgs = process.argv.slice(2);

getRepoContributors(myArgs[0], myArgs[1], getAvatars);

function getRepoContributors(repoOwner, repoName, cb) {
  var data = "";

  var options = {
    url : (`https://api.github.com/repos/${repoOwner}/${repoName}/contributors`),
    qs : {
      access_token : process.env.GITHUB_TOKEN
    },
    headers : {
      'User-Agent' : 'request'
    }
  };

  if(repoOwner && repoName) {
    request(options, function(err, response, body) {
      if(JSON.parse(body).length) {
        mkdirp('./avatars', function(err) {
          responseJSON = JSON.parse(response.body);
          if (err) {
            console.log(err);
          } else if(responseJSON.message && responseJSON.message.toLowerCase().includes("bad credentials")) {
            console.log("Bad credentials.");
            return;
          } else {
            console.log('Welcome to the Github Avatar Downloader');
            cb(err, JSON.parse(body));
            console.log('Download complete.')
          }
        });
      } else {
        console.log("The repository owner or name do not exist.");
      }
    });
  } else {
    console.log("Usage: node download-avatar.js <repoOwner> <repoName>");
  }
}

function getAvatars(err, body) {
  body.forEach((contributor) => downloadImageByURL(contributor.avatar_url, (`avatars/${contributor.login}.jpg`)));
}

function downloadImageByURL(url, filePath) {
  request.get(url)
  .on('error', function(err) {
    throw err;
  })
  // .on('response', () => console.log(`Downloading image from ${url} into ${filePath}`))
  // .on('end', () => console.log('Download complete from', url))
  .pipe(fs.createWriteStream(filePath));
}