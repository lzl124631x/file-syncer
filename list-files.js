var fs   = require("fs");
var path = require("path");

const listFilesInFolder = (folder) => {
    fs.readdir(folder, (err, files) => {
        files.forEach(file => {
          console.log(file);
        });
      });
} 

listFilesInFolder('H:\\')