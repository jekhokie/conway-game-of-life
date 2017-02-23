// configuration
const GRID_WIDTH = 30;
const GRID_HEIGHT = 30;
const CELL_WIDTH = 20;
const CELL_HEIGHT = 20;
const GRID_LINE_WIDTH = 1;
const FRAME_RATE_PER_MINUTE = 360;

// useful constants/colors
const BLACK_HEX = 0x000000;
const BLUE_HEX = 0x0000FF;
const RED_HEX = 0xFF0000;
const GRAY_HEX = 0xDDDDDD;
const GRAY = '#DDDDDD';

// canvas size based on cell sizing
var WIDTH = (GRID_WIDTH * CELL_WIDTH + GRID_LINE_WIDTH);
var HEIGHT = (GRID_HEIGHT * CELL_HEIGHT + GRID_LINE_WIDTH);

// used for calculating frame rate and the end of the
// animation (stale state)
var timeElapsed = 0;
var endState = false;

// create grid of cells
var cellGrid = [];
for (var i = 0; i < GRID_HEIGHT; i++) {
    cellGrid[i] = [];

    for (var j = 0; j < GRID_WIDTH; j++) {
        cellGrid[i][j] = 0;
    }
}

// random seed for the game kick-off (roughly in the middle of the grid)
var middleX = Math.floor(GRID_WIDTH / 2);
var middleY = Math.floor(GRID_HEIGHT / 2);
var seedCells = [
    [ (middleX - 10), (middleY - 3) ],
    [ (middleX - 11), (middleY - 3) ],
    [ (middleX - 11), (middleY - 4) ],
    [ (middleX - 11), (middleY - 5) ],
    [ (middleX - 12), (middleY - 3) ],
    [ (middleX - 12), (middleY - 4) ],
    [ (middleX - 13), (middleY - 3) ],
    [ (middleX - 2),  middleY       ],
    [ (middleX - 1),  (middleY + 1) ],
    [ middleX,        (middleY + 2) ],
    [ (middleX + 1),  (middleY + 1) ],
    [ (middleX + 2),  middleY       ],
    [ middleX,        (middleY - 2) ],
    [ middleX,        (middleY - 3) ],
    [ middleX,        (middleY - 4) ],
    [ (middleX + 10), (middleY + 3) ],
    [ (middleX + 11), (middleY + 3) ],
    [ (middleX + 11), (middleY + 4) ],
    [ (middleX + 11), (middleY + 5) ],
    [ (middleX + 12), (middleY + 3) ],
    [ (middleX + 12), (middleY + 4) ],
    [ (middleX + 13), (middleY + 3) ],

];
for (var i = 0; i < seedCells.length; i++) {
    cellGrid[seedCells[i][0]][seedCells[i][1]] = 1;
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
    genLifeGrid();
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

            // count the neighbors of the current cell, starting
            // in upper left and moving clockwise
            cellGrid[i-1] && (cellGrid[i-1][j-1] == 1) && count++;  // up, left
            cellGrid[i]   && (cellGrid[i][j-1]   == 1) && count++;  // up
            cellGrid[i+1] && (cellGrid[i+1][j-1] == 1) && count++;  // up, right
            cellGrid[i+1] && (cellGrid[i+1][j]   == 1) && count++;  // right
            cellGrid[i+1] && (cellGrid[i+1][j+1] == 1) && count++;  // down, right
            cellGrid[i]   && (cellGrid[i][j+1]   == 1) && count++;  // down
            cellGrid[i-1] && (cellGrid[i-1][j+1] == 1) && count++;  // down, left
            cellGrid[i-1] && (cellGrid[i-1][j]   == 1) && count++;  // left

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
        genLifeGrid();
    }
}

// generate the life grid layout (quadrants)
function genLifeGrid() {
    // initialize the graphics object and line style for the grid, and ensure
    // any existing objects are removed to avoid memory over-consumption
    game.world.removeAll();
    var graphics = game.add.graphics(0, 0);
    graphics.lineStyle(GRID_LINE_WIDTH, BLACK_HEX, 1);

    // draw the grid on the screen, along with the live cells
    for (var i = 0; i < cellGrid.length; i++) {
        for (var j = 0; j < cellGrid[i].length; j++) {
            // handle color and transparency
            switch(cellGrid[i][j]) {
                // mostly dead cell
                case -2:
                    graphics.beginFill(RED_HEX, 0.2)
                    break;
                // dying cell
                case -1:
                    graphics.beginFill(RED_HEX, 0.5)
                    break;
                // live cell
                case 1:
                    graphics.beginFill(BLUE_HEX, 1)
                    break;
                // default is blank/empty (filled with grid color)
                default:
                    graphics.beginFill(GRAY_HEX, 1);
            }
            graphics.drawRect(i * CELL_WIDTH,
                              j * CELL_HEIGHT,
                              CELL_WIDTH,
                              CELL_HEIGHT);
            graphics.endFill();
        }
    }
}
