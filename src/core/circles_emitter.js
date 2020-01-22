//from example found here: https://stackoverflow.com/questions/37929429/sharing-event-across-modules

'use strict';

var util = require('util');
var eventEmitter = require('events').EventEmitter;

function Event () {
  eventEmitter.call(this);
}

util.inherits(Event, eventEmitter);

Event.prototype.sendEvent = function(type, data) {
  this.emit(type, data);
}

var eventBus = new Event();

module.exports = {
  emitter : Event,
  eventBus : eventBus
};
