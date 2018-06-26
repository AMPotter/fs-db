const fs = require('fs');
const path = require('path');
const shortid = require('shortid');

module.exports = class Store {
    constructor(root) {
        this.root = root;
    }

    getFileName(id) {
        return path.join(this.root, `${id}.json`);
    }

    save(item, callback) {
        const id = item._id = shortid.generate();
        const filename = this.getFileName(id);
        fs.writeFile(filename, JSON.stringify(item), err => {
            if(err) return callback(err);
            callback(null, item);
        });
    }

    get(id, callback) {
        const filename = this.getFileName(id);
        fs.readFile(filename, 'utf8', (err, data) => {
            if(err && err.code === 'ENOENT') return callback(null, null);
            if(err) return callback(err);
            callback(null, JSON.parse(data));
        });
    }

    getAll(callback) {
        fs.readdir(this.root, (err, files) => {
            if(err) return callback(err);

            let length = files.length;
            if(length === 0) return callback(null, []);

            const items = new Array(length);
            files.forEach((file, i) => {
                const id = path.basename(file, '.json');
                this.get(id, (err, item) => {
                    if(err) return callback(err);
                    items[i] = item;
                    length--;
                    if(length === 0) callback(null, items);
                });
            });
        });
    }

    remove(id, callback) {
        const filename = this.getFileName(id);
        fs.unlink(filename, err => {
            if(err && err.code === 'ENOENT') return callback(null, { removed: false });
            if(err) return callback(err);
            callback(null, { removed: true });
        });
    }
};