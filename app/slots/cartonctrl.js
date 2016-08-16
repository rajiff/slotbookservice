var moment = require('momentjs');

var logger = require('../../applogger');
var SlotConsts = require('./slotconsts');
var CartonModel = require('./cartons');

var getDaySlots = function(slotDay) {
  return new Promise(function(resolve, reject) {
    CartonModel.find({}, function(err, cartonColln) {
      if (err) {
        logger.error("Error in obtaining cartons for day ", slotDay,
          " ", err);

        return reject(err);
      } else {
        logger.debug("Found ", cartonColln.length, " cartons");

        return resolve(cartonColln);
      }
    })
  });
}

var initializeDaySlots = function(slotDay) {
  return new Promise(function(resolve, reject) {
    //Initialize all the slots of a day
    var cartons = [];

    var slots = SlotConsts.makeSlotsOfDay(slotDay);

    slots.forEach(function(slotTime) {
      var slotCartons = Array.apply(null, Array(SlotConsts.SLOT_MAX_CARTONS));

      slotCartons = slotCartons.map(function(x, i) {

        //Populate non-default and mandatory fields, rest should be as per default
        return new CartonModel({
          "cartontag": (i + 1),
          "slotday": slotDay,
          "slottime": slotTime,
          "items": []
        });

      });
      cartons = cartons.concat(slotCartons);
    });

    CartonModel.create(cartons, function(err, savedCartons) {
      if (err) {
        logger.error("Error in initializing cartons for day ", slotDay,
          " ",
          err);

        return reject(err);
      } else {
        logger.debug("Saved ", savedCartons.length, " cartons");

        return resolve(savedCartons);
      }
    });
  });
}


module.exports = {
  getDaySlots: getDaySlots,
  initializeSlots: initializeDaySlots
}