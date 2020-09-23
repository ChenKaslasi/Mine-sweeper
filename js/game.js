'use strict';

var MINE = '💣';
var MARK = '🚩'
var gSize = 4;
var gMines = 2;
var gScore = 0;
var gFlagsCount = 0;
var gMinesCount = 0;

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
var elEmoji = document.createElement('div')

function initGame() {
  // variables init
  gLevel = {
    ROWS: gSize,
    COLUMNS: gSize,
    MINES: gMines
  }

  gIsFirstClick = true;
  gFlagsCount = 0;
  gMinesCount = 0;

  // board init
  gBoard = createBoard()
  refreshMinesAroundCount(gBoard)
  renderGame()

  // timer Init
  var elTimer = document.querySelector('.timer');
  elTimer.innerText = '00:00';
  if (gTimerInterval) clearInterval(gTimerInterval);
  
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
  // table rendering
  var htmlStrTable = '<table> <tbody>'
  for (var i = 0; i < board.length; i++) {
    htmlStrTable += '<tr>\n'
    for (var j = 0; j < board.length; j++) {
      var className = `hide cell-${i}-${j}`
      htmlStrTable += `<td class="${className}" onclick="cellClicked(${i},${j})" 
      oncontextmenu="cellMarked(this,${i},${j})" ></td>`
      // ${gBoard[i][j].isMine ? MINE : board[i][j].minesAroundCount ? board[i][j].minesAroundCount : ''}
    }
    htmlStrTable += '</tr>'
  }
  htmlStrTable += '</tbody></table>\n'

  
  elTable.innerHTML = htmlStrTable
  elContainer.appendChild(elTable)


  // mine & flag Emojis rendering
  var htmlStrEmoji = ''
  htmlStrEmoji += `<div class="emojis"> <span class="flag">🚩${gFlagsCount}</span>\n <span class="mine">💣${gMinesCount}</span>\n </div>`

  elEmoji.innerHTML = htmlStrEmoji
  elContainer.appendChild(elEmoji)
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
    expandShown(i, j)
    if (cell.isMine) {
      gMinesCount++;
      elEmoji.querySelector('.mine').innerText = `💣${gMinesCount}`;
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

// recursively get negs

function expandShown(i,j) {
  var cell = gBoard[i][j];
  if (!cell.isShown) {
    revealCell({ i, j });
    if (!cell.isMine) {
      gScore++;
      if (!cell.minesAroundCount) {
        var row = i;
        var col = j;
        for (var i = row - 1; i <= row + 1; i++) {
          if (i < 0 || i >= gBoard.length) continue;
          for (var j = col - 1; j <= col + 1; j++) {
              if (j < 0 || j >= gBoard[0].length) continue;
              if (i === row && j === col) continue;
              expandShown(i, j);
          }
        }
      }
    }
  }
}
