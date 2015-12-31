var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelper = require('./http-helpers.js');
var fs = require('fs');
   

exports.handleRequest = function (request, response) {
  var action = httpHelper.actions[request.method];

  if(action){
    action(request, response);
  }

  


  // else if (request.method === 'OPTIONS'){

  //   console.log("\n\n OPTIONS request made");
  // } else{
  //   console.log("\n\n\n 404 should be returned");
  // }
     // response.end(archive.paths.list);
};