/*  matchup.js
 *
 *  A multisnake game between 2 players 
 *  
 *  Dependencies:
 *      ./events.js
 *      ../shared/config.js
 */

var config = require('../shared/config.js');

var Matchup = function() {
    /* the players involved in this matchup */
    var playersocks = [];

    /* is the game running? */
    var gameRunning = false;

    /* 2 players allowed */
    var capacity = 2;

    return {
        /* Add a player to this matchup. Game starts if full after adding the player.
           Error thrown if already full. */
        addPlayer: function(socket) {
            if (this.isFull())
                throw "Matchup is already full";

            playersocks.push(socket);

            if (this.isFull())
                this.startGame();

            console.log('added player- there are now ' + playersocks.length +
                ' players in this match');
        },

        isFull: function() {
            return playersocks.length == capacity;
        },

        turned: function(socket, dir, coords, tick) {
            console.log('sending turn');
            // send the turn to all sockets except the sender
            for (var i=0; i<playersocks.length; i++) {
                var s = playersocks[i];
                if (s != socket)
                    Events.opponent_turned(s, dir, coords, tick, playersocks.indexOf(socket));
            } 
        },

        // Sends the game_end signal to all players
        endGame: function(fail_players) {
            console.log('Ending game');
            if (gameRunning) {
                gameRunning = false;
                playersocks.forEach(function(s) {
                    Events.end(s, fail_players);
                });
            }
        },

        startGame: function() {
            var food = getInitialFood();
            gameRunning = true;
            for (var i=0; i<playersocks.length; i++) {
                var s = playersocks[i];
                Events.start(s, i, food[0], food[1]);
            }
        },

        broadcastFood: function(x, y) {
            if (gameRunning) {
                playersocks.forEach(function(s) {
                    Events.newFood(s, x, y);
                });
            }
        },

        // If someone disconnects, and if the game is running, remove that socket and send the
        // disconnected message to all other players
        disconnect: function(socket) {
            if (gameRunning) {
                var i = playersocks.indexOf(socket);
                delete playersocks[i];

                playersocks.forEach(function(s) {
                    Events.disconnect(s);
                });
            }
        },

        playersocks: function() {
            return playersocks;
        }
    }
}

/* generate a food object to start the game by putting it between START_X and the right edge.
 * hopefully simpler than generating it on the client and adding another condition before game   
   start? */
function getInitialFood() {
    var x = Math.floor(Math.random()*(config.XSIZE));

    // don't put the initial food in the same row as a snake
    var y;
    do {
        y = Math.floor(Math.random()*config.YSIZE);
    } while (y == config.YSTART0 || y == config.YSTART1); 

    return [x, y];
}

exports.Matchup = Matchup;
