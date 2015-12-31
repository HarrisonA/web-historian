var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');


exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};
exports.sendResponse = sendResponse = function(response, data, statusCode){
  var statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(data);
};

exports.serveAssets = serveAssets = function(response, asset, callback) {
  fs.readFile(asset, 'utf8', function (err, contents) {
    if (err){
      throw err
    } else {
      sendResponse(response, contents);
    }
  });
};

exports.checkForFile = checkForFile = function (response, file){
 fs.exists(file, function(exists) {
      if (exists) {
        serveAssets( response, file );
        // serve file
      } else {
        sendResponse(response, '', 404);
      }
    }); 
}
  
exports.actions = {
  'GET': function (request, response){
    if (request.url === "/"){
      serveAssets( response, archive.paths.indexPath );
    } else {
      var file = archive.paths.archivedSites + request.url;
      checkForFile(response, file);
    }

  },

  'POST': function (request, response){
    var data ='';
    request.on("data", function (dataChunk) {
      data = JSON.parse(dataChunk);
    })

    request.on("end", function () {
      fs.writeFile(archive.paths.list, data.url + "\n", function (err) {
        if (err) {
          throw err
        };
      });      
      sendResponse(response, '', 302);
    });
  }
};
