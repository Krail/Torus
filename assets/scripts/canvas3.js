// Create the canvas.
var canvas = window.document.getElementById("canvas");
var context = canvas.getContext("2d");

// Create the width and height attribute of the canvas element. 
if(window.innerWidth == Math.min(window.innerWidth, window.innerHeight)) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerWidth;
} else {
  canvas.width = window.innerHeight;
  canvas.height = window.innerHeight;
}

var game = new Game(canvas);

/* function resize()
 */
var resize = function() {
  if(window.innerWidth == Math.min(window.innerWidth, window.innerHeight)) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerWidth;
  } else {
    canvas.width = window.innerHeight;
    canvas.height = window.innerHeight;
  }
};
//resize();

var background = new Background(game);

window.addEventListener("mousemove", function (e) {
    game.cursor.x = e.clientX;
    game.cursor.y = e.clientY;
    if(canvas.width == window.innerWidth) {
      if(game.cursor.y < (window.innerHeight - canvas.height) / 2) {
        game.cursor.y = 0;
      } else if(game.cursor.y > (window.innerHeight - canvas.height) / 2 + canvas.height) {
        game.cursor.y = canvas.height;
      } else game.cursor.y -= (window.innerHeight - canvas.height) / 2;
    } else {
      if(game.cursor.x < (window.innerWidth - canvas.width) / 2) {
        game.cursor.x = 0;
      } else if(game.cursor.x > (window.innerWidth - canvas.width) / 2 + canvas.width) {
        game.cursor.x = canvas.width;
      } else game.cursor.x -= (window.innerWidth - canvas.width) / 2;
    }
//  	keysDown[e.keyCode] = true;
//    window.console.log("Cursor position: (" + game.cursor.x + ", " + game.cursor.y + ")");
  }, false);

/* function update()
 *   Parameter:
 *     float modifier - milliseconds since last update.
 */
var update = function(modifier) {
  game.player.update(modifier, canvas, game);
};

/* function render()
 */
var render = function () {
  context.clearRect(0, 0, canvas.width, canvas.height);
  background.render(context);
  game.player.body.render(canvas, context);
};

// The Main Game Loop
var then;
var main = function () {
  var now = Date.now();
  var delta = now - then;
  update(delta);
  render();
  then = now;
  window.requestAnimationFrame(main);
};

// Start the Game
then = Date.now();
main();