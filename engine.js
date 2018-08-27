/*
* Game logic and initialization
*/

function startGame() {
    GameArea.start();
    GamePiece = new player(30, 30, "red", 10, 120);
    Grid = new grid(20,20);
    Grid.randomPopulate(100);
}


function updateGameArea() {
    GameArea.clear();   
    GamePiece.move();
    GamePiece.update();

    Grid.update()

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

var GameArea =  {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1000;
        this.canvas.height = 1000;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
	this.interval = setInterval(updateGameArea, 10);
	
	window.addEventListener('keydown', function (e) {
            GameArea.key = e.keyCode;
	})

	window.addEventListener('keyup', function (e) {
            GameArea.key = false;
	})
    },
    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

//var GameArea = newGameArea();
