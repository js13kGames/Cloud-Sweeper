/*
* Objects 
*/

STATE_EMPTY=0;
STATE_PLAYER=1;
STATE_LIFE=2;
STATE_EXIT=3;

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

    this.move = function() {
	//Nothing
    }; 
    
    this.update = function(){
	this.move();
	
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
	case STATE_EXIT:
	    this.color = 'brown';
            break;
	default:
	    break;
	}
    }

    this.die = function(){
	this.state = STATE_EMPTY;
    }

    this.spawn = function(){
	this.state = STATE_LIFE;		
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

    this.escapedList = [];
    this.gridArray = [];
    for ( var i = 0; i < height; i++){
	this.gridArray.push( [] );
	for ( var j = 0; j < width; j++){
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
	var listOfPoints = [];
	for(var i = -1; i < 2; i++) {
	    for(var j = -1; j < 2; j++) {
		if (!(i == 0 && j == 0)) {
		    var dx = x + i;
		    var dy = y + j;
		    if (dx < width && dx >= 0 &&
			dy < height && dy >= 0) {
			if (this.gridArray[dx][dy].state == STATE_LIFE ||
			   this.gridArray[dx][dy].state == STATE_PLAYER ){
			    listOfPoints.push(new Point(dx,dy));
			}
		    }
		}
	    }
	}
	return listOfPoints;
    }


    this.getEmptyPoint = function(x,y) {
	var point = new Point(-1,-1);
	for ( var i = -1; i < 2; i++) {
	    for ( var j = -1; j < 2; j++) {
		if (!(i == 0 && j == 0)) {
		    var dx = x + i;
		    var dy = y + j;
		    if (dx < width && dx >= 0 &&
			dy < height && dy >= 0) {			
			if (this.gridArray[dx][dy].state == STATE_EMPTY ||
			    this.gridArray[dx][dy].state == STATE_EXIT ){
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
	    var neighbours = [];
	    neighbours = this.getNeighbours(i,j);
	    if (neighbours.length > 3 || neighbours.length < 2){
		console.log("Killed " + i + " " + j);
		this.gridArray[i][j].die();
	    } else {
	    	var emptyPoint = this.getEmptyPoint(i,j);
		if (emptyPoint.x == -1){
		    console.log("No space!!!");
		} else {
		    if (this.gridArray[emptyPoint.x][emptyPoint.y].state == STATE_EXIT) {
			this.gridArray[i][j].die();

			var cx = this.gridArray[emptyPoint.x][emptyPoint.y].x;
			var cy = this.gridArray[emptyPoint.x][emptyPoint.y].y;
			
			var escaped = null;
			console.log("Escaped! at: x:" + cx + " : " + cy ) ;
			escaped = new freetile(30, 30, "pink", cx, cy);
			if (emptyPoint.x < width/2) {	    
			    escaped.speedX = -10;			    
			}

			if (emptyPoint.x > width/2) {
			    escaped.speedX = 10;
			}

			if (emptyPoint.y < height/2) {
			    escaped.speedY = -10;
			}

			if (emptyPoint.y > height/2) {
			    escaped.speedY = 10;
			}

			this.escapedList.push( escaped );
			
		    }  else {
			console.log("Spawned new life at " + i + " " + j);
			this.gridArray[emptyPoint.x][emptyPoint.y].spawn();

		    }
		}
	    }
	}
    }
    
    this.update = function() {
	for (var i = 0; i < width; i++) {
	    for (var j = 0; j < height; j++) {		
		this.gridArray[i][j].updateState();
		this.gridArray[i][j].update();
	    }
	}
	for (var i = 0; i < this.escapedList.length; i++){
	    this.escapedList[i].update()
	}
    }

    this.randomPopulate = function(n) {
	for ( var i = 0; i < n; i++) {
	    x = Math.round(Math.random() * width) % width;
	    y = Math.round(Math.random() * height) % height;
	    this.gridArray[x][y].state = STATE_LIFE;
	}
    }

    this.initBorder = function(){
	for ( var i = 0; i < width; i++) {
	    this.gridArray[i][0].state = STATE_EXIT;
	    this.gridArray[i][height - 1].state = STATE_EXIT;
	}
	for ( var j = 0; j < height; j++) {
	    this.gridArray[0][j].state = STATE_EXIT;
	    this.gridArray[width-1][j].state = STATE_EXIT;
	}
    }

    this.move = function(dx,dy) {
	if (moveCooldown <= 0.0 && this.gridArray[playerPoint.x + dx][playerPoint.y + dy].state == STATE_EMPTY ) {
	    // Move player first	    
	    this.gridArray[playerPoint.x][playerPoint.y].state = STATE_EMPTY;	
	    playerPoint.x = playerPoint.x + dx;
	    playerPoint.y = playerPoint.y + dy;
	    this.gridArray[playerPoint.x][playerPoint.y].state = STATE_PLAYER;	    
	    
	    // Check grid around player
	    for ( var i = -1; i < 2; i++) {
		for ( var j = -1; j < 2; j++) {
		    if (!(i == 0 && j == 0)) {
			var dx = playerPoint.x + i;
			var dy = playerPoint.y + j;
			if (dx < width && dx >= 0 && dy < height && dy >= 0) {
			    this.checkGrid(dx, dy);
			}
		    }
		}
	    }
	  
	    moveCooldown = 0.2;
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

function freetile(width, height, color, x, y) {
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


