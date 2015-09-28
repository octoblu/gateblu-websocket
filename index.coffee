Gateblu                   = require 'gateblu/index.coffee'
DeviceManagerSocketClient = require './device-manager-socket-client.coffee'

class GatebluWebsocket
  constructor: (@options={}) ->

  run: =>
    deviceManager = new DeviceManagerSocketClient host: 'localhost', port: 0xD00D
    deviceManager.connect =>
      gateblu = new Gateblu @options, deviceManager
      gateblu.on 'ready', deviceManager.onReady

module.exports = GatebluWebsocket
