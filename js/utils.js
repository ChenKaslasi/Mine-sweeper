'use strict';


function getRandomCoords(num) {
  var avilableCoords = [];
  var diffI = 0;
  var diffJ = 0;
  for (var i = 0; i < gLevel.ROWS; i++) {
    for (var j = 0; j < gLevel.COLUMNS; j++) {
      diffI = Math.abs(i - gfirstCoord.i)
      diffJ = Math.abs(j - gfirstCoord.j)
      var isNegWithStartCoord = diffI <= 1 && diffJ <= 1

      if (!isNegWithStartCoord) {
        avilableCoords.push({ i, j })
      }
    }
  }

  var coords = []
  for (var i = 0; i < num; i++) {
    var randomCoor = getRandomInt(0, avilableCoords.length);
    coords.push(avilableCoords.splice(randomCoor, 1)[0]);
  }
  return coords;
}



function expandShown(row, col) {
  for (var i = row - 1; i <= row + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = col - 1; j <= col + 1; j++) {
      if (j < 0 || j >= gBoard[0].length) continue;
      if (i === row && j === col) continue;
      revealCell({ i: i, j: j });
    }
  }
}


function revealCell(coord) {
  var cell = gBoard[coord.i][coord.j];
  cell.isShown = true;
  var elCell = document.querySelector(`.cell-${coord.i}-${coord.j}`)
  elCell.classList.remove('hide');
  elCell.classList.add('show');
  elCell.innerText = cell.isMine ? MINE : (cell.minesAroundCount ? cell.minesAroundCount : '');
}



function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function cellMarked(elCell, i, j) {
  var cell = gBoard[i][j]
  if (gIsFirstClick) {
    console.log('flag at first click')
  } else {
    if (!cell.isShown) {
      if (!cell.isMarked) {
        gBoard[i][j].isMarked = true;
        elCell.innerText = '🚩'
        gFlagsCount++
      } else {
        gBoard[i][j].isMarked = false;
        elCell.innerText = ' ';
        gFlagsCount--
      }
    }
  }
}



function startTimer() {
  var diff = Date.now() - gStartGameTime;
  var sec = Math.floor((diff % (1000 * 60)) / 1000);
  var min = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  var elTimer = document.querySelector('.timer');
  if (min<10) { min = "0" + min; }
  if (sec<10) { sec = "0" + sec; }

  elTimer.innerText = `${min}:${sec} `;
}
