$(document).ready(function() {
  var chessBoard = ChessBoard('chessBoard', { draggable: true, dropOffBoard: 'trash', sparePieces: true });
  var game = new Chess();
  var timeout;

  var makeRandomMove = function() {
    let possibleMoves = game.moves();
    if(game.game_over() === true || game.in_draw() === true || possibleMoves.length === 0) return;

    let randomIndex = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIndex]);
    chessBoard.position(game.fen());

    timeout = window.setTimeout(makeRandomMove, 500);
  };

  $('#startBoard').click(function() {
    game = new Chess();
    chessBoard.start();
    timeout = window.setTimeout(makeRandomMove, 500);
  });
  $('#clearBoard').click(function() {
    chessBoard.clear();
    game = new Chess();
    window.clearTimeout(timeout);
  });
});
