var getRepoContributors = require('./getRepoContributors');
var request = require('request');

var myArgs = process.argv.slice(2);

getRepoContributors(myArgs[0], myArgs[1], recommendedRepos);

function returnTopFive(starred) {
  var arr = [];
  for(var repo in starred) {
    arr.push([repo, starred[repo]]);
  }
  arr.sort((a,b) => b[1] - a[1]);
  // console.log(arr);
  return arr.slice(0, 5);
}

function logTopFive(arr) {
  arr.forEach(function(repo) {
    console.log(`[ ${repo[1]} stars ] ${repo[0]}`);
  });
}

function recommendedRepos(err, contributors) {
  if(err) {
    throw err;
  }
  var recommeded = {};
  var starred = {};
  var contributorCount = 0;

  contributors.forEach(function(err, index) {
    var contributor = contributors[index];
    var options = {
    url : (`https://api.github.com/users/${contributor.login}/starred`),
    qs : {
      access_token : process.env.GITHUB_TOKEN
    },
    headers : {
      'User-Agent' : 'request'
    }
  };
    request(options, function(err, response, body) {
      var parsedBody = JSON.parse(body);
      if(parsedBody.length) {
        parsedBody.forEach((repo) => {
          if(starred.hasOwnProperty(repo.full_name)) {
            starred[repo.full_name]++;
          } else {
            starred[repo.full_name] = 1;
          }
        });
        contributorCount++;
        if(contributorCount === contributors.length) {
          var top5 = returnTopFive(starred);
          logTopFive(top5);
        }
      }
    });
  });
  return recommeded;
}