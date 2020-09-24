'use strict';

var MINE = '💣';
var MARK = '🚩'
var LIVES = '💖'
var gSize = 4;
var gMines = 2;
var gScore = 0;
var gFlagsCount = 0;
var gMinesCount = 0;
var gLifeCount = 3;
var gCountHints = 3;
var gCountSafeClicks = 3;
var gHintMode = false
var defultSmiley = "<img src='images/basic.jpg'/>"
var VictorySmiley = "<img src='images/victory.jpg'/>"
var LoseSmiley = "<img src='images/lose.png'/>"
var BulbOn = 'images/Lightbulb-On.png'
var BulbOff = 'images/Lightbulb-Off.png'

var gIsFirstClick;
var gfirstCoord;
var gTimerInterval;
var gStartGameTime;
var gBoard;
var gLevel;
var gLastMove;
var gLastSafeCoord = null

// Elements
var elBody = document.querySelector('body')
var elContainer = document.querySelector('.container')
var elSmiley = document.querySelector('.smiley')
var elHints = document.querySelector('.hints')


var elTable = document.createElement('table')
var elEmoji = document.createElement('div')
var elLives = document.createElement('div')
var elSafeClick = document.createElement('buttun')
var elFooter = document.createElement('div')


// Disable right click
document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
}, false);

// 
elSmiley.addEventListener('click', initGame)

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
  gLifeCount = 3;
  gCountHints = 3;
  gCountSafeClicks = 3;
  gHintMode = false;
  gScore = 0;
  elSmiley.innerHTML = defultSmiley
  elTable.style.pointerEvents = 'initial';
  gLastSafeCoord = null;

  // board init
  gBoard = createBoard()
  refreshMinesAroundCount(gBoard)
  renderGame()

  // timer Init
  var elTimer = document.querySelector('.timer');
  elTimer.innerText = '00:00';
  if (gTimerInterval) clearInterval(gTimerInterval);

  // bulb Init
  for (var i = 0; i < elHints.childElementCount; i++) {
    elHints.children[i].src = BulbOff
  }
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
    }
    htmlStrTable += '</tr>'
  }
  htmlStrTable += '</tbody></table>\n'


  elTable.innerHTML = htmlStrTable
  elContainer.appendChild(elTable)


  // rendering - safe Click buttun 

  var htmlStrSafeClick = '';
  htmlStrSafeClick = `<button class="safeClickBtn" onclick="activateSafeClick()">safe Click (${gCountSafeClicks})</button>`;

  elSafeClick.innerHTML = htmlStrSafeClick;
  elContainer.appendChild(elSafeClick)

  // rendering - mine & flag & life Emojis 
  var htmlStrEmoji = '';
  htmlStrEmoji += `<div class="emojis"> <span class="flag">🚩${gFlagsCount}</span>\n <span class="mine">💣${gMinesCount}</span>\n  `

  elEmoji.innerHTML = htmlStrEmoji
  elContainer.appendChild(elEmoji)

  // rendering - lives 
  var htmlStrLives = '';
  htmlStrLives += `<div class="heart ">${LIVES.repeat(gLifeCount)}</div> </div>`
  elLives.innerHTML = htmlStrLives;
  elContainer.appendChild(elLives)
}

// rendering - footer
var htmlFooter = '';
htmlFooter += `<div class="footer">Ⓒ Chen kaslasi</div>`

elFooter.innerHTML = htmlFooter;
elBody.appendChild(elFooter)

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
    if (gHintMode) {
      gHintMode = false;
      var negsToReveal = getNegs({ i, j });
      revealAllNegs(negsToReveal)
      setTimeout(function () {
        hideAllNegs(negsToReveal)
      }, 1000)
    }
    expandShown(i, j)
    if (cell.isMine) {
      gMinesCount++;
      elEmoji.querySelector('.mine').innerText = `💣${gMinesCount}`;
      gLifeCount--;
      elLives.innerText = LIVES.repeat(gLifeCount)
      elLives.style.fontSize = "xx-large";
      if (gLifeCount <= 0)
        setGameOver()
    }
    else if (gScore === (gLevel.ROWS * gLevel.COLUMNS) - gLevel.MINES) {
      setWin();
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

function expandShown(i, j) {
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


function setGameOver() {
  elSmiley.innerHTML = LoseSmiley;
  clearInterval(gTimerInterval);
  elTable.style.pointerEvents = 'none';
  revealAllBoard(gBoard)
}

function setWin() {
  elSmiley.innerHTML = VictorySmiley;
  clearInterval(gTimerInterval);
  elTable.style.pointerEvents = 'none';
  revealAllBoard(gBoard)
}


function revealAllBoard(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      var cell = board[i][j];
      cell.isShown = true;
      revealCell({ i: i, j: j })
    }
  }
}


function activateHint(el) {
  if (gCountHints > 0 && !gIsFirstClick) {
    el.src = BulbOn;
    gCountHints--;
    gHintMode = true;
  }
}


function getNegs(coor) {
  var hiddenNegs = [];
  var row = coor.i;
  var col = coor.j;
  for (var i = row - 1; i <= row + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = col - 1; j <= col + 1; j++) {
      if (j < 0 || j >= gBoard[0].length) continue;
      if (gBoard[i][j].isShown === false) {
        hiddenNegs.push({ i: i, j: j })
      }
    }
  } return hiddenNegs
}

function revealAllNegs(coorArr) {
  for (var i = 0; i < coorArr.length; i++) {
    revealCell(coorArr[i])
  }
}

function hideAllNegs(coorArr) {
  for (var i = 0; i < coorArr.length; i++) {
    HidelCell(coorArr[i])
  }
}



function activateSafeClick() {
  var elsafeClickBtn = document.querySelector('.safeClickBtn')
  gCountSafeClicks--;
  elsafeClickBtn.textContent = `safe Click (${gCountSafeClicks})`
  getSafeClick();
  setTimeout(function () {
    removeSafeclick()
  }, 1000)
  if(gCountSafeClicks <= 0) {
    elsafeClickBtn.style.pointerEvents = 'none';
    elsafeClickBtn.style.backgroundColor = 'grey'
  }
}

function getSafeClick() {
  gLastSafeCoord = findSafeCoord();
  var elCell = document.querySelector(`.cell-${gLastSafeCoord.i}-${gLastSafeCoord.j}`)
  elCell.classList.add('show-safe-click');
  elCell.style.pointerEvents = 'none';
}

function removeSafeclick() {
  var elCell = document.querySelector(`.cell-${gLastSafeCoord.i}-${gLastSafeCoord.j}`)
  elCell.classList.remove('show-safe-click');
  elCell.classList.add('hide');
  elCell.style.pointerEvents = 'initial';
}

function findSafeCoord() {
  var safeCoords = [];
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      var cell = gBoard[i][j];
      if (!cell.isShown && !cell.isMarked && !cell.isMine) {
        safeCoords.push({ i: i, j: j })
      }
    }
  } return (safeCoords[getRandomInt(1, safeCoords.length - 1)])
}
