/*
* Objects 
*/

STATE_EMPTY=0;
STATE_PLAYER=1;
STATE_LIFE=2;


function component(width, height, color, x, y) {
    MAX_SPEED = 5;
    SPEED_INC = 0.1

    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.color = color;

    this.update = function(){	    
	ctx = GameArea.context;
	ctx.fillStyle = this.color;
	ctx.fillRect(this.x, this.y, this.width, this.height);
    };


}

function tile(width, height, color, x, y) {
    component.call(this, width, height, color, x, y);

    /*
      States:
      0 - Empty
      1 - Player
      2 - Life

    */
    this.state = STATE_EMPTY;

    this.updateState = function(){	
	switch(this.state) {
	case STATE_EMPTY:
	    this.color = 'grey';
            break;
	case STATE_PLAYER:
	    this.color = 'red';
            break;
	case STATE_LIFE:
	    this.color = 'pink';
            break;
	default:
	    break;
	}

	
    }
    
}

function Point(x,y){
    this.x = x;
    this.y = y;
}

function grid(width, height){
    // todo: parameter x,y
    X = 100;
    Y = 100;
    TILE_SIZE = 29;
    BORDER=1;
    
    playerPoint = new Point(-1,-1);
    playerIn = false;
        
    this.gridArray = [];
    for (i = 0; i < height; i++){
	this.gridArray.push( [] );
	for (j = 0; j < width; j++){
	    this.gridArray[i].push(
		new tile(TILE_SIZE,
			 TILE_SIZE,
			 "grey",
			 X + (BORDER*i + TILE_SIZE*i),
			 Y + (BORDER*j + TILE_SIZE*j)
			)
	    );
	}
    }

    this.playerEnter = function(x,y){
	this.gridArray[x][y].state = STATE_PLAYER;
	
	playerPoint.x = x;
	playerPoint.y = y;
    }

    this.update = function(){
	for (i = 0; i < width; i++){
	    for (j = 0; j < height; j++){
		this.gridArray[i][j].updateState();
		this.gridArray[i][j].update();
		
	    }
	}
    }

    this.randomPopulate = function(n){
	for (i = 0; i < n; i++){
	    x = Math.round(Math.random() * width) % width;
	    y = Math.round(Math.random() * height) % height;
	    this.gridArray[x][y].state = STATE_LIFE;
	}
    }
    
}


function player(width, height, color, x, y) {
    component.call(this, width, height, color, x, y);

    this.move = function() {
        this.x += this.speedX;
        this.y += this.speedY; 
    };

    this.moveUp = function() {
	if (this.speedY > -MAX_SPEED){
	    this.speedY -= SPEED_INC; 
	}	
    };

    this.moveDown = function() {
	if (this.speedY < MAX_SPEED){
	    this.speedY += SPEED_INC;
	}
    };

    this.moveLeft = function() {
	if (this.speedX > -MAX_SPEED){
	    this.speedX -= SPEED_INC;
	}
	
    };

    this.moveRight = function() {
	if (this.speedX < MAX_SPEED) {
	    this.speedX += SPEED_INC;
	}
    };
}


