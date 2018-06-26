const assert = require('assert');
const join = require('path').join;
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const Store = require('../lib/store');

describe('store', () => {

    const TEST_DIR = join(__dirname, 'data');

    let store = null;
    beforeEach(done => {
        rimraf(TEST_DIR, err => {
            if(err) return done(err);
            mkdirp(TEST_DIR, err => {
                if(err) return done(err);
                store = new Store(TEST_DIR);
                done();
            });
        });
    });

    it('saves and gets an item', done => {
        store.save({ name: 'garfield' }, (err, saved) => {
            if(err) return done(err);

            assert.ok(saved._id);
            assert.equal(saved.name, 'garfield');

            store.get(saved._id, (err, got) => {
                if(err) return done(err);
                assert.deepEqual(got, saved);
                done();
            });
        });
    });

    it('returns null for a non-existent id', done => {
        store.get('bad id', (err, item) => {
            if(err) return done(err);
            assert.strictEqual(item, null);
            done();
        });
    });

    it('removes an item by id', done => {
        store.save({ name: 'garfield' }, (err, saved) => {
            if(err) return done(err);
            store.remove(saved._id, (err, status) => {
                if(err) return done(err);
                assert.deepEqual(status, { removed: true });
                store.get(saved._id, (err, got) => {
                    if(err) return done(err);
                    assert.strictEqual(got, null);
                    done();
                });
            });
        });
    });

    it('returns false status when removing non-existent id', done => {
        store.remove('bad id', (err, status) => {
            if(err) return done(err);
            assert.deepEqual(status, { removed: false });
            done();
        });
    });

    it('returns empty array when no items', done => {
        store.getAll((err, items) => {
            if(err) return done(err);
            assert.deepEqual(items, []);
            done();
        });
    });

    it('return all saved items', done => {
        const toSave = [
            { name: 'garfield' },
            { name: 'lassie' },
            { name: 'tweety' }
        ];
        const saved = [];
        toSave.forEach(item => {
            store.save(item, (err, savedItem) => {
                if(err) return done(err);
                saved.push(savedItem);
                if(saved.length == toSave.length) {
                    saved.sort((a, b) => a._id < b._id ? -1 : 1);
                    store.getAll((err, all) => {
                        if(err) return done(err);
                        assert.deepEqual(all, saved);
                        done();
                    });
                }
            });
        });
    });
});