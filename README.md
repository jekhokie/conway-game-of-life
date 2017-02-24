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

There are several implementations of the Game of Life, including the traditional 2-D square graph
and a more enhanced/complicated circle-graph implementation.

## How to Use

In order to launch the visualization, simply download/clone the repository to a location on your
local computer and then open the "index.html" file in a modern browser of your choice (Google
Chrome works well for this). From the options listed, select one of the Game of Life animations
you wish to view, and the Game of Life should then animate automatically on your screen.
