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

  var today = moment().format(SlotConsts.SLOT_DATE_FORMAT);

  bookOrder(today, order).then(function(cartonColln) {
    return successCB(cartonColln);
  }).catch(function(err) {
    return errorCB({
      error: err
    });
  });
}

var bookOrder = function(reqDate, order) {
  return new Promise(function(resolve, reject) {

    logger.debug("Trying to book order on ", reqDate, " for order ",
      order.orderId);

    CartonModel.find({
      slotday: reqDate
    }, function(err, cartonColln) {
      if (err) {
        reject(err);
      }

      if (!cartonColln || cartonColln.length <= 0) {
        reject({
          error: "There are no slots found to book..!"
        });
      }

      logger.debug("Found ", cartonColln.length,
        " number of cartons for day: ", reqDate);

      var freeCarton = undefined;

      //Find if slot still has space left for the items of the order
      for (i = 0; i < cartonColln.length; i++) {
        var cartn = cartonColln[i];
        if (!cartn.packed) {
          //check available volume
          if (cartn.canFitItems(order.items)) {
            freeCarton = cartn;
            break;
          } //end of checking for all items
        } //end of checking if packed already
      } //end of looping through all cartons

      if (freeCarton === undefined) {
        reject({
          error: "No carton available..!"
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
            totalitems: savedCarton.totalitems()
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