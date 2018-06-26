Simple Database
===

Build a simple object database that stores and retrieves objects from the file system.

Standard repository/dev stuff: `README.md`, `package.json`, `.gitignore`, `.eslintrc`, `.travis.yml`, tests, meaningful commits, named npm scripts, etc.

Make sure your `README.md` describes your store API.

**Solo assignment**

## Doc/Resources
* [Node fs docs](https://nodejs.org/api/fs.html) - specifically the methods `readdir`, `readFile`, `writeFile`, and `unlink`
* [Node path docs](https://nodejs.org/api/path.html) - specifically the methods `join` and possibly `resolve`
* JSON [stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
and [parse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
* Checkout `mkdirp` and `rimraf` on npm!

## Description:

You library will have:

1. A `Store` class that takes a name of a directory to use and then stores and retrieves
objects by writing and reading them to files in the directory.

Here is an example of how your module would be imported (required) and used:

```js

const Store = require('../lib/store');
const rootDirectory = path.join(__dirname, 'animals');
const store = new Store(rootDirectory);

store.save({ name: 'garfield' });
  .then(animal => {
    return store.get(cat._id);
  })
  .then(cat => {
    console.log('got cat', cat);
    // { name: 'garfield' }
  })
  .catch(err => console.log(err));
```

Here is an example of how the directories and files would be structured:

```
+--+ animals
   |
   +---* 34fdr5.json
   |
   +---* 65rej5.json
   |
   +---* 93odb2.json
```

## Process

Use TDD to drive the implementation. 

The setup for the tests will require that you **start with a "clean" file directory**. 
This is where `rimraf` and `mkdirp` will come in handy in your [Mocha's before/after hooks](https://mochajs.org/#hooks). 

Your tests will need to handle asynchronous calls.  
You will need to read about [Mocha and async support](https://mochajs.org/#asynchronous-code). (HINT: return Promises!)

### `Store`

* A Class with a constructor that takes its root directory it should save and read files to and from. 
* The directory should already exist!
* The class has the following methods:

1. `.save(<objectToSave>)`
    * Creates a `_id` property for the object (Use third-party npm module like `shortid` or `uuid` or ?)
    * Saves the object to a file (`JSON.stringify`), where the filename is the `_id`. For example, if the id is 3k4e66, the file will be `3k4e66.json`
    * Return a promise that will resolve to the saved object that has the added `_id` property
1. `.get(<id>)`
    * Return a promise that will resolve to the deserialized (`JSON.parse`) object that has that id
    * If an object with that id does not exists, return `null` from the promise (HINT: catch `ENOENT` errors)
1. `.remove(<id>)`
    * The store should removes the file of the object with that id.
    * Return a promise that is called with `{ removed: true }` if object was removed, or `{ removed: false }` 
    if the id did not exist (HINT: catch `ENOENT` error)
1. `.getAll()`
    * Return a promise that is resolved with array of all objects in the directory. (hint: can you use the store's `get(id)` method as part of this?), 
    or resolves to an empty array `[]` when no objects in the directory.
1. STRETCH GOAL: `.update(<objectToUpdate>)`
    * Write the new object to file, replacing existing object
    * Return a promise that resolves with the updated object

TDD the above methods on the `Store` class. Test that the objects are handled correctly by using the API methods, but do **not** test that the files were written to the directory

### Tests

For the setup, make sure the directory to pass to the store has been removed and then recreated _for each test_

Here are suggested tests (in order):

1. Pass an object to the `.save` method and assert that the saved object has an _id property. Use that _id to `.get` the object and test that "got" object is semantically the same as original object.
2. Pass a bad id to `.get` and assert that `null` is returned for the callback.
3. Save an object, then pass its _id to `.remove` and check that `{ removed: true }` is returned
for the callback. Pass the _id to `.get` and assert that `null` is returned.
4. Pass a bad id to `.remove` and assert that `{ removed: false }` is returned
for the callback.
5. For a newly create store, test that `.getAll` returns an empty array `[]` for the callback.
6. Save a few objects, then test that `.getAll` returns an array of those objects.

## Rubric:

* Tests: 3pts
* Async Coding: 3pts
* Functional Correct Behavior: 2pts
* Project (Module) Organization: 2pts