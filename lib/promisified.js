const fs = require('fs');
const promisify = require('util').promisify;

module.exports = {
    rimraf: promisify(require('rimraf')),
    mkdirp: promisify(require('mkdirp')),
    writeFile: promisify(fs.writeFile),
    readFile: promisify(fs.readFile),
    readdir: promisify(fs.readdir),
    unlink: promisify(fs.unlink)
};