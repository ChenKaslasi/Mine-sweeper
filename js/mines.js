'use strict';

// Place Mines

function setMinesOnBaord(board) {
  var minesCoords = getRandomCoords(gLevel.MINES);
    for (var i = 0; i < minesCoords.length; i++) {
        var coord = minesCoords[i];
        board[coord.i][coord.j].isMine = true;
    }
}


function updateMinesAroundCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
        var cell = board[i][j];
        cell.minesAroundCount = setMinesNegsCount(board, i, j);
    }
  }
}


// Set the numbers inside each cell in the board


function refreshMinesAroundCount(board) {
  for (var i = 0; i < board.length; i++) {
      for (var j = 0; j < board[0].length; j++) {
          var cell = board[i][j];
          cell.minesAroundCount = setMinesNegsCount(board, i, j);
      }
  }
}

function setMinesNegsCount(board, row, col) {
  var count = 0;
  for (var i = row - 1; i <= row + 1; i++) {
      if (i < 0 || i >= board.length) continue;
      for (var j = col - 1; j <= col + 1; j++) {
          if (j < 0 || j >= board[0].length) continue;
          if (i === row && j === col) continue;
          if (board[i][j].isMine) count++;
      }
  }
  return count;
}

// Loop through all negs 


function filterCellsToShow(i, j) {
  var cell = gBoard[i][j];
  if (!cell.isShown) {
    revealCell({ i, j });
    if (!cell.isMine) {
      gScore++;
      if (!cell.minesAroundCount) {
        expandShown(i, j)
      }
    }
  }
}

function expandShown(row, col) {
  for (var i = row - 1; i <= row + 1; i++) {
      if (i < 0 || i >= gBoard.length) continue;
      for (var j = col - 1; j <= col + 1; j++) {
          if (j < 0 || j >= gBoard[0].length) continue;
          if (i === row && j === col) continue;
          showCell(i, j);
      }
  }
}

function showCell(i,j) {
  var cell = gBoard[i][j];
    if (!cell.isShown) {
        revealCell({ i, j });
        if (!cell.isMine) gScore++;
        if (!cell.minesAroundCount && !cell.isMine) {
            expandShown(i, j);
        }
    }
}


