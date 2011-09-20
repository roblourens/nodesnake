/*  events.js
 *
 *  Events sent and handled by the client 
 *
 *  Dependencies:
 *      ../shared/comm_names.js
 *      ../shared/utils.js
 */

var EventsF = function(socket) {
    var serverSocket = socket;

    return {
        end: function(failPlayers) {
            serverSocket.emit(msgs.END_GAME, data(params.FAIL_PLAYERS, failPlayers));
        },

        newFood: function(food) {
            console.log('sending new food')
            serverSocket.emit(msgs.NEW_FOOD, data(params.X,food.x(),
                                                  params.Y,food.y()));
        },

        turn: function(dir, coords, tick) {
            serverSocket.emit(msgs.TURN, data(params.DIR,dir,
                                              params.COORDS, coords,
                                              params.TIME,new Date().getTime(),
                                              params.TICK,tick));
        },

        join: function() {
            serverSocket.emit(msgs.JOIN, data(params.TIME,new Date().getTime()));
        }
    }
};
