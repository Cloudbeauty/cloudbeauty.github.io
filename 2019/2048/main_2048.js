
var board = new Array();
var score = 0;
var hasChanged = new Array();

$(document).ready(function(){
	prepareForMobile();
	newGame();
});

function prepareForMobile(){

	if(documentWidth > 500){
		gridContainerWidth = 500;
		cellSideLength = 100;
		cellSpace = 20;
	}

	$('#newgamebutton').css('width', gridContainerWidth*0.3);
	$('#newgamebutton').css('font-size', gridContainerWidth*0.05);
	$('#newgamebutton').css('margin-left', 0);
	$('#newgamebutton').css('margin-right', gridContainerWidth*0.05);
	$('#scoreboard').css('width', gridContainerWidth*0.3);
	$('#scoreboard').css('font-size', gridContainerWidth*0.05);

	$('#grid-container').css('width', gridContainerWidth - 2*cellSpace);
	$('#grid-container').css('height', gridContainerWidth - 2*cellSpace);
	$('#grid-container').css('padding', cellSpace);
	$('#grid-container').css('border-radius', 0.02 * gridContainerWidth);

	$('.grid-cell').css('width', cellSideLength);
	$('.grid-cell').css('height', cellSideLength);
	$('.grid-cell').css('border-radius', 0.02 * cellSideLength);
}

function newGame(){
	//初始化棋盘格
	init();
	//在随机的两个格子生成数字(2 or 4)
	generateOneNumber();
	generateOneNumber();
}


//初始化棋盘格
function init(){

	//遍历设置4x4的16个棋盘格位置
	for( var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++){

			var gridCell = $("#grid-cell-"+i+"-"+j);
			gridCell.css('top', getPosTop( i , j ));
			gridCell.css('left', getPosLeft( i , j ));
		}
	}

	//遍历定义二维数组
	for(var i = 0; i < 4; i++ ){
		board[i] = new Array();
		hasChanged[i] = new Array();

		for(var j = 0; j < 4; j++ ){
			board[i][j] = 0;
			hasChanged[i][j] = false;
		}
	}

	updateBoardView();

	score = 0;
	updateScore(score);
}

//更新棋盘格
function updateBoardView(){

	$(".number-cell").remove();

	for( var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++){

			//添加数字显示模块
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div' );
			var numberCell = $('#number-cell-'+i+'-'+j);

			//为0数字不显示 不为0显示数字并改变背景颜色和字体颜色以及位置
			if( board[i][j] == 0 ){
				numberCell.css('width', '0px');
				numberCell.css('height', '0px');
				numberCell.css('top', getPosTop(i,j) + cellSideLength/2 );
				numberCell.css('left', getPosLeft(i,j) + cellSideLength/2 );
			}else{
				numberCell.css('width', cellSideLength);
				numberCell.css('height', cellSideLength);
				numberCell.css('top', getPosTop(i,j));
				numberCell.css('left', getPosLeft(i,j));
				numberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
				numberCell.css('color', getNumberColor(board[i][j]));
				numberCell.text(board[i][j]);
			}

			hasChanged[i][j] = false;
			}	
		}
	//行高
	$('.number-cell').css('line-height', cellSideLength+'px');
	$('.number-cell').css('font-size', 0.6 * cellSideLength+'px');
	}


//随机生成一个新数字
function generateOneNumber(){

	//无空间返回
	if( noSpace( board ) )
		return false;

	//随机一个位置 位置可用返回
	var randx = parseInt( Math.floor(Math.random() * 4) );
	var randy = parseInt( Math.floor(Math.random() * 4) );

	//优化寻找随机生成数字位置
	var times = 0;

	while( times < 50 ){
		if( board[randx][randy] == 0 )
			break;

		randx = parseInt( Math.floor(Math.random() * 4) );
		randy = parseInt( Math.floor(Math.random() * 4) );
	}
	if( times == 50 ){

		for(var i = 0; i < 4; i++)
			for(var j = 0; j < 4; j++)
				if( board[i][j] == 0){
					randx = i;
					randy = j;
				}
	}

	//随机一个数字
	var randNum = Math.random() < 0.5 ? 2 : 4;

	//在随机位置显示随机数字
	board[randx][randy] = randNum;
	showNumberWithAnimation(randx, randy, randNum);

	return true;
}

//键盘按下触发
$(document).keydown( function(event){

	switch(event.keyCode){
		case 37:
			event.preventDefault(); 	//阻止按键默认滚动条下移
			if( moveLeft() ){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameOver    ()",300);
			}   		//左 
			break;
		case 38:
			event.preventDefault();
			if ( moveUp() ){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameOver    ()",300);
			} 			//上
			break;
		case 39:
			event.preventDefault();
			if ( moveRight() ){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameOver    ()",300);
			} 			//右
			break;
		case 40:
			event.preventDefault();
			if( moveDown() ){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameOver    ()",300);
			} 			//下
			break;
		default:
			break;
	}
});

