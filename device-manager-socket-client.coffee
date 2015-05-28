uuid      = require 'node-uuid'
WebSocket = require 'ws'

class DeviceManagerSocketClient
  constructor: (@options={}) ->
    @messageCallbacks = {}

  connect: (callback=->) =>
    @connection = new WebSocket "ws://#{@options.host}:#{@options.port}"

    if @connection.on?
      @connection.on 'open', callback
      @connection.on 'error', console.error
      @connection.on 'message', @onMessage
    else
      @connection.onopen = callback
      @connection.onerror = => console.error 'connection error', arguments
      @connection.onmessage = @onMessage

  addDevice: (data, callback=->) =>
    @sendMessage 'addDevice', data, callback

  removeDevice: =>
    @sendMessage 'removeDevice', data, callback

  startDevice: =>
    @sendMessage 'startDevice', data, callback

  stopDevice: =>
    @sendMessage 'stopDevice', data, callback

  onMessage: (message) =>
    message = JSON.parse message
    @messageCallbacks[message.id]?(message.error, message.data)
    delete @messageCallbacks[message.id]

  sendMessage: (action, data, callback=->) =>
    message = {action: action, id: uuid.v4(), data: data}
    @connection.send JSON.stringify message
    @messageCallbacks[message.id] = callback

module.exports = DeviceManagerSocketClient
