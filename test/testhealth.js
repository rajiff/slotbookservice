var app = require('../app');
var request = require("supertest");

request = request(app);

describe('Should respond with 404 status within expected time', function() {

  this.timeout(200);

  it('GET should respond with 404 status and json data', function(done) {
    request.get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('POST should respond with 404 status and json data', function(done) {
    request.post('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('PATCH should respond with 404 status and json data', function(done) {
    request.patch('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('DELETE should respond with 404 status and json data', function(done) {
    request.delete('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

});