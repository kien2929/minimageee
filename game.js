var canvas = document.getElementById('game');
var score = document.getElementById('score');
var notif = document.getElementById('status');
var context = canvas.getContext('2d');
var leftKeycode = 37;
var rightKeycode = 39;
var spaceKeycode = 32;

var color = ['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabebe', '#469990', '#e6beff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#a9a9a9'];
var pad = {
    width: 70,
    height: 10,
    x: canvas.width / 2 - 35,
    y: canvas.height - 10,
    speed: 15,
    isMovingLeft: false,
    isMovingRight: false
}
var ball = {
    x: pad.x + pad.width / 2,
    y: pad.y - 10,
    radius: 10,
    dx: 6,
    dy: 3,
    isMoving: false
}

var BrickConfig = {
    offsetx: canvas.width * 5 / 100,
    offsety: 25,
    margin: canvas.width * 5 / 100,
    height: 15,
    width: canvas.width * 14 / 100,
    row: 4,
    col: 5
}
var BrickList = [];
for (var i = 0; i < BrickConfig.row; i++) {
    for (var j = 0; j < BrickConfig.col; j++) {
        // var a = Math.floor(Math.random() * color.length);
        BrickList.push({
            x: BrickConfig.offsetx + j * (BrickConfig.width + BrickConfig.margin),
            y: BrickConfig.offsety + i * (BrickConfig.height + BrickConfig.margin),
            isBroken: false,
            color: color[0]
        });
        color.splice(0, 1);
    }
}

var isGameOver = false;
var isGameWin = false;
var userScore = 0;
var maxScore = BrickConfig.col * BrickConfig.row;

document.addEventListener('keyup', function (event) {
    if (event.keyCode == leftKeycode) {
        pad.isMovingLeft = false;
    } else if (event.keyCode == rightKeycode) {
        pad.isMovingRight = false;
    }
})


document.addEventListener('keydown', function (event) {
    if (event.keyCode == leftKeycode) {
        pad.isMovingLeft = true;
    } else if (event.keyCode == rightKeycode) {
        pad.isMovingRight = true;
    } else if (event.keyCode == spaceKeycode) {
        ball.isMoving = true;
        if (isGameOver) { window.location.reload(false); }
    }
})

document.getElementById("begin").onclick = function () {
    ball.isMoving = true;
    if (isGameOver) { window.location.reload(false); }
};


document.getElementById("left").ontouchstart = function () {
    pad.isMovingLeft = true;
};
document.getElementById("left").ontouchend = function () {
    pad.isMovingLeft = false;
};
document.getElementById("right").ontouchstart = function () {
    pad.isMovingRight = true;
};
document.getElementById("right").ontouchend = function () {
    pad.isMovingRight = false;
};



function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = 'red';
    context.fill();
    context.closePath();
}
function drawPad() {
    context.beginPath();
    context.rect(pad.x, pad.y, pad.width, pad.height);
    context.fillStyle = 'blue';
    context.fill();
    context.closePath();
}

function handleBallBound() {
    if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) {
        ball.dx = -ball.dx;
    }
    if (ball.y < ball.radius || ball.y > canvas.height - ball.radius) {
        ball.dy = -ball.dy;
    }
}
function handleBallPad() {
    if (ball.x + ball.radius >= pad.x && ball.x + ball.radius <= pad.x + pad.width
        && ball.y + ball.radius >= canvas.height - pad.height) {
        ball.dy = -ball.dy;
    }
}
function updateBallPosition() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function handleBallBrick() {
    BrickList.forEach(function (b) {
        if (!b.isBroken) {
            if (ball.x >= b.x && ball.x <= b.x + BrickConfig.width &&
                ball.y + ball.radius >= b.y && ball.y - ball.radius <= b.y + BrickConfig.height) {
                ball.dy = -ball.dy;
                b.isBroken = true;
                userScore += 1;
                if (userScore >= maxScore) {
                    isGameOver = true;
                    isGameWin = true;
                }
            }

        }
    })
}

function updatePadPosition() {
    if (!ball.isMoving) {
        if (pad.isMovingLeft) {
            ball.x -= pad.speed;
        } else if (pad.isMovingRight) {
            ball.x += pad.speed;
        }
        if (ball.x < pad.width / 2) { ball.x = pad.width / 2 } else if (ball.x > canvas.width - pad.width / 2) { ball.x = canvas.width - pad.width / 2 }
    }
    if (pad.isMovingLeft) {
        pad.x -= pad.speed;
    } else if (pad.isMovingRight) {
        pad.x += pad.speed;
    }
    if (pad.x < 0) { pad.x = 0 } else if (pad.x > canvas.width - pad.width) { pad.x = canvas.width - pad.width }
}
function checkGameOver() {
    if (ball.y > canvas.height - ball.radius) {
        isGameOver = true;
    }
}
function handleGameOver() {
    if (isGameWin) {
        notif.innerHTML = 'YOU WIN';
        document.getElementById('status-small').innerHTML = 'YOU WIN !!!';
    } else {
        notif.innerHTML = 'YOU LOSE';
        document.getElementById('status-small').innerHTML = 'YOU LOSE !!!';
    }
}

function drawBrick() {
    BrickList.forEach(function (b) {
        if (!b.isBroken) {
            context.beginPath();
            context.rect(b.x, b.y, BrickConfig.width, BrickConfig.height);
            context.fillStyle = b.color;
            context.fill();
            context.closePath();
        }
    })

}
function startBall() {
    if (!ball.isMoving) {
        ball.dx = 0;
        ball.dy = 0
    }
    else {
        if (ball.dx == 0) {
            ball.dx = 6;
            ball.dy = 3;
        }
    }
}
function updateScore() {
    score.innerHTML = `${userScore}`;
    document.getElementById('score-small').innerHTML = `${userScore}`;
}
////////////////////////////
var time_stamp = 0; // Or Date.now()
window.addEventListener("touchstart", function (event) {
    if (event.timeStamp - time_stamp < 300) { // A tap that occurs less than 300 ms from the last tap will trigger a double tap. This delay may be different between browsers.
        event.preventDefault();
        return false;
    }
    time_stamp = event.timeStamp;
});

function draw() {

    if (!isGameOver) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        drawBall();
        drawPad();
        drawBrick();
        startBall();
        ///
        
        handleBallBound();
        handleBallPad();
        handleBallBrick();

        updateScore();
        updatePadPosition();
        updateBallPosition();
        checkGameOver();
        requestAnimationFrame(draw);
        ///
    } else {
        handleGameOver();
    }

}
draw();