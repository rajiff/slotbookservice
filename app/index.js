var express = require('express');
var router = express.Router();
var logger = require('../applogger');

var moment = require('momentjs');

var SlotConsts = require('./slots/slotconsts');

var slotCtrl = require('./slots/slotctrl');
var cartonCtrl = require('./slots/cartonctrl');


router.get('/cartons/day/', function(req, res, next) {
  var slotDay = req.query.date;
  logger.debug("got request to get cartons of day: ", slotDay);
  if (!slotDay) {
    var msg = "Date not specified for obtaining slots for day";
    logger.error(msg);
    return res.status(400).json({
      error: msg
    });
  }

  slotDay = moment(new Date(slotDay)).format(SlotConsts.SLOT_DATE_FORMAT);
  if (slotDay == 'Invalid Date' || slotDay == 'NaN-0NaN-0NaN') {
    var msg = "Invalid Date or incorrect format, try with valid date value";
    logger.error(msg);
    return res.status(400).json({
      error: msg
    });
  }

  cartonCtrl.getDaySlots(slotDay).then(function(cartons) {
    return res.status(200).json(cartons);
  }, function(err) {
    logger.error("Error in obtaining slots for day ", slotDay);
    return res.status(400).json({
      error: err
    });
  });

});

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
      return res.status(400).json(err);
    }
  );

});

router.get('/slots/order/:orderid', function(req, res, next) {
  var orderid = req.params.orderid;

  if (orderid == undefined) {
    logger.error("Invalid parameter passed ");
    return res.status(400).json({
      error: "Invalid inputs..!"
    });
  }

  slotCtrl.getOrderSlot(orderid,
    function(data) {
      return res.status(200).json(data);
    },
    function(err) {
      logger.error("Error in getting order information ", err);
      return res.status(400).json(err);
    }
  );

});

module.exports = router;