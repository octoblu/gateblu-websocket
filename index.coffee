Gateblu                   = require 'gateblu'
DeviceManagerSocketClient = require './device-manager-socket-client'

class GatebluWebsocket
  constructor: (@options={}) ->

  run: =>
    deviceManager = new DeviceManagerSocketClient host: 'localhost', port: 0xD00D
    deviceManager.connect =>
      new Gateblu @options, deviceManager

module.export = GatebluWebsocket
