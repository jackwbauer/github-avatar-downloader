var request = require('request');
var fs = require('fs');
var mkdirp = require('mkdirp');
var token = require('./secrets');

var myArgs = process.argv.slice(2);

console.log('Welcome to the Github Avatar Downloader');
getRepoContributors(myArgs[0], myArgs[1], getAvatars);

function getRepoContributors(repoOwner, repoName, cb) {
  var data = "";

  var options = {
    url : (`https://api.github.com/repos/${repoOwner}/${repoName}/contributors`),
    qs : {
      access_token : token.GITHUB_TOKEN
    },
    headers : {
      'User-Agent' : 'request'
    }
  };

  request(options, function(err, response, body) {
    console.log(response);
    mkdirp('./avatars', function(err) {
      if (err) {
        console.log(err);
      } else {
        cb(err, JSON.parse(body));
      }
    });
  });
}

function getAvatars(err, body) {
  body.forEach((contributor) => downloadImageByURL(contributor.avatar_url, (`avatars/${contributor.login}.jpg`)));
}

function downloadImageByURL(url, filePath) {
  request.get(url)
  .on('error', function(err) {
    throw err;
  })
  .on('response', () => console.log(`Downloading image from ${url} into ${filePath}`))
  .on('end', () => console.log('Download complete from', url))
  .pipe(fs.createWriteStream(filePath));
}