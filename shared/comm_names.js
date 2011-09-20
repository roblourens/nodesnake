/*  comm_names.js
 *
 *  The names of messages to be used in multisnake client-server communication
 *
 *  
 *
 *  Dependencies:
 *      ./cs_module.js
 */

if (typeof(require) !== 'undefined')
    var clientServerModule = require('./cs_module.js').clientServerModule;

var msgs = 
{
    'END_GAME'      : 'end',
    'START_GAME'    : 'start',
    'JOIN'          : 'join',
    'TURN'          : 'turn',
    'OPPONENT_TURN' : 'op_turn',
    'NEW_FOOD'      : 'food',
    'PING'          : 'ping'
}

var params = 
{
    'PLAYER_NUM'    : 'pnum',
    'TIME'          : 'time',
    'DIR'           : 'dir',
    'COORDS'        : 'coords',
    'FAIL_PLAYERS'  : 'fail_players',
    'TICK'          : 'tick',
    'X'             : 'x',
    'Y'             : 'y'
}

clientServerModule({params: params, msgs: msgs}, typeof(exports) !== 'undefined' ? exports : 0)
