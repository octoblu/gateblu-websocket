var util = require('util');
var EventEmitter = require('events').EventEmitter;

var when = require('when');
var _ = require('lodash');
var uuid = require('node-uuid');
var WebSocket = require('ws');

var DeviceSocketClient = function(config) {
  var self = this;
  var messageCallbacks = {};
  var sendMessage, routeMessage;

	var connPromise = when.promise(function(resolve, reject){
    var conn = new WebSocket('ws://' + config.host + ':' + config.port);
    if (!conn.on) {
      conn.on = conn.addEventListener;
    }

    conn.on('open', function(){
      resolve(conn);
    });
  // 	var conn = net.connect({host: config.host, port: config.port}, function(){
  // 		conn.on('data', routeMessage);
  //     resolve(conn);
		// });
  });

  connPromise.catch(function(error){
    console.error("DeviceSocketClient error: ");
    console.error(error.message);
    console.error(error.stack);
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
