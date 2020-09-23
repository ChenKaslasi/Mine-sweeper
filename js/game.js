'use strict';

var MINE = '💣';
var MARK = '🚩'
var gSize = 4;
var gMines = 2;
var gScore = 0;
var gFlagsCount = 0;

var gIsFirstClick;
var gfirstCoord;
var gTimerInterval;
var gStartGameTime;
var gBoard;
var gLevel;

// Disable right click
document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
}, false);


// Elements
var elBody = document.querySelector('body')
var elContainer = document.querySelector('.container')
var elTable = document.createElement('table')


function initGame() {
  gLevel = {
    ROWS: gSize,
    COLUMNS: gSize,
    MINES: gMines
  }
  gIsFirstClick = true
  gBoard = createBoard()
  
  refreshMinesAroundCount(gBoard)
  renderGame()


  // timer Init
  var elTimer = document.querySelector('.timer');
  elTimer.innerText = '00:00';
  if (gTimerInterval) clearInterval(gTimerInterval);
  // gTimerInterval = null;  
  
}


function createBoard() {
  var board = [];
  for (var i = 0; i < gLevel.ROWS; i++) {
    board[i] = []
    for (var j = 0; j < gLevel.COLUMNS; j++) {
      board[i][j] = createCell()
    }
  } return board
}


function createCell() {
  var cell = {
    minesAroundCount: 0,
    isShown: false,
    isMine: false,
    isMarked: false
  }
  return cell
}


function renderBoard(board) {
  var htmlstr = '<table> <tbody>'
  for (var i = 0; i < board.length; i++) {
    htmlstr += '<tr>\n'
    for (var j = 0; j < board.length; j++) {
      var className = `hide cell-${i}-${j}`
      htmlstr += `<td class="${className}" onclick="cellClicked(${i},${j})" 
      oncontextmenu="cellMarked(this,${i},${j})" ></td>`
      // ${gBoard[i][j].isMine ? MINE : board[i][j].minesAroundCount ? board[i][j].minesAroundCount : ''}
    }
    htmlstr += '</tr>'
  }
  htmlstr += '</tbody></table>'
  elTable.innerHTML = htmlstr
  elContainer.appendChild(elTable)
}


function renderGame() {
  renderBoard(gBoard);
}

// ------------------------------------------ Start game -------------------------------------//

function cellClicked(i, j) {
  var cell = gBoard[i][j];

  if (gIsFirstClick) {
    startGame({ i, j });
  }

  if (!cell.isShown) {
    filterCellsToShow(i, j)
    if (cell.isMine) {
      setGameOver()
    } 
    else if (gScore === (gLevel.ROWS * gLevel.COLUMNS) - gLevel.MINES) {
      setGameOver()
    }
  } 
}

function startGame(coord) {
  gStartGameTime = Date.now();
  gIsFirstClick = false;
  gfirstCoord = coord;
  setMinesOnBaord(gBoard);
  updateMinesAroundCount(gBoard);
  gTimerInterval = setInterval(startTimer, 100);
}


function setGameOver() {
  console.log('game over')
}

function setLevels(el) {
  switch (el.innerText) {
    case "Easy":
      gSize = 4;
      gMines = 2;
      elContainer.removeChild(elTable)
      initGame();
      break;

    case "Hard":
      gSize = 8;
      gMines = 12;
      initGame();
      break;
    
    case "Extreme":
      gSize = 12;
      gMines = 30;
      initGame();
      break;
  }
}

