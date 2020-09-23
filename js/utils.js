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
  return Math.floor(Math.random() * (max - min)) + min; 
}

function cellMarked(elCell, i, j) {
  var cell = gBoard[i][j]
  if (!gIsFirstClick) {
    if (!cell.isShown) {
      if (!cell.isMarked) {
        gBoard[i][j].isMarked = true;
        elCell.innerText = '🚩'
        gFlagsCount++;
        elEmoji.querySelector('.flag').innerText = `🚩${gFlagsCount}`;
      } else {
        gBoard[i][j].isMarked = false;
        elCell.innerText = ' ';
        gFlagsCount--
        elEmoji.querySelector('.flag').innerText = `🚩${gFlagsCount}`;
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
