var debug         = require('debug')('gateblu:command');
var Gateblu       = require('gateblu');
var DeviceManager = require('./device-manager');

var GatebluCommand = function(options){
  var self, gateblu;
  self = this;
  options = options || {};  

  self.run = function(){    
    var deviceManager = new DeviceManager({
      host: options.host || 'localhost',
      port: options.port || 0xD00D
    });

    deviceManager.getOptions(function(gatebluOptions){
      debug('gatebluOptions', gatebluOptions);
      gateblu = new Gateblu(gatebluOptions, deviceManager);
    });

  };
}
var gatebluCommand  = new GatebluCommand();
gatebluCommand.run();
