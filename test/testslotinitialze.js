var app = require('../app');
var config = require('../appconfig');
const mongoose = require('mongoose');

var request = require("supertest");

request = request(app);

describe('Initialize carton slots and their containers for a given day(date)',
  function() {

    before(function(done) {
      var dbURI = 'mongodb://localhost/' + config.appdb;
      mongoose.connect(dbURI, function() {
        mongoose.connection.db.dropDatabase(function() {
          done();
        });
      });
    });

    it('Not passing date parameter',
      function(done) {
        request.post('/cartons/day/')
          .send()
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400, done);
      }
    );

    it('Empty date parameter',
      function(done) {
        request.post('/cartons/day/')
          .send({
            day: ""
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400, done);
      }
    );

    it('Invalid date format',
      function(done) {
        request.post('/cartons/day/')
          .send({
            day: "foo-bar 2016"
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400, done);
      }
    );

    it('Date in the past',
      function(done) {
        request.post('/cartons/day/')
          .send({
            day: "1999-01-01"
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400, done);
      }
    );

    it('Valid date',
      function(done) {
        request.post('/cartons/day/')
          .send({
            day: Date()
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200, done);
      }
    );

  }
);