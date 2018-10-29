var request = require('request');
var token = require('./secrets');

console.log('Welcome to the Github Avatar Downloader');

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
    cb(err, body);
  })
  .on('error', function(err) {
    throw err;
  })
  .on('response', function(response) {
    cb(JSON.parse(response));
  });
}

function getAvatars(json) {
  console.log(json);
}