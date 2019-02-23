var chessBoard;
var game;
var computerTurn = false;
var logger;
var positionCount;

//{ captured, color, flags, from, piece, san, to }
function setup() {
  frameRate(1);
  noCanvas();

  let chessParams = {
    draggable: true,
    position: 'start',
    onMouseoverSquare: onMouseoverSquare,
    onMouseoutSquare: onMouseoutSquare,
    onSnapEnd: onSnapEnd,
    onDragStart: onDragStart,
    onDrop: onDrop
  };
  chessBoard = ChessBoard('chessBoard', chessParams);
  game = new Chess();
  positionCount = 0;

  logger = $('#logger');
  $('#startBoard').click(startBoard);
  $('#clearBoard').click(clearBoard);
}

//***** ***** ***** ***** ***** GAME AI ***** ***** ***** ***** *****//

function draw() {
  if(computerTurn) {
    if(game.game_over() === true || game.in_draw() === true || game.moves().length === 0) {
      alert("Game Over!");
    };
    makeMove(calculateMinimaxMove());
  }
}

function makeMove(move) {
  if(move) {
    let theMove = game.move(move);
    chessBoard.position(game.fen());

    logMove(theMove);
    computerTurn = false;
  }
}

function calculateMinimaxMove() {
  positionCount = 0;
  let depth = 2;

  let minimaxMove = minimaxRoot(depth, game, true);
  return minimaxMove;
}

function minimaxRoot(depth, game, isMaximisingPlayer) {
  let thisTurnMoves = game.moves();
  let bestMove = null;
  let bestValue = -9999;

  for(let i = 0; i < thisTurnMoves.length; i++) {
    let thisTurnMove = thisTurnMoves[i];
    game.move(thisTurnMove);

    let boardValue = minimax(depth - 1, game, !isMaximisingPlayer);
    game.undo();
    if(boardValue >= bestValue) {
      bestValue = boardValue;
      bestMove = thisTurnMove;
    }
  }

  return bestMove;
};

function minimax(depth, game, isMaximisingPlayer) {
  positionCount++;
  if(depth === 0) { return -evaluateBoard(game.board()); }

  let thisTurnMoves = game.moves();

  if(isMaximisingPlayer) {
    let bestValue = -9999;
    for(let i = 0; i < thisTurnMoves.length; i++) {
      game.move(thisTurnMoves[i]);
      bestValue = Math.max(bestValue, minimax(depth - 1, game, !isMaximisingPlayer));
      game.undo();
    }
    return bestValue;
  } else {
    let bestValue = 9999;
    for(let i = 0; i < thisTurnMoves.length; i++) {
      game.move(thisTurnMoves[i]);
      bestValue = Math.min(bestValue, minimax(depth - 1, game, !isMaximisingPlayer));
      game.undo();
    }
    return bestValue;
  }
};

//***** BEST MOVE *****//
function calculateBestMove() {
  let thisTurnMoves = game.moves();
  let bestMove = null;
  let bestValue = -9999;

  for(let i = 0; i < thisTurnMoves.length; i++) {
    let thisTurnMove = thisTurnMoves[i];
    game.move(thisTurnMove);

    let boardValue = -evaluateBoard(game.board());
    game.undo();
    if(boardValue > bestValue) {
      bestValue = boardValue;
      bestMove = thisTurnMove;
    }
  }

  console.log(`Best Value: ${bestValue}`);
  return bestMove;
}

function evaluateBoard(board) {
  let totalEval = 0;

  for(let x = 0; x < 8; x++) {
    for(let y = 0; y < 8; y++) {
      totalEval += getPieceValue(board[x][y]);
    }
  }

  return totalEval;
}

function getPieceValue(piece) {
  if(piece === null) return 0;

  let getAbsoluteValue = function(piece) {
    switch(piece.type) {
      case 'p': return 10;  break;
      case 'n': return 30;  break;
      case 'b': return 30;  break;
      case 'r': return 50;  break;
      case 'q': return 90;  break;
      case 'k': return 900; break;
      default: throw "Unknown piece type: " + piece.type;
    }
  }

  let absoluteValue = getAbsoluteValue(piece, piece.color === 'w');
  return piece.color === 'w' ? absoluteValue : -absoluteValue;
}

//***** RANDOM *****//
function calculateRandomMove() {
  let possibleMoves = game.moves();
  let randomIndex = Math.floor(Math.random() * possibleMoves.length);

  return possibleMoves[randomIndex];
}

//***** ***** ***** ***** ***** DOCUMENT ***** ***** ***** ***** *****//
function startBoard() {
  chessBoard.start();
  positionCount = 0;
}

function clearBoard() {
  computerTurn = false;
  chessBoard.clear();
  game.clear();
  logger.html("");
}

function logMove(move) {
  let image = `<img class="img-thumbnail" src="img/chesspieces/wikipedia/${move.color}${move.piece.toUpperCase()}.png" style="height: 40px;"/>`;
  logger.prepend(`<li class="list-group-item">${image}   <b>From:</b> ${move.from}   | <b>To:</b> ${move.to}</li>`);
}

//***** ***** ***** ***** ***** PLAYER CONTROLS ***** ***** ***** ***** *****//
var onDragStart = function(source, piece, position, orientation) {
  if(game.in_checkmate() === true || game.in_draw() === true || piece.search(/^b/) !== -1) {
    return false;
  }
};

var onDrop = function(source, target) {
  let move = game.move({ from: source, to: target, promotion: 'q'});
  removeSquares();
  if(move === null) { return 'snapback'; }
  logMove(move);
  computerTurn = true;
};

var onMouseoverSquare = function(square, piece) {
  let moves = game.moves({ square: square, verbose: true });
  if(moves.length === 0) return;

  renderSquare(square);
  for(let i = 0; i < moves.length; i++) {
    renderSquare(moves[i].to);
  }
}

var onMouseoutSquare = function(square, piece) {
  removeSquares();
};

var onSnapEnd = function () {
    chessBoard.position(game.fen());
};

//***** ***** ***** ***** ***** RENDER SQUARES ***** ***** ***** ***** *****//
var renderSquare = function(square) {
  let squareEl = $(`#chessBoard .square-${square}`);
  let bgColor = '#a9a9a9';
  if(squareEl.hasClass('black-3c85d') === true) {
    bgColor = '#696969';
  }
  squareEl.css('background', bgColor);
}

var removeSquares = function() {
    $('#chessBoard .square-55d63').css('background', '');
};
