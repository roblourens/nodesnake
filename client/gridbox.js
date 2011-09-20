/*  gridbox.js
 *
 *  represents a box on the game grid 
 *
 *  Dependencies:
 *      ../shared/config.js
 */

function Gridbox(_x, _y) {
    /* x coord of this box */
    var x = _x;

    /* y coord of this box */
    var y = _y;

    return {
        /* returns true iff the given gridbox has coords equaling this */
        equals: function(gb) {
            if (x !== gb.x())
                return false;
            else if (y !== gb.y())
                return false;
            else
                return true;
        },

        /* fills this gridbox. the fill color must be set before calling */
        draw: function(ctx) {
            ctx.fillRect(x*(config.GRID_SIZE + config.GRID_PAD) + config.GRID_PAD, 
                         y*(config.GRID_SIZE + config.GRID_PAD) + config.GRID_PAD, 
                         config.GRID_SIZE, 
                         config.GRID_SIZE);
        },

        x: function() {
            return x;
        },

        y: function() {
            return y;
        },

        setX: function(newX) {
            x = newX;
        },

        setY: function(newY) {
            y = newY;
        }
    }
}

function Foodbox(_x, _y) {
    /* parent gridbox */
    var gb = new Gridbox(_x, _y);

    var color = config.FOOD_COLOR;

    return {
        draw: function(ctx) {
            ctx.fillStyle = color;
            gb.draw(ctx);
        },

        equals: function(fb) {
            return gb.equals(fb);
        },

        x: function() {
            return gb.x();
        },

        y: function() {
            return gb.y();
        },

        setX: function(newX) {
            gb.setX(newX);
        },

        setY: function(newY) {
            gb.setY(newY);
        }
    }
}
