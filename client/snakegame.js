/*  snakegame.js
 *  
 *  Client-side multisnake game logic
 *
 *  Dependencies:
 *      ./gridbox.js
 *      ./events.js
 *      ../shared/config.js
 *      ../shared/comm_names.js
 *      ./snake.js
 *
 */

var Events;

$(document).ready(function() {
    sock_setup();
    Board.setup();

    // set the join game button action
    $('#join_button').click(joinGame);

    $(document).keyup(Game.keyListener);
});

var Game = (function() {
    /* the game's snake objects */
    var snakes;

    /* the index of snakes which this player controls */
    var playerNum;

    /* the food object */
    var food;

    /* records whether a game is running */
    var gameRunning = false;

    /* the ID of the game loop interval */
    var intervalID;

    /* the current game tick number, incremented each run of the game loop */
    var curTick = 0;

    function addSnake(yStart, color) {
        snakes.push(new Snake(config.XSTART, yStart, color, Game));
    }

    /* returns a new randomly placed food location which is not under the snake */
    function getNewFood() {
        var snake = snakes[playerNum];
        var x = Math.floor(Math.random()*config.XSIZE);
        var y = Math.floor(Math.random()*config.YSIZE);

        while (snake.coversPoint(new Gridbox(x, y))) {
            x = Math.floor(Math.random()*config.XSIZE);
            y = Math.floor(Math.random()*config.YSIZE);
        }

        return new Foodbox(x, y);
    }


    return {
        startGame: function(assignedPlayerNum, food_x, food_y) {
            this.initGame(assignedPlayerNum, food_x, food_y);
            this.preGame(config.COUNTDOWN_DURATION);
        },

        /* called each second until game starts */
        preGame: function(timeLeft) {
            if (timeLeft > 0) {
                $('#info_text').html(config.PREGAME_TEXT + timeLeft + '...');
                var that = this;
                setTimeout(function() { that.preGame(timeLeft-1); }, 1000);
            }
            else
            {
                $('#info_text').css('visibility', 'hidden')
                gameRunning = true;
                intervalID = setInterval(globalLoop, 100/config.SPEED);
                updateScore();
            }
        },

        /* init the gameboard game start */
        initGame: function(assignedPlayerNum, food_x, food_y) {
            console.log('initting game');
            playerNum = assignedPlayerNum;
            snakes = [];
            
            var color0;
            var color1;
            if (playerNum == 0) {
                color0 = "rgb(0,150,0)";
                color1 = "rgb(200,0,0)";
            }
            else {
                color0 = "rgb(200,0,0)";
                color1 = "rgb(0,150,0)";
            }

            addSnake(3, color0);
            addSnake(15, color1);

            Board.reset();
            this.newFood(food_x, food_y);
            Board.addDrawables(snakes);
            Board.draw();
        },

        opponentTurn: function(turnedPlayerNum, dir, coords, tick) {
            var snake = snakes[turnedPlayerNum];
            snake.compensate(coords, tick);
            snake.doTurn(dir);
        },

        newFood: function(x, y) {
            food = new Foodbox(x, y);
            Board.addDrawable(food);
        },

        endGame: function(failPlayers) {
            clearInterval(intervalID);
            if (gameRunning)
                console.log('Received game_end command but did not detect game end');

            if ($.inArray(playerNum, failPlayers) >= 0)
                alert(config.FAILMSG)
            else
                alert(config.WINMSG)

            $('#join_button').removeAttr('disabled');
        },

        disconnect: function() {
            if (gameRunning)
                alert(config.DISCONNECTMSG);

            gameRunning = false;
        },

        playerScore: function() {
            return snakes[playerNum].score;
        },

        otherScore: function() {
            return snakes[Math.abs(playerNum-1)].score;
        },

        update: function() {
            for (var i in snakes)
                snakes[i].update(food, curTick);
        },

        /* main game loop */
        loop: function() {
            this.update();
            Board.draw();

            // check collisions
            var failPlayers = [];
            for (var i=0; i<snakes.length; i++)
                if (snakes[i].hasCollided(snakes))
                    failPlayers.push(i);

            // if >=1 snakes lost, send end game signal
            if (failPlayers.length >=1) {
                gameRunning = false;
                Events.end(failPlayers);
            }

            // make new food, if needed
            if (food)
                for (var i in snakes) {
                    if (snakes[i].gotFood(food)) {
                        Board.removeDrawable(food);
                        food = null;
                        if (playerNum == config.FOOD_MAKING_PLAYERNUM)
                            Events.newFood(getNewFood());

                        break;
                    }
                }

            updateScore();
            curTick++;
        },

        curTick: function() {
            return curTick;
        },

        food: function() {
            return food;
        },

        /* keyup listener */
        keyListener: function(e) {
            if (gameRunning) {
                var snake = snakes[playerNum];
                if (snake.doTurn({
                    37:'l',
                    38:'u',
                    39:'r',
                    40:'d'
                }[e.keyCode]))
                    Events.turn(snake.dir, [snake.head.x(), snake.head.y()], curTick);
            }
            else {
                console.log('keypress ignored: playerNum not yet assigned');
            }
        },

        /* debug purposes only */
        snakes: function() {
            return snakes;
        }
    }
})();


