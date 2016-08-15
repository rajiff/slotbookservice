var app = require('../app');
var config = require('../appconfig');
const mongoose = require('mongoose');
var moment = require('momentjs');
var request = require("supertest");
var expect = require('chai').expect;
var SlotConsts = require("../app/slots/slotconsts");

//Need slots to be initialized before slot booking
require('./testslotinitialze');

request = request(app);

describe('Slot Booking', function() {

  describe('Input validations - Negative cases, for slot booking for order',
    function() {

      it('Not passing any data', function(done) {
        request.post('/slots/order')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400, done);
      });

      it('Passing order without items', function(done) {
        request.post('/slots/order')
          .send({
            id: '9999',
            items: []
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400, done);
      });

    });

  describe('Booking slots from initial database', function() {

    before(function(done) {
      var dbURI = 'mongodb://localhost/' + config.appdb;
      mongoose.connect(dbURI, function() {

        //Drop any cartons or data for current date before executing any test case
        mongoose.connection.db.dropDatabase(function() {

          //Initialize cartons for the current date, for which further test cases are executed
          request.post('/cartons/day/')
            .send({
              day: Date()
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
        });
      });
    });

    it('Booking a single order', function(done) {
      var order = {
        orderid: '123456',
        items: [{
            "itemid": '12345',
            "orderid": '9999',
            "height": '15',
            "width": '15',
            "breadth": '15'
            },
          {
            "itemid": '12346',
            "orderid": '9999',
            "height": '15',
            "width": '15',
            "breadth": '15'
            }
          ]
      };

      var slotDay = moment().format(SlotConsts.SLOT_DATE_FORMAT);

      request.post('/slots/order')
        .send(order)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          console.log("Booked order to carton: ", res.body);

          expect(res.body.totalitems).to.be.least(order.items.length);
          expect(res.body.cartontag).to.not.be.equal(undefined);
          expect(res.body.slotday).to.not.be.equal(undefined);
          expect(res.body.slottime).to.not.be.equal(undefined);
          expect(res.body.slotday).to.be.equal(slotDay);

          done();
        });
    });

  });
});