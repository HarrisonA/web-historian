var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
  indexPath: path.join(__dirname, "../web/public/index.html")
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  fs.readFile(paths.list, 'utf8', function (err, contents) {
    if (!err){
      var str = contents.toString().split("\n");
      callback(str);
    }
  });
};

exports.isUrlInList = function(url, callback){
  fs.readFile(paths.list, 'utf8', function (err, contents) {
    var found = false; 
    if (!err){
      var sites = contents.split("\n");
      for ( var i = 0; i < sites.length; i++){
        if (sites[i] === url){
          found = true
          break; 
        }
      }
        callback(found);     
    }
  });
};

exports.addUrlToList = function(url, callback){
  fs.appendFile(paths.list, url + "\n", function (err) {
    if (!err) {
      callback(url);
    };
  });    
};

exports.isUrlArchived = function(url, callback){
  console.log("+++++++++++++++++++",paths.archivedSites + "/" +url)
  fs.exists(paths.archivedSites + "/" +url, function(exists) {
    if (exists) {
      callback(true);
    } else {
      callback(false);
    } 
  }); 
};

exports.downloadUrls = function(data){
    console.log("Download urls ", data)
  for (var i=0; i<data.length; i++){
    fs.appendFile(paths.archivedSites + "/" + data[i], '', function (err) {
      if (err) throw err;     
    });
  }

};






















