const mkdirp = require('mkdirp');
const join = require('path').join;
const Store = require('./store');

module.exports = class Db {
    constructor(rootDir) {
        this.rootDir = rootDir;
    }

    getStore(name, callback) {
        const storeDir = join(this.rootDir, name);
        mkdirp(storeDir, err => {
            if(err) return callback(err);
            const store = new Store(storeDir);
            callback(null, store);
        });
    }
};