"use strict";

// TODO:
// HUD properly
// Don't redraw everything each frame
// Enforce width/height better (and adapt to browser res (and zoom?))
// Add mines (randomly add every N apples)
// Improve graphics
// Add difficulty setting
// Add size setting
// Optional edges are death (no wrap)
// Add walls (levels)
// Add level editor
// Add sounds
// Add event animations
// Change to sprites
// Add gameover and press to (re)start
// Add pause (on focus loss)
// Make a generic 2D grid game engine!

const RIGHT = 39;
const DOWN = 40;
const LEFT = 37;
const UP = 38;

var INITIAL_TAIL_LENGTH = 4;

var snakeCanvas = null;
var ctx = null;
var DIFFICULTY = 10;
var tickMS = 1000 / DIFFICULTY;
var playAreaWidth = 10;
var playAreaHeight = 10;
// N.B. Top left square is [0,0]
var headCoord = null;
var appleCoord = null;
var currentDirection = RIGHT;
var tail = [];
var score;
var hiscore = 0;


var blockSize;

var canvasWidth;
var canvasHeight;

var playfieldCanvasXOffset;
var playfieldCanvasYOffset;
var playfieldCanvasWidth;
var playfieldCanvasHeight;

function initialize() {
    snakeCanvas = $("#snakeCanvas")[0];
    ctx = snakeCanvas.getContext("2d");
    canvasWidth = snakeCanvas.width;
    canvasHeight = snakeCanvas.height;

    setPlayfieldCanvas();

    document.onkeypress = function (e) {
        e = e || window.event;
        switch(e.keyCode) {
            case RIGHT:
                if (currentDirection == LEFT)
                    return;
                currentDirection = RIGHT;
                break;
            case LEFT:
                if (currentDirection == RIGHT)
                    return;
                currentDirection = LEFT;
                break;
            case UP:
                if (currentDirection == DOWN)
                    return;
                currentDirection = UP;
                break;
            case DOWN:
                if (currentDirection == UP)
                    return;
                currentDirection = DOWN;
                break;
        }
    };
    reset();
    tick();
}

function setPlayfieldCanvas() {
    // TODO: Determine dynamically
    var hudTop = 20;
    var hudLeft = 2;
    var hudRight = 2;
    var hudBottom = 2;

    var totalWidthAvailable = canvasWidth - (hudLeft + hudRight);
    var totalHeightAvailable = canvasHeight - (hudTop + hudBottom);

    // Ensure blocks are always square
    blockSize = Math.min(Math.floor(totalWidthAvailable / playAreaWidth), Math.floor(totalHeightAvailable / playAreaHeight));

    playfieldCanvasWidth = blockSize * playAreaWidth;
    playfieldCanvasHeight = blockSize * playAreaHeight;

    playfieldCanvasXOffset = hudLeft + Math.floor((totalWidthAvailable - playfieldCanvasWidth) / 2);
    playfieldCanvasYOffset = hudTop + Math.floor((totalHeightAvailable - playfieldCanvasHeight) / 2);
}

function handleResize(width, height) {
    // TODO
}

function resetSnake() {
    headCoord = [Math.floor(playAreaWidth / 2), Math.floor(playAreaHeight / 2)];
    currentDirection = RIGHT;
    tail = new Array(INITIAL_TAIL_LENGTH).fill().map(function(item, index, arr) {
        return headCoord.slice();
    });
}

function clearPlayfield() {
    ctx.beginPath();
    ctx.rect(playfieldCanvasXOffset, playfieldCanvasYOffset, playfieldCanvasWidth, playfieldCanvasHeight);
    ctx.fillStyle = "white";
    ctx.fill();
}

function renderChrome() {
    ctx.beginPath();
    ctx.rect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "blue";
    ctx.fill();
}

function renderHUD() {
    ctx.font="20px Georgia";
    ctx.fillText("Score: " + score + "    Hi-Score: " + hiscore, 10, 20);
}

function renderSquare(x, y, colour) {
    var x = playfieldCanvasXOffset + blockSize * x;
    var y = playfieldCanvasYOffset + blockSize * y;

    ctx.beginPath();
    ctx.rect(x, y, blockSize, blockSize);
    ctx.fillStyle = colour;
    ctx.fill();
}

function render() {
    clearPlayfield();
    for (var i in tail) {
        var tailCoord = tail[i]
        renderSquare(tailCoord[0], tailCoord[1], "black");
    }

    renderSquare(headCoord[0], headCoord[1], "black");
    renderSquare(appleCoord[0], appleCoord[1], "red");
    renderHUD();
}

function randomApple() {
    var badApple = true;
    while (badApple) {
        appleCoord = [Math.floor(Math.random() * playAreaWidth), Math.floor(Math.random() * playAreaHeight)];
        badApple = false;
        for (var i in tail) {
            var tailCoord = tail[i]
            if (appleCoord[0] == tailCoord[0] && appleCoord[1] == tailCoord[1]) {
                badApple = true;
                break;
            }
        }
        if (appleCoord[0] == headCoord[0] && appleCoord[1] == headCoord[1]) {
            badApple = true;
        }
    }
}

function moveSnake() {
    tail.shift();
    tail.push(headCoord)
    switch (currentDirection) {
        case RIGHT:
            headCoord = [headCoord[0] + 1, headCoord[1]]
            break;
        case DOWN:
            headCoord = [headCoord[0], headCoord[1] + 1]
            break;
        case LEFT:
            headCoord = [headCoord[0] - 1, headCoord[1]]
            break;
        case UP:
            headCoord = [headCoord[0], headCoord[1] - 1]
            break;
    }

    if (headCoord[0] < 0)
        headCoord[0] = playAreaWidth - 1;
    if (headCoord[0] >= playAreaWidth)
        headCoord[0] = 0;
    if (headCoord[1] < 0)
        headCoord[1] = playAreaHeight - 1;
    if (headCoord[1] >= playAreaHeight)
        headCoord[1] = 0;
}

function checkEat() {
    if (headCoord[0] == appleCoord[0] && headCoord[1] == appleCoord[1]) {
        randomApple();
        tail.unshift(tail[0]);
        score += DIFFICULTY;
    }
}

function checkDead() {
    for (var i in tail) {
        var tailCoord = tail[i]
        if (headCoord[0] == tailCoord[0] && headCoord[1] == tailCoord[1]) {
            hiscore = Math.max(score, hiscore);
            reset();
            return;
        }
    }
}

function reset() {
    clearPlayfield()
    resetSnake();
    randomApple();
    score = 0;
}

function tick() {
    window.setTimeout(tick, tickMS);
    moveSnake();
    checkEat();
    checkDead();
    renderChrome();
    renderHUD();
    render();

}

// function getRandomColor() {
//   var letters = '0123456789ABCDEF';
//   var color = '#';
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }

(function($) {
    $(document).ready(function() {
        initialize();
    });
})(jQuery);
