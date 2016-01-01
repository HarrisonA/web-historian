var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var urlParser = require('url');

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

exports.send404 = send404 = function (response){
  sendResponse(response, '404: Page not Found', 404)
}


exports.serveAssets = serveAssets = function(response, asset, callback) {

  fs.readFile( archive.paths.siteAssets + asset, 'utf8', function (err, contents) {
    if (err){
      fs.readFile( archive.paths.archivedSites + asset, 'utf8', function(err, contents){
        if (err){
          callback ? callback() : send404(response)
        } else {
          sendResponse(response, contents);
        }        
      });
    } else {
      sendResponse(response, contents); 
    }
  });
};

// exports.checkForFile = checkForFile = function (response, file){
//  fs.exists(file, function(exists) {
//       if (exists) {
//         serveAssets( response, file );
//         // serve file
//       } else {
//         sendResponse(response, '', 404);
//       }
//     }); 
// }



exports.actions = {
  'GET': function (request, response){
    var parts = urlParser.parse(request.url);
    // console.log(path)
    var urlPath = parts.pathname === "/" ? "/index.html" : parts.pathname
    // if (request.url === "/"){
      console.log("akljshdflkjansd", urlPath)
      serveAssets( response, urlPath );
    // } 
    // else {
    //   var file = archive.paths.archivedSites + request.url;
    //   checkForFile(response, file);
    // }

  },

  'POST': function (request, response){
    var data ='';

    request.on("data", function (dataChunk) {
      data = JSON.parse(dataChunk);
      // data = dataChunk;
      console.log(data)
    })

    request.on("end", function () {
      console.log(data)
      fs.writeFile(archive.paths.list, data.url + "\n", function (err) {
        if (err) {
          throw err
        };
      });      
      sendResponse(response, '', 302);
    });
  }
};
