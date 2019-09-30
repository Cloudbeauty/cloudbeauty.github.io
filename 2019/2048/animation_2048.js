
function showNumberWithAnimation(i,j,randNum){

	var numberCell = $('#number-cell-'+i+'-'+j);

	numberCell.css('background-color',getNumberBackgroundColor(randNum));
	numberCell.css('color',getNumberColor(randNum));
	numberCell.text(randNum); 

	numberCell.animate({
		width: cellSideLength,
		height: cellSideLength,
		top: getPosTop(i,j),
		left: getPosLeft(i,j)
	},50);
}

function showMoveWithAnimation( top , left , newtop, newleft){

	var numberCell = $('#number-cell-'+top+'-'+left);

	numberCell.animate({
		top: getPosTop(newtop, newleft),
		left: getPosLeft(newtop, newleft)
	},200);
}

function updateScore(score){

	$("#score").text(score);
}

function gameOverWithAnimation(){
	alert("Game Over!");
}