var mongoose = require('mongoose');

var SlotConsts = require('./slotconsts');

var schema = new mongoose.Schema({
  "cartontag": {
    type: String,
    required: true
  },
  "slotday": {
    type: String,
    required: true
  },
  "slottime": {
    type: String,
    required: true
  },
  "size": {
    type: String,
    default: 'regular'
  },
  "packed": {
    type: Boolean,
    default: false
  },
  "totalitems": {
    type: Number,
    default: 0
  },
  "items": [
    {
      "itemid": {
        type: String,
        required: true
      },
      "orderid": {
        type: String,
        required: true
      },
      "height": {
        type: Number,
        required: true
      },
      "width": {
        type: Number,
        required: true
      },
      "breadth": {
        type: Number,
        required: true
      }
    }
  ]
}, {
  collection: "cartons"
});

schema.index({
  cartontag: 1,
  slotday: 1,
  slottime: 1
}, {
  unique: true
});

schema.methods = {

  mySize: function() {
    //Currently default size is regular only
    return SlotConsts.SLOT_CARTON_SIZE_REGULAR;
  },

  maxVolume: function() {
    var mySize = this.mySize();

    return (mySize.h * mySize.w * mySize.b);
  },

  filledVolume: function() {
    var fill = 0;
    this.items.forEach(function(item) {
      fill += (item.height * item.width * item.breadth);
    });

    return fill;
  },

  freeVolume: function() {
    return (this.maxVolume() - this.filledVolume());
  },

  canFitOneItem: function(h, w, b) {
    var itemVolume = (h * w * b);

    return (this.freeVolume() >= itemVolume);
  },

  canFitItems: function(itemsArray) {
    var totVolume = 0;
    itemsArray.forEach(function(item) {
      totVolume += (item.height * item.width * item.breadth);
    });

    return (this.freeVolume() >= totVolume);
  }
}

var model = mongoose.model('cartons', schema, schema.get('collection'));

module.exports = model;