var inputs = readline().split(' ');
var L = parseInt(inputs[0]);
var C = parseInt(inputs[1]);
var grid = [];
var path = [];
var teleFound = false;
var loopCheck = [];
var startX, startY = 0;
var rounds = 0;
var beerMode = false;
var normalMode = true;
var teleports = [];
var globalY = 0;
var globalX = 0;
var globalDir = '';
var endGame = false;

// take inputs, find the starting point and teleports
for (var i = 0; i < L; i++) {
    var row = readline();
    printErr(row);
    grid.push(row.split(''));
    if(row.indexOf('@') !== -1) {
        startX = row.indexOf('@');
        startY = i;
    }
    if(row.indexOf('T') !== -1) {
        teleports.push(i);
        teleports.push(row.indexOf('T'));
    }
}
var yy = startY;
var xx = startX;

function checkNext(y, x, dir) {
    var direction = dir;
    var validCells = ['$', ' ', 'S', 'N', 'W', 'E', 'B', 'I', 'T'];
	switch (direction) {
		case 'S':
			if(validCells.indexOf(grid[y+1][x]) !== -1  ||  (grid[y+1][x] === 'X' && beerMode))
				return true;
			else
				return false;
			break;
		case 'E':
			if(validCells.indexOf(grid[y][x+1]) !== -1 || (grid[y][x+1] === 'X' && beerMode))
				return true;
			else
				return false;
			break;
		case 'N':
			if(validCells.indexOf(grid[y-1][x]) !== -1 || (grid[y-1][x] === 'X' && beerMode))
				return true;
			else
				return false;
			break;
		case 'W':
			if(validCells.indexOf(grid[y][x-1]) !== -1 || (grid[y][x-1] === 'X' && beerMode))
				return true;
			else
				return false;
			break;
		default:
		    return false;
	}
}
function setPriority(current, allDirections) {
	var d = allDirections;
	var n = d.indexOf(current);
	d.unshift(current);
	d.splice(n+1,1);	
	return d;
}

function priorityChecks (yy,xx,priority) {
    var loopyYY, loopyXX = 0;
    var loopyDir = '';
    for(var i = 0; i < priority.length; i++) {

	    if(checkNext(yy, xx, 'S') && priority[i]==='S') {
	  	    path.push('SOUTH');
		    loopyYY = yy+1;
		    loopyXX=xx;
		    loopyDir = 'S';
		    break;
	    } else if(checkNext(yy, xx, 'E') && priority[i]==='E') {
		    path.push('EAST');
		    loopyYY = yy;
		    loopyXX=xx+1;
		    loopyDir = 'E';
		    break;
	    } else if(checkNext(yy, xx, 'N') && priority[i]==='N') {
		    path.push('NORTH');
		    loopyYY = yy-1;
		    loopyXX=xx;
		    loopyDir = 'N';
		    break;
	    } else if(checkNext(yy, xx, 'W') && priority[i]==='W') {
	       	path.push('WEST');
            loopyYY = yy;
		    loopyXX=xx-1;
		    loopyDir = 'W';
	    	break;
	    } 
    }
    return [loopyYY,loopyXX,loopyDir];
}


function gameOn(yy, xx, dir) {
    var g = grid[yy][xx];
    // check for Suicide
    if(g === '$') {
        print(path.join('\n'));
		endGame = true;
        return;
    }
    // check for Loop, if not goes on with other checks
    var coords = grid[xx][yy] + '' + yy.toString() + ' ' + xx.toString() + dir + beerMode;
	printErr(coords + ' ' + loopCheck)
	if(loopCheck.indexOf(coords) === -1) {
		loopCheck.push(coords);
			
		if(g === 'X' && beerMode) {
			grid[yy][xx]=' ';
			loopCheck.length = 0;
		}
		if(g === 'T') teleFound = !teleFound;
		if(g === 'T' && teleFound) {
		    if(yy === teleports[0] && xx === teleports[1]) {
			    globalY = teleports[2];
				globalX = teleports[3];
				globalDir = dir;
			}
		    else {
				globalY = teleports[0];
				globalX = teleports[1];
				globalDir = dir;
			}
			return;
		}
		
			
		// check for Inverse mode
		if(g === 'I') {
			normalMode = !normalMode;
		}
			
		// direct modifiers
		if(g === 'S') {
			path.push('SOUTH');
			globalY = yy+1;
			globalX = xx;
			globalDir = 'S';
			return;
		} else if (g === 'E') {
			path.push('EAST');
			globalY = yy;
			globalX = xx+1;
			globalDir = 'E';
			return;
		} else if (g === 'N') {
			path.push('NORTH');
			globalY = yy-1;
			globalX = xx;
			globalDir = 'N';
			return;
		} else if (g === 'W') {
			path.push('WEST');
			globalY = yy;
			globalX = xx-1;
			globalDir = 'W';
			return;
		} else if(g === 'B') {
			beerMode = !beerMode;
		}

		var priority = [];
		if(normalMode) {
			priority = setPriority(dir,['S','E','N','W']);
		} else {
			priority = setPriority(dir,['W','N','E','S']);
		}
		  
		var temp = priorityChecks(yy, xx, priority);
		globalY = temp[0];
		globalX = temp[1]; 
		globalDir = temp[2];
		
	} else {
        print('LOOP');
		endGame = true;
    }
    
}
while (!endGame) {
	if(!rounds) {
		gameOn(startY, startX, 'S')
	} else {
		gameOn(globalY, globalX, globalDir)
	}
	rounds++;
}
	
