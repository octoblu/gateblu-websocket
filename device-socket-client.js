var util = require('util');
var EventEmitter = require('events').EventEmitter;

var net = require('net');
var when = require('when');
var _ = require('lodash');
var uuid = require('node-uuid');

var DeviceSocketClient = function(config) {
  var self = this;
  var messageCallbacks = {};
  var sendMessage, routeMessage;

	var connPromise = when.promise(function(resolve, reject){
  	var conn = net.connect({host: config.host, port: config.port}, function(){
  		conn.on('data', routeMessage);
      resolve(conn);
		});    
  });

  self.getOptions = function(callback) {
    sendMessage('getOptions', null, callback);
  };

  self.refreshDevices = function(devices, callback) {
    sendMessage('refreshDevices', devices, callback);
  };

  self.deviceExists = function(device, callback) {
    sendMessage('deviceExists', device, callback);
  };

  self.startDevice = function(device, callback) {
    sendMessage('startDevice', device, callback);
  };

  self.stopDevice = function(uuid, callback) {
    sendMessage('stopDevice', uuid, callback);
  };

  self.stopDevices = function(callback) {
    sendMessage('stopDevices', null, callback);
  };

  sendMessage = function(name, data, callback ) {
    var message = { name: name, id: uuid.v4(), data: data};
    connPromise.then(function(conn){
      conn.write(JSON.stringify(message));
      if(callback) {
        messageCallbacks[message.id] = callback;
      }

    });
  };

  routeMessage = function(message) {
    message = JSON.parse(message);
    
    if(messageCallbacks[message.id]) {
      messageCallbacks[message.id](message.data);
      delete messageCallbacks[message.id];
    }

    self.emit(message.name, message.data);
  };

};

util.inherits(DeviceSocketClient, EventEmitter);
module.exports = DeviceSocketClient;