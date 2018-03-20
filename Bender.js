var inputs = readline().split(' ');
var L = parseInt(inputs[0]);
var C = parseInt(inputs[1]);
var grid = [];
var path = [];
var loopFound = false;
var loopCheck = [];
var startX, startY = 0;
var rounds = 0;
var beerMode = false;
var normalMode = true;
var teleports = [];



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
        var temp = row.indexOf('T');
       
        if(row.indexOf('T',temp+1)!==-1) {
            teleports.push(i);
            teleports.push(row.indexOf('T'));
            
        }
    }
}
yy = startY;
xx = startX;

// if(grid[yy+1][xx]===" ") path.push('SOUTH')
grid[startY][startX] = ' '; 
// printErr(grid[startY][startX])
for (var i = 0; i < L; i++) {
  
    printErr(grid[i]);
}


function checkNext(y, x, dir) {
    var direction = dir;
    var validCells = ['$', ' ', 'S', 'N', 'W', 'E', 'B','I','T'];
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
		    return;
		
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
    for(var i = 0; i < priority.length;i++) {
        //printErr('priority ' + priority[i]);
	    if(checkNext(yy,xx, 'S') && priority[i]==='S') {
	        //if(g==='$') break;
		    path.push('SOUTH');
		    //printErr('s');
		    loopyYY = yy+1;
		    loopyXX=xx;
		    loopyDir = 'S';
		    break;
	    } else if(checkNext(yy,xx,'E') && priority[i]==='E') {
		    path.push('EAST');
		   // printErr('e');
            loopyYY = yy;
		    loopyXX=xx+1;
		    loopyDir = 'E';
		    break;
	    } else if(checkNext(yy,xx,'N') && priority[i]==='N') {
		    path.push('NORTH');
		    //printErr('n');
            loopyYY = yy-1;
		    loopyXX=xx;
		    loopyDir = 'N';
		    break;
	    } else if(checkNext(yy,xx,'W') && priority[i]==='W') {
	        //if(grid[yy][xx] === '$') break;
	    	path.push('WEST');
	    	//printErr('w (not again)');
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
            //printErr('suicide Time');
            print(path.join('\n'));
            // printErr('end here!')
            return;
        }
        // check for Loop
        var coords = '' + yy.toString() + xx.toString() + dir + beerMode;
        //printErr(coords);
        if(loopCheck.indexOf(coords) === -1) {
            loopCheck.push(coords);

        //printErr(rounds + ' ' + yy + ' ' + xx);
        rounds++;
        
        // for debug purposes only
        //if(rounds>19) return;
        
        if(g ==='X' && beerMode) {
            grid[yy][xx]=' ';
        }
        if(g==='T') {
           if(yy === teleports[0] && xx === teleports[1])
               gameOn(teleports[2],teleports[3], dir);
           else
                gameOn(teleports[0],teleports[1], dir);
        }
        
        // check for Inverse mode
        if(g === 'I') {
            normalMode = !normalMode;
        }
        
        // direct modifiers
        if(g === 'S') {
            path.push('SOUTH');
            //printErr('modifier S');
            gameOn(yy+1,xx, 'S');
        } else if (g === 'E') {
            path.push('EAST');
            // printErr('modifier E');
            gameOn(yy,xx+1, 'E');
        } else if (g === 'N') {
            path.push('NORTH');
            // printErr('modifier N');
            gameOn(yy-1,xx,'N');
        } else if (g === 'W') {
            path.push('WEST');
            // printErr('modifier W');
            gameOn(yy,xx-1,'W');
        } 
        
        if(g === 'B') {
            beerMode = !beerMode;
        }

    var priority = [];
    if(normalMode) {
	    priority = setPriority(dir,['S','E','N','W']);
    } else {
	    priority = setPriority(dir,['W','N','E','S']);
    }
  
    var temp = priorityChecks(yy, xx, priority);
    
    gameOn(temp[0], temp[1], temp[2]);
    } else {
        print('LOOP');
        return;
    }
    
}
gameOn(startY, startX, 'S');
