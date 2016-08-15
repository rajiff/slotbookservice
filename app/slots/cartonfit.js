function cartonfit(maxVolume) {
  this.volume = 0;
  this.maxVolume = maxVolume;
  this.items = [];
}

cartonfit.prototype.getAvailableVolume = function() {
  return (this.maxVolume - this.volume);
}

cartonfit.prototype.canAddItem = function(itemVolume) {
  return (this.getAvailableVolume() >= itemVolume);
}

cartonfit.prototype.addItem = function(item) {
  var result = this.canAddItem(item.volume);

  if (result) {
    this.items.push(item.volume);
    this.volume += item.volume;
  }

  return result;
}

module.exports = cartonfit;