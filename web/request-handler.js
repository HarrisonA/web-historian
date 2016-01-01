var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelper = require('./http-helpers.js');
var fs = require('fs');
var urlParser = require('url');
   
actions = {

  'GET': function (request, response){
    var parts = urlParser.parse(request.url);

    var urlPath = parts.pathname === "/" ? "/index.html" : parts.pathname
      serveAssets( response, urlPath );
  },

  'POST': function (request, response){
    httpHelper.collectData(request, function(data){
      var url = data.split('=')[1];
      // data = JSON.parse(data);
      console.log("UUUUUUUUUUUUU",url)
      archive.isUrlInList(url, function (found){
        if (found){
          console.log("Found url in list")
          archive.isUrlArchived(url, function(exists){
            if (exists){
              console.log("found file in archive")
              httpHelper.sendRedirect(response, "/" + url);
            }else{
              console.log("Didnt find file in archive")
              archive.downloadUrls([url]);
              httpHelper.sendRedirect(response,"/loading.html");
            }
          })
        } else {
          console.log("Didnt find url in list")
          archive.addUrlToList(url, function (){

            httpHelper.sendRedirect(response,"/loading.html");
          });
        }
      })
    });
  }
};



exports.handleRequest = function (request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url)
  var action = actions[request.method];
  if(action){
    action(request, response);
  } else {
    httpHelper.sendResponse(response, "Not Found", 404)
  }
};