"use strict";

// Use top left square is [0,0]

const RIGHT = 39;
const DOWN = 40;
const LEFT = 37;
const UP = 38;

var INITIAL_TAIL_LENGTH = 40;

var snakeCanvas = null;
var ctx = null;
var DIFFICULTY = 20;
var tickMS = 1000 / DIFFICULTY; // 30 FPS
var playAreaWidth = 40;
var playAreaHeight = 40;
var headCoord = null;
var appleCoord = null;
var currentDirection = RIGHT;
var tail = [];

var blockWidth;
var blockHeight;

var canvasX = 0;
var canvasY = 0;
var canvasWidth;
var canvasHeight;

function initialize() {
    snakeCanvas = $("#snakeCanvas")[0];
    ctx = snakeCanvas.getContext("2d");
    canvasWidth = snakeCanvas.width;
    canvasHeight = snakeCanvas.height;

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

function handleResize(width, height) {
    blockSize = canvasWidth / playAreaWidth
}

function resetSnake() {
    headCoord = [Math.floor(playAreaWidth / 2), Math.floor(playAreaHeight / 2)];
    currentDirection = RIGHT;
    tail = new Array(INITIAL_TAIL_LENGTH).fill().map(function(item, index, arr) {
        return headCoord.slice();
    });
}

function clearScreen() {
    ctx.beginPath();
    ctx.rect(canvasX, canvasY, canvasWidth, canvasHeight);
    ctx.fillStyle = "white";
    ctx.fill();
}

function renderSquare(x, y, colour) {
    var x = blockWidth * x;
    var y = blockHeight * y;

    ctx.beginPath();
    ctx.rect(x, y, blockWidth, blockHeight);
    ctx.fillStyle = colour;
    ctx.fill();
}

function render() {
    clearScreen();
    for (var i in tail) {
        var tailCoord = tail[i]
        renderSquare(tailCoord[0], tailCoord[1], "black");
    }

    renderSquare(headCoord[0], headCoord[1], "black");
    renderSquare(appleCoord[0], appleCoord[1], "red");
}

    console.log(headCoord);

function randomApple() {
    appleCoord = [Math.floor(Math.random() * playAreaWidth), Math.floor(Math.random() * playAreaHeight)];
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
    }
}

function checkDead() {
    for (var i in tail) {
        var tailCoord = tail[i]
        if (headCoord[0] == tailCoord[0] && headCoord[1] == tailCoord[1]) {
            reset();
            return;
        }
    }
}

function reset() {
    blockWidth = canvasWidth / playAreaWidth;
    blockHeight = canvasHeight / playAreaHeight;
    clearScreen()
    resetSnake();
    randomApple();
}

function tick() {
    window.setTimeout(tick, tickMS);
    moveSnake();
    checkEat();
    checkDead();
    render();
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function test(fillStyle) {
    var ctx = snakeCanvas.getContext("2d");
    // ctx.moveTo(0, 0);
    // ctx.lineTo(200, 100);
    // ctx.stroke();

    ctx.beginPath();
    ctx.rect(0, 0, 1000, 1000);
    ctx.fillStyle = "black";
    ctx.fill();

    ctx.beginPath();
    ctx.rect(10, 10, 1000 - 20, 1000 - 20);
    ctx.fillStyle = fillStyle;
    ctx.fill();
}

(function($) {
    $(document).ready(function() {
        initialize();
    });
})(jQuery);
