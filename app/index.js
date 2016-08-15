var express = require('express');
var router = express.Router();
var logger = require('../applogger');

var moment = require('momentjs');

var SlotConsts = require('./slots/slotconsts');

var slotCtrl = require('./slots/slotctrl');
var cartonCtrl = require('./slots/cartonctrl');

router.post('/cartons/day/', function(req, res, next) {
  if (!('day' in req.body)) {
    var msg = "Date not specified for initializing slots for day";
    logger.error(msg);
    return res.status(400).json({
      error: msg
    });
  }

  /*logger.debug('Got request to initialize slots for date ', req.body
    .day, " parses to ", moment(new Date(req.body.day)).format(SlotConsts.SLOT_DATE_FORMAT)
  );*/

  var slotDay = moment(new Date(req.body.day)).format(SlotConsts.SLOT_DATE_FORMAT);
  if (slotDay == 'Invalid Date' || slotDay == 'NaN-0NaN-0NaN' || slotDay <
    moment().format(
      SlotConsts.SLOT_DATE_FORMAT)) {
    var msg = "Invalid Date or incorrect format, try with valid date value";
    logger.error(msg);
    return res.status(400).json({
      error: msg
    });
  }

  cartonCtrl.initializeSlots(slotDay).then(function(cartons) {
    return res.status(200).json(cartons);
  }, function(err) {
    logger.error("Error in initializing slots for day ", slotDay);
    return res.status(400).json({
      error: err
    });
  });

});

router.post('/slots/order', function(req, res, next) {
  var order = req.body;

  if (order === undefined || Object.keys(order).length <= 0) {
    logger.error("Invalid inputs no order data ", order);
    return res.status(400).json({
      error: "Invalid inputs..!"
    });
  }

  slotCtrl.bookSlot(order,
    function(data) {
      return res.status(200).json(data);
    },
    function(err) {
      logger.error("Error in booking slot for order ", err);
      return res.status(400).json({
        error: err
      });
    }
  );

});

module.exports = router;