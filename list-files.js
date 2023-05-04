var fs = require("fs");
var path = require("path");

function getDirectorySize(directory) {
    let size = 0;
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            size += getDirectorySize(filePath);
        } else {
            size += stats.size;
        }
    }

    return size;
}

function formatBytes(bytes) {
    if (bytes === 0) return "0 B";

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    const formatted = parseFloat((bytes / Math.pow(k, i)).toFixed(2));

    return `${formatted} ${sizes[i]}`;
}

const listFilesInFolder = (folder) => {
    fs.readdir(folder, (err, files) => {
        files.forEach((file) => {
            const filePath = path.join(folder, file);
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                // listFilesInFolder(filePath);
                console.log(filePath, formatBytes(getDirectorySize(filePath)));
            } else {
                console.log(filePath, formatBytes(stats.size));
            }
        });
    });
};

listFilesInFolder("H:\\");
