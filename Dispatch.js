var boxCount = parseInt(readline());
var box = {
	weight: 0,
	volume: 0
}
var boxArray = [];
var totalWeight = 0;

for (var i = 0; i < boxCount; i++) {
    var inputs = readline().split(' ');
    var weight = parseFloat(inputs[0]);
    var volume = parseFloat(inputs[1]);
	boxArray[i].weight = weight;
	boxArray[i].volume = volume;
	boxArray[i].num = i;
	totalWeight += weight;
    
    
}


// Puts each box (obj) in a sorted sequence (arr)
function insertSort(obj, arr){
	
	
	
}

print(---.join(' ')); 