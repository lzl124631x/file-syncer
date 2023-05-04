const fs = require("fs-extra");
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

// listFilesInFolder("H:\\");

const fileList = [];
function syncFiles(sourceDir, targetDir) {
    const files = fs.readdirSync(sourceDir);

    for (let i = 0; i < files.length; i++) {
        const fileName = files[i];
        if (
            fileName.startsWith(".") ||
            fileName === "$RECYCLE.BIN" ||
            fileName === "Lightroom"
        ) {
            continue;
        }
        const sourceFilePath = path.join(sourceDir, fileName);
        const targetFilePath = path.join(targetDir, fileName);
        const doesTargetFilePathExist = fs.existsSync(targetFilePath);
        const sourceFileStats = fs.statSync(sourceFilePath);

        if (sourceFileStats.isDirectory()) {
            if (!doesTargetFilePathExist) {
                console.log(sourceFilePath);
                fs.copySync(sourceFilePath, targetFilePath);
                fileList.push(sourceFilePath);
            } else {
                // Recursively sync subdirectories
                syncFiles(sourceFilePath, targetFilePath);
            }
        } else {
            // Copy the file to the target directory if it doesn't exist or is different
            if (
                !doesTargetFilePathExist ||
                sourceFileStats.size !== fs.statSync(targetFilePath).size
            ) {
                console.log(fileName, sourceFilePath);
                fs.copyFileSync(sourceFilePath, targetFilePath);
                fileList.push(sourceFilePath);
            }
        }
    }
}
syncFiles("H:\\", "I:\\");
fs.writeFileSync("log.txt", fileList.join("\n"));
