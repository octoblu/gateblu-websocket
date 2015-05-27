uuid      = require 'node-uuid'
WebSocket = require 'ws'

class DeviceManagerSocketClient
  constructor: (options={}) ->

  connect: (callback=->) =>
    @connection = new WebSocket "ws://#{options.host}:#{options.port}"
    @connection.once 'open', callback

  addDevice: (data, callback=->) =>
    @sendMessage 'addDevice', data, callback

  removeDevice: =>
    @sendMessage 'removeDevice', data, callback

  startDevice: =>
    @sendMessage 'startDevice', data, callback

  stopDevice: =>
    @sendMessage 'stopDevice', data, callback

  callCallback: =>
    message = JSON.parse message
    @messageCallbacks[message.id]?(message.data)
    delete @messageCallbacks[message.id]

  sendMessage: (action, data, callback=->) =>
    message = {action: action, id: uuid.v4(), data: data}
    @connection.send JSON.stringify message
    @messageCallbacks[message.id] = callback

module.exports = DeviceManagerSocketClient
