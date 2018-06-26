const assert = require('assert');
const join = require('path').join;
const fs = require('fs');
const rimraf = require('rimraf');

const Db = require('../lib/db');
const Store = require('../lib/store');

describe('db', () => {

    const TEST_DIR = join(__dirname, 'data');

    let db = null;
    beforeEach(done => {
        rimraf(TEST_DIR, err => {
            if(err) return done(err);
            db = new Db(TEST_DIR);
            done();
        });
    });

    it('returns a Store', done => {
        db.getStore('cats', (err, store) => {
            if(err) return done(err);
            assert.ok(store instanceof Store);
            done();
        });
    });

    it('creates a subdirectory per store', done => {
        const names = ['cats', 'buildings', 'payments'];

        let count = names.length;
        names.forEach(name => {
            db.getStore(name, err => {
                if(err) return done(err);
                count--;
                if(count === 0) {
                    names.sort();
                    fs.readdir(TEST_DIR, (err, files) => {
                        if(err) return done(err);
                        assert.deepEqual(files, names);
                        done();
                    });
                }
            });
        });
    });
});