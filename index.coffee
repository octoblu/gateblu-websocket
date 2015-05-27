Gateblu                   = require 'gateblu/index.coffee'
DeviceManagerSocketClient = require './device-manager-socket-client'

class GatebluWebsocket
  constructor: (@options={}) ->

  run: =>
    deviceManager = new DeviceManagerSocketClient host: 'localhost', port: 0xD00D
    deviceManager.connect =>
      new Gateblu @options, deviceManager

module.exports = GatebluWebsocket
