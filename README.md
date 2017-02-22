# Conway's Game of Life

Browser-based version of [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway's_Game_of_Life) using
the PhaserJS JavaScript game framework.

## Background

This demonstration is more for visualization and experimentation with the PhaserJS JavaScript
library. It is intended to be an implementation of Conway's Game of Life. The rules can be found
in the link under the main heading, but are in general as follows:

1. Any live cell with fewer than 2 neighbors dies, as if caused by underpopulation.
2. Any live cell with 2-3 live neighbors lives on to the next generation.
3. Any live cell with more than 3 neighbors dies, as if by overpopulation.
4. Any dead cell with exactly 3 neighbors becomes a live cell, as if by reproduction.

## How to Use

In order to launch the visualization, simply download/clone the repository to a location on your
local computer and then open the "index.html" file in a modern browser of your choice (Google
Chrome works well for this). You will then see Conway's Game of Life display and animate.

## Enhancements

This Game of Life has been updated/enhanced to represent dead cells in two follow-up colors - when
a cell is first killed, it will be represented in a darker red color. The following step will show
the dying cell in a lighter red color, at which point it will disappear in the next transition if
not resurrected by neighbors.
