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

  removeDevice: (data, callback=->) =>
    @sendMessage 'removeDevice', data, callback

  startDevice: (data, callback=->) =>
    @sendMessage 'startDevice', data, callback

  stopDevice: (data, callback=->) =>
    @sendMessage 'stopDevice', data, callback

  onReady: (data, callback=->) =>
    @sendMessage 'ready', data, callback

  onMessage: (wholeMessage) =>
    message = JSON.parse wholeMessage.data
    @messageCallbacks[message.id]?(message.error, message.data)
    delete @messageCallbacks[message.id]

  sendMessage: (action, data, callback=->) =>
    message = {action: action, id: uuid.v4(), data: data}
    @connection.send JSON.stringify message
    @messageCallbacks[message.id] = callback

module.exports = DeviceManagerSocketClient
