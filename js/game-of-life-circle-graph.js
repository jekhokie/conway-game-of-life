// configuration
const NUM_GRAPH_STEPS = 20;
const NUM_GRAPH_QUADRANTS = 20;
const GRAPH_SPACING = 30;
const GRAPH_LINE_WIDTH = 1;
const FRAME_RATE_PER_MINUTE = 360;

// useful constants/colors
const BLACK_HEX = 0x000000;
const BLUE_HEX = 0x0000FF;
const GRAY_HEX = 0xDDDDDD;
const GRAY = '#DDDDDD';

// canvas size based on cell sizing
var size = (NUM_GRAPH_STEPS * GRAPH_SPACING) + GRAPH_LINE_WIDTH;
var WIDTH = HEIGHT = size;
var centerX = WIDTH / 2;
var centerY = HEIGHT / 2;
var quadAngle = 360 / NUM_GRAPH_QUADRANTS;

// used for calculating frame rate and the end of the
// animation (stale state)
var timeElapsed = 0;
var endState = false;

// create grid of cells - each circle in the grid is divided into quadrants
// and the first position in the array rows is always in the same "column" on
// the graph, indicating a neighbor directly adjacent moving outwards from
// the middle
var cellGrid = [];
for (var i = 0; i < NUM_GRAPH_STEPS; i++) {
    cellGrid[i] = [];

    for (var j = 0; j < NUM_GRAPH_QUADRANTS; j++) {
        cellGrid[i][j] = 0;
    }
}

// sample seed
var randomX, randomY = 0;
for (var i = 0; i < (NUM_GRAPH_QUADRANTS * NUM_GRAPH_STEPS - 20); i++) {
    randomX = Math.floor(Math.random() * NUM_GRAPH_QUADRANTS)
    randomY = Math.floor(Math.random() * NUM_GRAPH_STEPS)
    cellGrid[randomX][randomY] = 1;
}

// entry into the program
window.onload = function() {
    // initialize the canvas
    game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'animation-canvas', { create: create, update: update });
}

// initialization and setup
function create() {
    // set the canvas background color
    game.stage.backgroundColor = GRAY;

    // set up the life grid
    genLifeGraph();
}

// update event loop to render the animation
function update() {
    // check whether we've arrived at an end state
    if (!endState) {
        timeElapsed += this.game.time.physicsElapsed;

        // keep true to frames per second/minute, and only if we're
        // not in a stale state
        var compare = (60 / FRAME_RATE_PER_MINUTE);
        if (timeElapsed > compare) {
            timeElapsed -= compare;
            updateCells();
        }
    }
}

// update the cells for alive/dead
function updateCells() {
    var newGrid = [];
    var count = 0;

    for (var i = 0; i < cellGrid.length; i++) {
        newGrid[i] = [];

        for (var j = 0; j < cellGrid[i].length; j++) {
            newGrid[i][j] = 0;

            // count the neighbors of the current cell
            cellGrid[i-1] && (cellGrid[i-1][j]   == 1) && count++;  // left
            cellGrid[i+1] && (cellGrid[i+1][j]   == 1) && count++;  // right
            cellGrid[i]   && (cellGrid[i][j-1]   == 1) && count++;  // up
            cellGrid[i]   && (cellGrid[i][j+1]   == 1) && count++;  // down
            cellGrid[i-1] && (cellGrid[i-1][j-1] == 1) && count++;  // upper-left
            cellGrid[i+1] && (cellGrid[i+1][j-1] == 1) && count++;  // upper-right
            cellGrid[i-1] && (cellGrid[i-1][j+1] == 1) && count++;  // lower-left
            cellGrid[i+1] && (cellGrid[i+1][j+1] == 1) && count++;  // lower-right

            // determine what to do with the new cell position
            // conditions are:
            //  1. Any live cell with < 2 neighbors dies.
            //  2. Any live cell with 2-3 live neighbors lives.
            //  3. Any live cell with > 3 neighbors dies.
            //  4. Any dead cell with exactly 3 neighbors becomes live.
            if (cellGrid[i][j] == 1) {
                if (count == 2 || count == 3) {
                    // cell lives on
                    newGrid[i][j] = 1;
                } else {
                    // dead cell representation 1
                    newGrid[i][j] = -1;
                }
            } else if (count == 3) {
                // new cell populated
                newGrid[i][j] = 1;
            } else if (cellGrid[i][j] == -1) {
                // dead cell representation 2
                newGrid[i][j] = -2;
            }

            count = 0;
        }
    }

    // check if we've reached a stale state
    if (cellGrid.toString() === newGrid.toString()) {
        console.log("Ending animation.");
        endState = true;
    } else {
        cellGrid = newGrid;
        genLifeGraph();
    }
}

// generate the life circle graph layout (quadrants)
function genLifeGraph() {
    // initialize the graphics object and line style for the graph, and ensure
    // any existing objects are removed to avoid memory over-consumption
    game.world.removeAll();
    var graphics = game.add.graphics(0, 0);
    graphics.lineStyle(GRAPH_LINE_WIDTH, BLACK_HEX, 1);

    // draw the grid on the screen
    for (var i = 0; i < cellGrid.length; i++) {
        // graph steps
        graphics.drawCircle(centerX, centerY, (i + 1) * GRAPH_SPACING);
    }

    // now, draw the number of quadrant lines
    var targetX, targetY, angle = 0;
    for (var i = 0; i < NUM_GRAPH_QUADRANTS; i++) {
        angle = (360 / NUM_GRAPH_QUADRANTS) * i;
        targetX = centerX + ((NUM_GRAPH_STEPS * GRAPH_SPACING) / 2) * (Math.cos(angle * (Math.PI / 180)));
        targetY = centerY + ((NUM_GRAPH_STEPS * GRAPH_SPACING) / 2) * (Math.sin(angle * (Math.PI / 180)));
        graphics.moveTo(centerX, centerY);
        graphics.lineTo(targetX, targetY);
    }

    // draw the cells
    graphics.lineStyle((GRAPH_SPACING / 2) - 1, BLUE_HEX);
    for (var i = 0; i < cellGrid.length; i++) {
        for (var j = 0; j < cellGrid[i].length; j++) {
            if (cellGrid[i][j] == 1) {
                graphics.arc(centerX,
                             centerY,
                             (GRAPH_SPACING / 2 * (i + 1) - (GRAPH_SPACING / 4 + 1)),
                             game.math.degToRad(j * quadAngle + 1),
                             game.math.degToRad((j * quadAngle) + quadAngle - 1),
                             false);
            }
        }
    }
}
