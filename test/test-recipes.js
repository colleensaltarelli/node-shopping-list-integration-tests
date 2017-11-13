const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

// this lets us use *should* style syntax in our tests
// so we can do things like `(1 + 1).should.equal(2);`
// http://chaijs.com/api/bdd/
const should = chai.should();

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);


describe('Recipes', function() {

  // Before our tests run, we activate the server. Our `runServer`
  // function returns a promise, and we return the that promise by
  // doing `return runServer`. If we didn't return a promise here,
  // there's a possibility of a race condition where our tests start
  // running before our server has started.
  before(function() {
    return runServer();
  });

  // although we only have one test module at the moment, we'll
  // close our server at the end of these tests. Otherwise,
  // if we add another test module that also has a `before` block
  // that starts our server, it will cause an error because the
  // server would still be running from the previous tests.
  after(function() {
    return closeServer();
  });

  // test strategy:
  //   1. make request to `/shopping-list`
  //   2. inspect response object and prove has right code and have
  //   right keys in response object.
  it('should list recipe on GET', function() {
    return chai.request(app)
        .get('/recipes')
        .then(function(res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            const expectedKeys = ['id', 'name', 'ingredients'];
            res.body.forEach(function(item) {
              item.should.be.a('object');
              item.should.include.keys(expectedKeys);
              item.id.should.be.a('string');
              item.name.should.be.a('string');
              item.ingredients.should.be.a('array');
            });
        })
  })
})