//手指触控
document.addEventListener("touchstart", function(event){
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
});

document.addEventListener('touchmove', function(event){
	event.preventDefault();
});

document.addEventListener("touchend", function(event){
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;

	var delax = endx - startx;
	var delay = endy - starty;

	//移动距离过小不移动
	if( Math.abs(delax) < 0.3*documentWidth && Math.abs(delay) < 0.3*documentWidth ){
		return;
	}

	//在X方向移动
	if( Math.abs(delax) > Math.abs(delay) ){
		//move right
		if( delax > 0){
			if( moveRight() ){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameOver    ()",300);
			}
		}
		//move left
		else{
			if( moveLeft() ){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameOver    ()",300);
			}
		}
	}
	else{		//在Y方向移动
		//move down 
		if( delay > 0){
			if( moveDown() ){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameOver    ()",300);
			}
		}
		//move up
		else{
			if( moveUp() ){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameOver    ()",300);
			}
		}
	}
});

//判断游戏是否结束
function isgameOver(){

	if( noSpace(board) && noMove(board) ){
		gameOver();
	}
}

//游戏结束
function gameOver(){
	gameOverWithAnimation();
}

//向左移动
function moveLeft(){

	//判断是否可以向左移动
	if( !canMoveLeft(board) ){
		return false;
	}

	for (var i = 0; i < 4; i++)
		for(var j = 1; j < 4; j++)
			if( board[i][j] != 0){
				
				for(var k = 0; k < j; k++){
					//目标位置为空
					if ( board[i][k] == 0 && noBlockHorizontal(i,k,j,board) ){
						//移动
						showMoveWithAnimation( i , j , i , k );
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					//目标位置数字与本身相同
					else if ( board[i][k] == board[i][j] && noBlockHorizontal(i,k,j,board) && !hasChanged[i][k] ){
						//移动
						showMoveWithAnimation( i , j , i , k );
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[i][k];
						updateScore(score);

						hasChanged[i][k] = true
						continue;
					}
				}
			}

	setTimeout("updateBoardView()",200);
	return true;
}

//向右移动
function moveRight(){

	//判断是否可以向右移动
	if( !canMoveRight(board) ){
		return false;
	}

	for(var i = 0; i < 4; i++)
		for(var j = 2; j >= 0; j--)
			if( board[i][j] != 0 ){

				for(var k = 3; k > j; k--){
					if( board[i][k] == 0 && noBlockHorizontal( i, j, k, board)){
						//移动
						showMoveWithAnimation( i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if( board[i][k] == board[i][j] && noBlockHorizontal( i, j, k, board) && !hasChanged[i][k] ){
						showMoveWithAnimation( i, j, i, k);
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[i][k];
						updateScore(score);

						hasChanged[i][k] = true;
						continue;
					}
				}
			}
	setTimeout("updateBoardView()",200);
	return true;
}


//向上移动
function moveUp(){

	//判断是否可以向上移动
	if( !canMoveUp(board) ){
		return false;
	}

	for(var i = 1; i < 4; i++)
		for(var j = 0; j < 4; j++)
			if( board[i][j] != 0){

				for(var k = 0; k < i; k++){
					if ( board[k][j] == 0 && noBlockVertical( i, k, j, board)){
						showMoveWithAnimation( i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if ( board[k][j] == board[i][j] && noBlockVertical( i, k, j, board) && !hasChanged[k][j] ){
						showMoveWithAnimation( i, j, k, j);
						//add
						board[k][j] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[k][j];
						updateScore(score);

						hasChanged[k][j] = true;
						continue;
					} 
				}
			}

	setTimeout("updateBoardView()",200);
	return true;
}


//向下移动
function moveDown(){

	//判断是否可以向下移动
	if( !canMoveDown(board) ){
		return false;
	}

	for(var i = 2; i >= 0; i--)
		for(var j = 0; j < 4; j++)
			if( board[i][j] !=0 ){

				for(var k = 3; k > i; k--){
					if( board[k][j] == 0 && noBlockVertical( k, i, j, board)){
						showMoveWithAnimation( i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if( board[k][j] == board[i][j] && noBlockVertical( k, i, j, board) && !hasChanged[k][j] ){
						showMoveWithAnimation( i, j, k, j);
						//add
						board[k][j] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[k][j];
						updateScore(score);

						continue;					}
				}
			}

	setTimeout("updateBoardView()",200);
	return true;
}