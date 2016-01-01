var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelper = require('./http-helpers.js');
var fs = require('fs');
   

exports.handleRequest = function (request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url)
  var action = httpHelper.actions[request.method];
  if(action){
    action(request, response);
  }
};