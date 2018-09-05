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

    this.die = function(){
	this.state = STATE_EMPTY;
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
    moveCooldown = 0.0;
    
    this.gridArray = [];
    for (i = 0; i < height; i++){
	this.gridArray.push( [] );
	for (j = 0; j < width; j++){
	    this.gridArray[i].push(new tile(TILE_SIZE,
					    TILE_SIZE,
					    "grey",
					    X + (BORDER*i + TILE_SIZE*i),
					    Y + (BORDER*j + TILE_SIZE*j)
					   ));
	}
    }

    this.playerEnter = function(x,y){
	this.gridArray[x][y].state = STATE_PLAYER;
	
	playerPoint.x = x;
	playerPoint.y = y;
    }


    this.getNeighbours = function(x,y) {
	listOfPoints = [];
	for(i = -1; i < 2; i++) {
	    for(j = -1; j < 2; j++) {
		if (!(i == 0 && j == 0)) {
		    dx = x + i;
		    dy = y + j;
		    if (dx < width && dx >= 0 &&
			dy < height && dy >= 0) {
			if (this.gridArray[dx][dy].state == STATE_LIFE ||
			   this.gridArray[dx][dy].state == STATE_PLAYER ){
			    //console.log("Pushing " + i + " " + j );
			    listOfPoints.push(new Point(dx,dy));
			}
		    }
		}
	    }
	}
	return listOfPoints;
    }


    this.getEmptyPoint = function(x,y) {
	point = new Point(-1,-1);
	for(i = -1; i < 2; i++) {
	    for(j = -1; j < 2; j++) {
		if (!(i == 0 && j == 0)) {
		    dx = x + i;
		    dy = y + j;
		    if (dx < width && dx >= 0 &&
			dy < height && dy >= 0) {			
			if (this.gridArray[dx][dy].state == STATE_EMPTY){
			    point = new Point(dx,dy);
			    return point;
			}
		    }
		}
	    }
	}
	return point;
    }
    
    this.checkGrid = function(i,j) {
	if ( this.gridArray[i][j].state == STATE_LIFE ){
	    neighbours = [];
	    neighbours = this.getNeighbours(i,j);
	    if (neighbours.length > 3 || neighbours.length < 2){
		console.log("Killed " + i + " " + j);
		this.gridArray[i][j].die();
	    } else {
	    	emptyPoint = this.getEmptyPoint(i,j);
		if (emptyPoint.x == -1){
		    console.log("No space!!!");
		} else {
		    console.log("Spawned new life at " + i + " " + j);
		    this.gridArray[emptyPoint.x][emptyPoint.y].state = STATE_LIFE;
		}
	    }
	}
    }
    
    this.update = function() {
	for (i = 0; i < width; i++) {
	    for (j = 0; j < height; j++) {		
		this.gridArray[i][j].updateState();
		this.gridArray[i][j].update();
	    }
	}
    }

    this.randomPopulate = function(n) {
	for (i = 0; i < n; i++) {
	    x = Math.round(Math.random() * width) % width;
	    y = Math.round(Math.random() * height) % height;
	    this.gridArray[x][y].state = STATE_LIFE;
	}
    }

    this.move = function(dx,dy) {
	if (moveCooldown <= 0.0 &&
	    this.gridArray[playerPoint.x + dx][playerPoint.y + dy].state == STATE_EMPTY ) {
	    
	    this.gridArray[playerPoint.x][playerPoint.y].state = STATE_EMPTY;	
	    playerPoint.x = playerPoint.x + dx;
	    playerPoint.y = playerPoint.y + dy;
	    this.gridArray[playerPoint.x][playerPoint.y].state = STATE_PLAYER;

	    /*
	    for (i = 0; i < width - 1; i++) {
		for (j = 0; j < height - 1; j++) {
		    this.checkGrid(i,j);
		}
	    }
	    */

	    for(i = -1; i < 2; i++) {
		for(j = -1; j < 2; j++) {
		    if (!(i == 0 && j == 0)) {
			dx = playerPoint.x + i;
			dy = playerPoint.y + j;
			if (dx < width && dx >= 0 &&
			    dy < height && dy >= 0) {
			    this.checkGrid(playerPoint.x+i,
					   playerPoint.y+j);
			}
		    }
		}
	    }
	    
	    moveCooldown = 0.0; // 1.0;	  
	} else {
	    moveCooldown -= 0.1;
	}


    }

    this.moveUp = function() {
	if (playerPoint.y > 0) this.move(0,-1);
    };

    this.moveDown = function() {
	if (playerPoint.y < height-1) this.move(0,1);
    };

    this.moveLeft = function() {
	if (playerPoint.x > 0) this.move(-1,0);
    };

    this.moveRight = function() {
	if (playerPoint.x < width-1) this.move(1,0);
    };
    
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


