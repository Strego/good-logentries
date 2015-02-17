'use strict';

var GoodReporter = require('good-reporter');
var util         = require('util');
var logentries   = require('node-logentries');

function getLogLevelFromTags(tags) {
  var levels = [ 'emerg', 'alert', 'crit', 'error', 'warn', 'notice', 'info', 'debug' ];

  for (var i = 0; i < levels.length; i++) {
    if (tags.indexOf(levels[i]) != -1) {
      return levels[i];
    }
  }

  return 'info';
}

function GoodLogEntries(events, options) {
  GoodReporter.call(this, events);

  if (typeof options === 'string' || options instanceof String) {
    options = { token : options };
  }

  options.levels = {
    debug  : 0,
    info   : 1,
    notice : 2,
    warn   : 3,
    error  : 4,
    crit   : 5,
    alert  : 6,
    emerg  : 7
  };

  this.config = options;
}

util.inherits(GoodLogEntries, GoodReporter);

GoodLogEntries.prototype.start = function(emitter, callback) {
  emitter.on('report', this._handleEvent.bind(this));

  this.logentries = logentries.logger(this.config);

  callback();
};

GoodLogEntries.prototype.stop = function() {
  this.logentries.end();
};

GoodLogEntries.prototype._report = function(event, eventData) {
  var level;
  if (event === 'ops') {
    level = 'debug';
  } else if (event === 'error') {
    level = 'error';

    if (eventData.request) {
      delete eventData.request;
    }

  } else if (event === 'log') {

    if (Array.isArray(eventData.tags)) {
      level = getLogLevelFromTags(eventData.tags);

    } else {
      level = 'info';
    }

  } else if (event === 'response') {
    if (eventData.statusCode >= 500) {
      level = 'error';
    } else if (eventData.statusCode >= 400) {
      level = 'warn';
    } else {
      level = 'info';
    }
  }

  this.logentries.log(level, eventData);
};

module.exports = GoodLogEntries;
