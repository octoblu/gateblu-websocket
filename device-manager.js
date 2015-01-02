var util = require('util');
var EventEmitter = require('events').EventEmitter;
var debug     = require('debug')('gateblu:deviceManager');
var DeviceSocketClient = require('./device-socket-client');

var DeviceManager = function (config) {
  var self = this;
  
  var deviceSocketClient = new DeviceSocketClient({host: config.host, port: config.port});

  self.getOptions = function(callback) {
    debug('getOptions');
    deviceSocketClient.getOptions(callback);        
  };

  self.refreshDevices = function (devices, callback) {
    debug('refreshDevices', _.pluck(devices, 'uuid'));
    deviceSocketClient.refreshDevices(devices, callback);
  };

  self.deviceExists = function (device, callback) {
    debug('deviceExists', device.uuid)        
    deviceSocketClient.devicesExists(device, callback);
  };
  
  self.startDevice = function (device, callback) {
    debug('startDevice', device.uuid);      
    deviceSocketClient.startDevice(device, callback);
  };

  self.stopDevice = function (uuid, callback) {    
    debug('stopDevice', uuid);        
    deviceSocketClient.stopDevice(uuid, callback);
  };

  self.stopDevices = function(callback) {
    debug('stopDevices');
    deviceSocketClient.stopDevices(callback);
  };

};

util.inherits(DeviceManager, EventEmitter);
module.exports = DeviceManager;
