require('dotenv').config()
var request = require('request');

module.exports = function getRepoContributors(repoOwner, repoName, cb) {
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
        responseJSON = JSON.parse(response.body);
        if(responseJSON.message && responseJSON.message.toLowerCase().includes("bad credentials")) {
          console.log("Bad credentials.");
        } else {
          cb(err, JSON.parse(body));
        }
      } else {
        console.log("The repository owner or name do not exist.");
      }
    });
  } else {
    console.log("Usage: node download-avatar.js <repoOwner> <repoName>");
  }
};