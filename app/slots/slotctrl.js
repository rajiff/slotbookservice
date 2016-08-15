var moment = require('momentjs');

var logger = require('../../applogger');
var SlotConsts = require('./slotconsts');
var CartonModel = require('./cartons');

var bookAvailableSlot = function(order, successCB, errorCB) {
  logger.info('Booking slots for order ', order);

  if (order.items.length <= 0) {
    return errorCB({
      error: "Invalid order or empty items"
    });
  }

  var reqDate = moment().format(SlotConsts.SLOT_DATE_FORMAT);

  //Start finding slot with current day
  return findSlotDay(1, reqDate, order, successCB, errorCB)
}

//Make a recursive attempts for the future days to find the slot for the order, 
//however after max forward days or other error, it aborts
function findSlotDay(daysAttempted, reqDate, order, successCB, errorCB) {

  bookOrder(reqDate, order).then(function(bookedCarton) {
    return successCB(bookedCarton);
  }).catch(function(err) {

    if (daysAttempted <= SlotConsts.SLOT_BOOKING_MAX_FUTURE_DAYS && err.error ==
      'No slot available') {

      //increment to future date by one day
      ++daysAttempted;
      reqDate = moment(reqDate)
        .add(1, SlotConsts.SLOT_DAY_UNIT).format(SlotConsts.SLOT_DATE_FORMAT);

      return findSlotDay(daysAttempted, reqDate, order, successCB, errorCB);

    } else {
      return errorCB(err);
    }
  });
}

var bookOrder = function(reqDate, order) {
  return new Promise(function(resolve, reject) {

    logger.debug("Booking order ", order.orderid, " on ", reqDate);

    CartonModel.find({
      slotday: reqDate,
      packed: false
    }).sort({
      totalitems: -1
    }).exec(function(err, cartonColln) {
      if (err) {
        reject({
          error: err
        });
      }

      if (!cartonColln || cartonColln.length <= 0) {
        reject({
          error: "There are no slots available try booking your order..!"
        });
      }

      logger.debug("Attempting to find free carton among ",
        cartonColln.length, " for day: ", reqDate);

      //Ok lets find a free carton now, start assuming there is none
      var freeCarton = undefined;

      //Loop through day's cartons across slots
      for (i = 0; i < cartonColln.length; i++) {
        var cartn = cartonColln[i];

        //check available volume
        if (cartn.canFitItems(order.items)) {
          freeCarton = cartn;
          break;
        } //end of checking for all items

      } //end of looping through all cartons

      if (freeCarton === undefined) {
        reject({
          error: "No slot available"
        });
      } else {
        //insert the order items to available cartons 
        order.items.forEach(function(item) {
          freeCarton.items.push({
            "itemid": item.itemid,
            "orderid": order.orderid,
            "height": item.height,
            "width": item.width,
            "breadth": item.breadth
          });
        });

        freeCarton.totalitems = freeCarton.items.length;

        //Below volume of 1 would mean a box, less than 1 unit all sides, which is assumed to be not existing
        if (freeCarton.freeVolume() < 1) {
          freeCarton.packed = true;
        }

        freeCarton.save(function(err, savedCarton) {
          if (err) {
            reject({
              error: err
            });
          }

          if (!savedCarton) {
            reject({
              error: err
            });
          }

          var result = {
            slottime: savedCarton.slottime,
            slotday: savedCarton.slotday,
            cartontag: savedCarton.cartontag,
            size: savedCarton.size,
            totalitems: savedCarton.totalitems
          }

          //logger.debug("Order was booked to carton: ", savedCarton);

          resolve(result);
        });
      }
    });
  });
}

module.exports = {
  bookSlot: bookAvailableSlot
}