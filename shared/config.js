/*  config.js
 *  
 *  configuration info shared between server and client
 *
 *  Dependencies:
 *
 */

if (typeof(require) !== 'undefined')
    var clientServerModule = require('./cs_module.js').clientServerModule;

var config = 
{
    /* the port that socket.io will run on */
    PORT: 8080,

    /* the url that socket.io will run on */
    URL: 'http://aws.roblourens.com',

    /* x grid boxes */
    XSIZE: 50,

    /* y grid boxes */
    YSIZE: 40,

    /* grid size in px */
    GRID_SIZE: 10,

    /* px GRID_PAD b/w grid boxes */
    GRID_PAD: 1,

    /* game loops every 100/SPEED ms. (higher is faster) */
    SPEED: 1,

    /* score per food collected */
    SCORE_DELTA: 5,

    /* starting x coord of the snakes */
    XSTART: 3,

    /* player 0 y start */
    YSTART0: 3,

    /* player 1 y start */
    YSTART1: 15,

    /* the player that will create the new food object, when needed */
    FOOD_MAKING_PLAYERNUM: 0,

    /* the message displayed for a loss */
    FAILMSG: 'You fail! You have brought shame onto your snake family.',

    /* the message displayed for a win */
    WINMSG: 'You win! You devour the opposing snake in celebration.',

    /* the message displayed if the opponent disconnects during the game */
    DISCONNECTMSG: 'Your opponent ragequit. What a dick.',

    /* the color of the food */
    FOOD_COLOR: 'rgb(0, 0, 100)',

    /* info shown when finding a match */
    FINDING_MATCH_TEXT: 'Searching for an opponent...',

    /* info shown before match start, will have seconds remaining */
    PREGAME_TEXT: 'You are the green snake! Starting in ',

    /* number of seconds to count down */
    COUNTDOWN_DURATION: 3
}

/* size of the board */
config['WIDTH']  = config['XSIZE']*(config['GRID_SIZE'] + config['GRID_PAD']) + config['GRID_PAD'];
config['HEIGHT'] = config['YSIZE']*(config['GRID_SIZE'] + config['GRID_PAD']) + config['GRID_PAD'];

clientServerModule(config, typeof(exports) !== 'undefined' ? exports : 0);
