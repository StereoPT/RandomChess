var chessBoard;
var game;
var play = false;

let chessParams = { draggable: true, dropOffBoard: 'trash', sparePieces: true };

function setup() {
  frameRate(1.5);
  chessBoard = ChessBoard('chessBoard', chessParams);

  $('#startBoard').click(startBoard());
  $('#clearBoard').click(clearBoard());
}

function draw() {
  if(play) makeRandomMove();
}

function makeRandomMove() {
  let possibleMoves = game.moves();
  if(game.game_over() === true || game.in_draw() === true || possibleMoves.length === 0) return;

  let randomIndex = Math.floor(Math.random() * possibleMoves.length);
  game.move(possibleMoves[randomIndex]);
  chessBoard.position(game.fen());
}

function startBoard() {
  play = true;
  chessBoard.start();
  game = new Chess();
}

function clearBoard() {
  play = false;
  chessBoard.clear();
  game.clear();
}
