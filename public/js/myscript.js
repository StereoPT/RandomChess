var chessBoard;
var game;
var play = false;
var logger;

let chessParams = { draggable: true, dropOffBoard: 'trash', sparePieces: true };

//{ captured, color, flags, from, piece, san, to }
function setup() {
  frameRate(1);
  noCanvas();
  chessBoard = ChessBoard('chessBoard', chessParams);
  game = new Chess();
  logger = $('#logger');

  $('#startBoard').click(startBoard);
  $('#clearBoard').click(clearBoard);
}

function draw() {
  if(play) makeRandomMove();
}

function makeRandomMove() {
  let possibleMoves = game.moves();
  if(game.game_over() === true || game.in_draw() === true || possibleMoves.length === 0) return;

  let randomIndex = Math.floor(Math.random() * possibleMoves.length);
  let theMove = game.move(possibleMoves[randomIndex]);
  chessBoard.position(game.fen());
  gameLog(theMove);
}

function startBoard() {
  play = true;
  chessBoard.start();
}

function clearBoard() {
  play = false;
  chessBoard.clear();
  game.clear();
  logger.html("");
}

function gameLog(move) {
  logger.prepend(`<p>${move.color} Turn - Moved: ${move.piece}   | From: ${move.from}   | To: ${move.to}</p>`);
}
