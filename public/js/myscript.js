var chessBoard;
var game;
var computerTurn = false;
var logger;

//{ captured, color, flags, from, piece, san, to }
function setup() {
  frameRate(0.5);
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
}

function draw() {
  if(computerTurn) {
    if(game.game_over() === true || game.in_draw() === true || game.moves().length === 0) {
      alert("Game Over!");
    };
    makeRandomMove();
  }
}

function makeRandomMove() {
  let possibleMoves = game.moves();

  let randomIndex = Math.floor(Math.random() * possibleMoves.length);
  let theMove = game.move(possibleMoves[randomIndex]);
  chessBoard.position(game.fen());

  gameLog(theMove);
  computerTurn = false;
}

function startBoard() {
  chessBoard.start();
}

function clearBoard() {
  computerTurn = false;
  chessBoard.clear();
  game.clear();
  logger.html("");
}

function gameLog(move) {
  let image = `<img class="img-thumbnail" src="img/chesspieces/wikipedia/${move.color}${move.piece.toUpperCase()}.png" style="height: 40px;"/>`;
  logger.prepend(`<li class="list-group-item">${image}   <b>From:</b> ${move.from}   | <b>To:</b> ${move.to}</li>`);
}

var onDragStart = function(source, piece, position, orientation) {
  if(game.in_checkmate() === true || game.in_draw() === true || piece.search(/^b/) !== -1) {
    return false;
  }
};

var onDrop = function(source, target) {
  let move = game.move({ from: source, to: target, promotion: 'q'});
  removeSquares();
  if(move === null) { return 'snapback'; }
  gameLog(move);
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
  console.log("onMouseoutSquare");
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
