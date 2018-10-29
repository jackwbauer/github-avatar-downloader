var request = require('request');
var fs = require('fs');
var token = require('./secrets');

console.log('Welcome to the Github Avatar Downloader');
// downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg");
getRepoContributors('jquery', 'jquery', getAvatars);

function getRepoContributors(repoOwner, repoName, cb) {
  var data = "";

  var options = {
    url : (`https://api.github.com/repos/${repoOwner}/${repoName}/contributors`),
    headers : {
      'Authentication' : (`token ${token}`),
      'User-Agent' : 'request'
    }
  };

  request(options, function(err, response, body) {
    cb(err, JSON.parse(body));
  });
}

function getAvatars(err, body) {
  var avatars = [];
  body.forEach(function(user) {
    avatars.push(user['avatar_url']);
  });
  avatars.forEach((url, i) => downloadImageByURL(url, 'avatars/'+i));
  // console.log(avatars);
}

function downloadImageByURL(url, filePath) {
  request.get(url)
  .on('error', function(err) {
    throw err;
  })
  .on('response', () => console.log('Downloading image', url))
  .on('end', () => console.log('Download complete.'))
  .pipe(fs.createWriteStream(filePath));
}

function generatePathFromURL(url) {
  var path = "";
  path = url.replace('https://avatars' + /\[[0-9]+\]/ + '.githubusercontent.com/u/')
  console.log(path);
  return path;
}