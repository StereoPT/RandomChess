var chessBoard;
var game;
var computerTurn = false;
var logger;
var searchDepth;

//{ captured, color, flags, from, piece, san, to }
function setup() {
  frameRate(5);
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

  logger = $('#logger');
  $('#startBoard').click(startBoard);
  $('#clearBoard').click(clearBoard);
  $('#depthList li a').on('click', depthTrigger);
}

//***** ***** ***** ***** ***** PIECE POSITION ***** ***** ***** ***** *****//
var pawnEvalWhite = [
  [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
  [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
  [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
  [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
  [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
  [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
  [0.5,  1.0, 1.0,  -2.0, -2.0,  1.0,  1.0,  0.5],
  [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]];
var pawnEvalBlack = reverseArray(pawnEvalWhite);

var knightEval = [
  [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
  [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
  [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
  [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
  [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
  [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
  [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
  [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]];

var bishopEvalWhite = [
  [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
  [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
  [ -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
  [ -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
  [ -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
  [ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
  [ -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
  [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]];
var bishopEvalBlack = reverseArray(bishopEvalWhite);

var rookEvalWhite = [
  [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
  [  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
  [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]];
var rookEvalBlack = reverseArray(rookEvalWhite);

var queenEval = [
  [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
  [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
  [ -1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
  [ -0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
  [  0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
  [ -1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
  [ -1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
  [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]];

var kingEvalWhite = [
  [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
  [ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
  [  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0 ],
  [  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0 ]];
var kingEvalBlack = reverseArray(kingEvalWhite);

function reverseArray(array) {
    return array.slice().reverse();
};

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
    let theMove = game.move(move[0]);
    chessBoard.position(game.fen());

    logMove(theMove, move[1]);
    computerTurn = false;
  }
}

function calculateMinimaxMove() {
  if(!searchDepth) searchDepth = 2;

  let beforeDate = new Date().getTime();
  let minimaxMove = minimaxRoot(searchDepth, game, true);
  let afterDate = new Date().getTime();
  let moveTime = (afterDate - beforeDate);

  return [minimaxMove, moveTime];
}

function minimaxRoot(depth, game, isMaximisingPlayer) {
  let thisTurnMoves = game.moves();
  let bestMove = null;
  let bestValue = -9999;

  for(let i = 0; i < thisTurnMoves.length; i++) {
    let thisTurnMove = thisTurnMoves[i];
    game.move(thisTurnMove);

    let boardValue = minimax(depth - 1, game, -10000, 10000, !isMaximisingPlayer);
    game.undo();
    if(boardValue >= bestValue) {
      bestValue = boardValue;
      bestMove = thisTurnMove;
    }
  }

  return bestMove;
};

function minimax(depth, game, alpha, beta, isMaximisingPlayer) {
  if(depth === 0) { return -evaluateBoard(game.board()); }

  let thisTurnMoves = game.moves();

  if(isMaximisingPlayer) {
    let bestValue = -9999;
    for(let i = 0; i < thisTurnMoves.length; i++) {
      game.move(thisTurnMoves[i]);
      bestValue = Math.max(bestValue, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
      game.undo();
      alpha = Math.max(alpha, bestValue);
      if(beta <= alpha) { return bestValue; }
    }
    return bestValue;
  } else {
    let bestValue = 9999;
    for(let i = 0; i < thisTurnMoves.length; i++) {
      game.move(thisTurnMoves[i]);
      bestValue = Math.min(bestValue, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
      game.undo();
      beta = Math.min(beta, bestValue);
      if(beta <= alpha) { return bestValue; }
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

  //console.log(`Best Value: ${bestValue}`);
  return bestMove;
}

function evaluateBoard(board) {
  let totalEval = 0;
  for(let i = 0; i < 8; i++) {
    for(let j = 0; j < 8; j++) {
      totalEval += getPieceValue(board[i][j], i, j);
    }
  }
  return totalEval;
}

function getPieceValue(piece, x, y) {
  if(piece === null) return 0;

  let getAbsoluteValue = function(piece, isWhite, x, y) {
    if(piece.type === 'p') {
      return 10 + (isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x]);
    } else if(piece.type === 'n') {
      return 30 + knightEval[y][x];
    } else if(piece.type === 'b') {
      return 30 + (isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x]);
    } else if(piece.type === 'r') {
      return 50 + (isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x]);
    } else if(piece.type === 'q') {
      return 90 + queenEval[y][x];
    } else if(piece.type === 'k') {
      return 900 + (isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x]);
    }

    throw "Unknown piece type: " + piece.type;
  }

  let absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x, y);
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
}

function clearBoard() {
  computerTurn = false;
  chessBoard.clear();
  game.clear();
  logger.html("");
}

function depthTrigger() {
  searchDepth = Number($(this).text());
  $('#depthSelector').text(searchDepth);
}

function logMove(move, time) {
  let image = `<img class="img-thumbnail" src="img/chesspieces/wikipedia/${move.color}${move.piece.toUpperCase()}.png" style="height: 40px;"/>`;
  let list = `<li class="list-group-item">${image}   <b>From:</b> ${move.from}   | <b>To:</b> ${move.to}`;
    if(time) list += `<span class="float-right"><b>Time:</b> ${time}ms</span>`;
  list += '</li>';
  logger.prepend(list);
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
