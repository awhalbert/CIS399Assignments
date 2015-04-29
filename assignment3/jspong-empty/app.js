"use strict";

var gamestage = new createjs.Stage("gamecanvas");
var checkCollision = function(object1, object2) {
	return !(
		object1.y + object1.spriteSheet._frameHeight < object2.y ||
		object1.y > object2.y + object2.spriteSheet._frameHeight ||
		object1.x > object2.x + object2.spriteSheet._frameWidth  ||
		object1.x + object1.spriteSheet._frameWidth < object2.x);
};

var Ball = function () {
	this.xMove = 2;
	this.yMove = 2;

	this.animations = new createjs.Sprite(new createjs.SpriteSheet({
		"images": ["ball.png"],
		"frames": {
			"width": 16,
			"height": 16,
			"count": 1
		},
		"animations": {
			"ball": {
				"frames": [0]
			}
		}
	}), "ball");

	this.checkWallCollisions = function () {
		if (this.animations.x < 0) {
			alert("Player 2 wins!");
			location.reload();
		} else if (this.animations.x + this.animations.spriteSheet._frameWidth > gamestage.canvas.width) {
			alert("Player 1 wins!");
			location.reload();
		} else if (this.animations.y + this.animations.spriteSheet._frameHeight > gamestage.canvas.height) {
			this.yMove *= -1;
		} else if (this.animations.y < 0) {
			this.yMove *= -1;
		}
		for (var i = 0; i < paddles.length; i++) {
			if (checkCollision(this.animations, paddles[i].animations)) this.xMove *= -1;
		}
	};

	this.updatePosition = function () {
		this.animations.x += this.xMove;
		this.animations.y += this.yMove;
	};

	this.animations.x = Math.round(Math.random() * gamestage.canvas.width);
	this.animations.y = Math.round(Math.random() * gamestage.canvas.height);
	if (this.animations.x + this.animations.spriteSheet._frameWidth > gamestage.canvas.width) this.animations.x -= this.animations.spriteSheet._frameWidth;
	if (this.animations.y + this.animations.spriteSheet._frameHeight > gamestage.canvas.height) this.animations.y -= this.animations.spriteSheet._frameHeight;
	gamestage.addChild(this.animations);
};



var Paddle = function (player) {
	this.move = 2;

	this.animations = new createjs.Sprite(new createjs.SpriteSheet({
		"images": ["paddle.png"],
		"frames": {
			"width": 8,
			"height": 32,
			"count": 1
		},
		"animations": {
			"paddle": {
				"frames": [0]
			}
		}
	}), "paddle");

	this.width = this.animations.spriteSheet._frameWidth;
	this.height = this.animations.spriteSheet._frameHeight;


	this.keyDown = function (evt) {
		if (evt.keyCode === 40) { // down arrow
			this.downwardMovement = true;
			this.upwardMovement = false;
		}
		else if (evt.keyCode === 38) {
			this.downwardMovement = false;
			this.upwardMovement = true;
		}
	};

	this.keyUp = function (evt) {
		if (evt.keyCode === 40) { // down arrow
			this.downwardMovement = false;
		}
		else if (evt.keyCode === 38) { // up arrow
			this.upwardMovement = false;
		}
	};

	this.mouseHandler = function (evt) {
		if (this.inBounds()) this.animations.y = this.getPosFromMouse(evt.clientY);
		else {
			if (this.animations.y > gamestage.canvas.height - this.height)
				this.animations.y = gamestage.canvas.height - this.height;
			else if (this.animations.y < 0)
				this.animations.y = 0;
		}
	};

	this.getPosFromMouse = function (y) {
		return Math.round((y/window.innerHeight)*gamestage.canvas.height);
	};

	this.updatePosition = function () {
		if (this.inBounds()) {
			if (this.downwardMovement) this.animations.y += this.move;
			if (this.upwardMovement) this.animations.y -= this.move;
		}
		else {
			if (this.animations.y > gamestage.canvas.height - this.height)
				this.animations.y = gamestage.canvas.height - this.height;
			if (this.animations.y < 0)
				this.animations.y = 0;
		}

	};

	this.inBounds = function () {
		return (!(this.animations.y < 0 ||
			this.animations.y > gamestage.canvas.height - this.height));
	};
	if (player === 1) this.animations.x = 10;
	else if (player === 2) this.animations.x = gamestage.canvas.width - this.width - 10;
	this.animations.y = 32;
	gamestage.addChild(this.animations);
};

var PongGame = function () {
	this.frameTick = function() {
		
		leftPaddle.updatePosition();
		
		for (var i = 0; i < balls.length; i++) {
			balls[i].checkWallCollisions();
			balls[i].updatePosition();
		}
		gamestage.update();
	};
	createjs.Ticker.addEventListener("tick", this.frameTick);
	createjs.Ticker.setFPS(60);
};

var balls = [];
for (var i = 0; i < 1; i++) {
	balls[i] = new Ball();
};

var leftPaddle = new Paddle(1);
var rightPaddle = new Paddle(2);
var paddles = [leftPaddle, rightPaddle];
	
// var leftPaddle = new Paddle(10, 32);
// var rightPaddle = new Paddle(gamestage.canvas.width-10, 32);

document.onkeydown = function(evt) {
	leftPaddle.keyDown(evt);
};

document.onkeyup = function(evt) {
	leftPaddle.keyUp(evt);
};

document.onmousemove = function(evt) {
	rightPaddle.mouseHandler(evt);
};

var game = new PongGame();