var Board = (function() {

    /* the gameboard context */
    var ctx;

    /* things with a draw() method that will be drawn on this board */
    var drawables = [];

    return {
        addDrawable: function(drawable) {
            drawables.push(drawable);
        },

        removeDrawable: function(drawable) {
            var i = drawables.indexOf(drawable);
            delete drawables[i];
        },

        addDrawables: function(drawableArray) {
            for (var i in drawableArray)
                this.addDrawable(drawableArray[i]);
        },

        draw: function() {
            this.clear();
            drawables.forEach(function(drawable) {
                drawable.draw(ctx);
            });
        },

        setup: function() {
            ctx = $('#gameboard')[0].getContext('2d'); 

            // ctx.canvas doesn't know it's size unless set here or directly on the element,
            // for some reason
            // css has no effect- whatever. set wrapper width here so those numbers are in one place
            ctx.canvas.setAttribute('width', config.WIDTH);
            ctx.canvas.setAttribute('height', config.HEIGHT);
            $('#wrapper').width(config.WIDTH);
        },

        clear: function() {
            ctx.clearRect(0, 0, 
                           config.XSIZE*(config.GRID_SIZE + config.GRID_PAD) + 
                                config.GRID_PAD,

                           config.YSIZE*(config.GRID_SIZE + config.GRID_PAD) + 
                                config.GRID_PAD);
        },

        reset: function() {
            this.clear();
            drawables = [];
        }
    }
})();

/* update the score <span> */
function updateScore() {
    $('#player_score').html(Game.playerScore());
    $('#opponent_score').html(Game.otherScore());
}

/* update the latency <span> */
function updateLatency(latency) {
    $('#latency').html(latency);

    if (latency < 50)
        var color = 'rgb(0, 200, 0)';
    else if (latency < 150)
        var color = 'rgb(242, 214, 0)';
    else
        var color = 'rgb(200, 0, 0)';
    $('#latency').css('color', color);
}

function joinGame() {
    console.log('join_button clicked');
    $('#join_button').attr('disabled', 'disabled');
    if (Events) {
        $('#info_text').html('Searching for opponent...');
        $('#info_text').css('visibility', 'visible');
        Events.join();
    }
    else {
        console.log('Waiting for socket to connect');
        setTimeout(joinGame, 500);
    }
}


function sock_setup() {
    console.log('connecting...')
    var socket = io.connect('aws.roblourens.com:8080');

    socket.on('connect', function() {
        console.log('connected');
        $('#info_text').css('visibility', 'hidden');
        $('#join_button').removeAttr('disabled');
        Events = new EventsF(socket);

        socket.on(msgs.OPPONENT_TURN, function(data) {
            console.log('my opponent turned ' + data[params.DIR] + '!');
            Game.opponentTurn(data[params.PLAYER_NUM], data[params.DIR], data[params.COORDS], data[params.TICK])
        });

        socket.on(msgs.START_GAME, function(data) {
            console.log('starting game');
            Game.startGame(data[params.PLAYER_NUM], data[params.X], data[params.Y]);
        });

        socket.on(msgs.END_GAME, function(data) {
            console.log('Received game end command');
            Game.endGame();
        });

        socket.on(msgs.NEW_FOOD, function(data) {
            console.log('Received new food');
            Game.newFood(data[params.X], data[params.Y]);
        });

        socket.on(msgs.PING, function(data) {
            var latency = new Date().valueOf()-data[params.TIME];
            updateLatency(latency);
        });

        socket.on(msgs.DISCONNECT, function(data) {
            console.log('Got disconnect message');
            Game.disconnect();
        });
    });
}

/* js is confusing sometimes */
function globalLoop() {
    Game.loop();
}
