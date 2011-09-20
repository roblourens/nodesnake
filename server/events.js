/*  events.js
 *
 *  Events sent and handled by the server
 *
 *  Dependencies:
 *      ./comm_names.js
 *      ./utils.js
 */
var msgs = require('../shared/comm_names.js').msgs
var params = require('../shared/comm_names.js').params
var data = require('../shared/utils.js').data

/*
 *  Sent events
 */

Events = module.exports = {}

Events.opponent_turned = function(socket, dir, coords, tick, turnedPlayerNum) {
    socket.emit(msgs.OPPONENT_TURN, data(params.DIR,dir, 
                                        params.COORDS,coords, 
                                        params.PLAYER_NUM,turnedPlayerNum),
                                        params.TICK,tick)
}

Events.disconnect = function(socket) {
    socket.emit(msgs.DISCONNECT)
}

Events.start = function(socket, playerNum, foodX, foodY) {
    socket.emit(msgs.START_GAME, data(params.PLAYER_NUM,playerNum, 
                                     params.X,foodX, 
                                     params.Y,foodY));
}

Events.end = function(socket, failPlayers) {
    socket.emit(msgs.END_GAME, data(params.FAIL_PLAYERS, failPlayers));
}

Events.disconnect = function(socket) {
    socket.emit(msgs.DISCONNECT)
}

Events.newFood = function(socket, x, y) {
    socket.emit(msgs.NEW_FOOD, data(params.X,x, 
                                   params.Y,y));
}

Events.ping = function(socket, time) {
    socket.emit(msgs.PING, data(params.TIME,time));
}
