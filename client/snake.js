/*  snake.js
 *  
 *  Client-side snake game logic
 *
 *  Dependencies:
 *      ./gridbox.js
 *      ../shared/config.js
 */

/* x, y is the head */
/* a snake a snake, oh, it's a snake... */
function Snake(x, y, color, game) {
    /* the current direction moving: 'r', 'l', 'u', 'd' */
    this.dir = 'r';

    /* an array of Gridboxes representing each point on the body, from tail to head */
    this.body = new Array(new Gridbox(x-3, y),
                          new Gridbox(x-2, y),
                          new Gridbox(x-1, y),
                          new Gridbox(x, y));
    
    /* pointer to the gridbox object which is the head */
    this.head = this.body[this.body.length-1];

    /* the color the snake will be drawn, e.g. 'rgb(255, 0, 0)' */
    this.color = color;

    /* this snake players' score */
    this.score = 0;

    /* the game environment */
    this.game = game;
}

/* update the snake state */
Snake.prototype.update = function() {
    // The change in this snake's score while updating this turn
    var scoreDelta = 0;

    var newHead;
    switch (this.dir) {
        case 'l':
            newHead = new Gridbox(this.head.x()-1, this.head.y());
            break;
        case 'r':
            newHead = new Gridbox(this.head.x()+1, this.head.y());
            break;
        case 'u':
            newHead = new Gridbox(this.head.x(), this.head.y()-1);
            break;
        case 'd':
            newHead = new Gridbox(this.head.x(), this.head.y()+1);
            break;
    }
    this.body.push(newHead);
    this.head = newHead;

    // remove tail unless the new head is on the food
    var food = this.game.food();
    if (!food)
        this.body.shift();
    else if (food && !this.gotFood(food))
        this.body.shift();
    else {
        scoreDelta += config.SCORE_DELTA;
        console.log('a snake got food')
    }

    this.score += scoreDelta;
}

/* draw the snake on the context */
Snake.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color;
    this.body.forEach(function (gb) {
        gb.draw(ctx);
    });
}

/* returns true if the snake is on top of the given gridbox point */
Snake.prototype.coversPoint = function(gb) {
    for (var i=0; i<this.body.length; i++)
        if (gb.equals(this.body[i]))
            return true;

    return false;
}

/* returns true if this snake got the food */
Snake.prototype.gotFood = function(food) {
    return food.equals(this.head);
}

/* turns the snake to the specified direction, if applicable. 
 * Returns true if the turn actually happened */
Snake.prototype.doTurn = function(dir) {
    var second = this.body[this.body.length-2];
    if ((dir == 'l' && !(this.head.x() > second.x())) ||
        (dir == 'u' && !(this.head.y() > second.y())) ||
        (dir == 'r' && !(this.head.x() < second.x())) ||
        (dir == 'd' && !(this.head.y() < second.y()))) {
        this.dir = dir;
        return true;
    }
    else
        return false;
}

/* Adjusts the snake body to the given coords.
   Useful for compensating for lag */
Snake.prototype.compensate = function(coords, tick) {
    var dx = coords[0]-this.head.x();
    var dy = coords[1]-this.head.y();

    for (var i=0; i<this.body.length; i++) {
        this.body[i].setX(this.body[i].x() + dx);
        this.body[i].setY(this.body[i].y() + dy);
    }

    for (var i=0; i<this.game.curTick()-tick; i++) {
        this.update();
    }
}

/*  returns true if this snake has collided with a wall, if the snake's head has 
 *  collided with another's body, or if the snake has collided with itself. If this
 *  returns true for a snake, that snake loses. If it returns true for multiple snakes
 *  within a cycle, those snakes tie/lose.  */
Snake.prototype.hasCollided = function(snakes) {
    // check walls
    if (this.head.x() < 0 || this.head.x() >= config.XSIZE)
        return true;
    else if (this.head.y() < 0 || this.head.y() >= config.YSIZE)
        return true;
    // check snakes
    else 
        for (var i in snakes) {
            var othersnake = snakes[i];
            for (var k=0; k<othersnake.body.length; k++)
                // ensure that this head and the other snake's head are not the same object
                if (this.head.equals(othersnake.body[k]) && this.head != othersnake.body[k])
                    return true;
        }

    return false;
}
