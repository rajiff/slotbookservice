var moment = require('momentjs');

var makeDaySlots = function(slotDay) {
  var slots = [
                moment((slotDay + " 09:00")).format(SlotConsts.SLOT_TIME_FORMAT),
                moment((slotDay + " 11:00")).format(SlotConsts.SLOT_TIME_FORMAT),
                moment((slotDay + " 14:00")).format(SlotConsts.SLOT_TIME_FORMAT),
                moment((slotDay + " 16:00")).format(SlotConsts.SLOT_TIME_FORMAT)
              ];

  return slots;
}

var SlotConsts = {
  MAX_SLOTS: 4,
  SLOT_DURATION_HRS: 2,
  SLOT_START_TIME: 9,
  SLOT_BOOKING_MAX_FUTURE_DAYS: 5,
  SLOT_DATE_FORMAT: "YYYY-MM-DD",
  SLOT_DAY_UNIT: moment.DAY,
  SLOT_TIME_FORMAT: "YYYY-MM-DD HH",
  SLOT_TIME_UNIT: moment.HOUR,
  SLOT_MAX_CARTONS: 1,
  SLOT_CARTON_SIZE_REGULAR: {
    h: 15,
    w: 30,
    b: 15
  },
  makeSlotsOfDay: makeDaySlots
}

module.exports = SlotConsts;