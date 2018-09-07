/*
* Game logic and initialization
*/

function startGame() {
    GameArea.start();
    GamePiece = new freetile(BLOCK_SIZE, BLOCK_SIZE, "red", 10, 120);
    Grid = new grid(GRID_LENGTH, GRID_LENGTH);
    Grid.randomPopulate(GRID_LENGTH);
    Grid.initBorder();
    Grid.playerEnter(1,1);
    Grid.playerIn = true;
}


function updateGameArea() {
    GameArea.clear();   
    GamePiece.move();
    GamePiece.update();
    
    Grid.update();
    if (!Grid.playerIn) {
	if (GameArea.key && GameArea.key == 37) { GamePiece.moveLeft(); }
	if (GameArea.key && GameArea.key == 39) { GamePiece.moveRight(); }
	if (GameArea.key && GameArea.key == 38) { GamePiece.moveUp(); }
	if (GameArea.key && GameArea.key == 40) { GamePiece.moveDown(); }
    } else {
	if (GameArea.key && GameArea.key == 37) { Grid.moveLeft(); }
	if (GameArea.key && GameArea.key == 39) { Grid.moveRight(); }
	if (GameArea.key && GameArea.key == 38) { Grid.moveUp(); }
	if (GameArea.key && GameArea.key == 40) { Grid.moveDown(); }
    }
    
}

function setIntervalX(callback, delay, repetitions) {
    var x = 0;
    var intervalID = window.setInterval(function () {

       callback();

       if (++x === repetitions) {
           window.clearInterval(intervalID);
       }
    }, delay);
}

var GameArea =  {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 720;
        this.canvas.height = 720;	
	this.context = this.canvas.getContext("2d");
	this.context.fillStyle = "blue";
	this.context.fill();
	
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
	this.interval = setInterval(updateGameArea, 60);
	
	window.addEventListener('keydown', function (e) {
            GameArea.key = e.keyCode;
	})

	window.addEventListener('keyup', function (e) {
            GameArea.key = false;
	})
    },
    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.context.fillStyle = "blue";
	this.context.fill();
	
    }
}

//var GameArea = newGameArea();
