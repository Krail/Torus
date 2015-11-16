// Create the canvas.
var canvas = window.document.getElementById("canvas");

// Back when it was 16:9, now it is a circle!
//if(Math.min(window.innerWidth, window.innerHeight * 9 / 16) == window.innerWidth) {
//  canvas.setAttribute("width", window.innerWidth);
//  canvas.setAttribute("height", window.innerWidth  * 9 / 16);
//} else {
//  canvas.setAttribute("width", window.innerHeight * 16 / 9);
//  canvas.setAttribute("height", window.innerHeight);
//}
if(Math.min(window.innerWidth, window.innerHeight) == window.innerWidth) {
  canvas.setAttribute("width", window.innerWidth);
  canvas.setAttribute("height", window.innerWidth);
} else {
  canvas.setAttribute("width", window.innerHeight);
  canvas.setAttribute("height", window.innerHeight);
}

var game = new Game(canvas, canvas.getAttribute("width"), canvas.getAttribute("height"));

window.addEventListener("mousemove", function (e) {
    game.cursor.position.x = e.pageX - window.innerWidth / 2;
    game.cursor.position.y = e.pageY - window.innerHeight / 2;
    if(Math.abs(game.cursor.position.x) > game.camera.canvasRect.w / 2) {
      (game.cursor.position.x > 0) ? game.cursor.position.x = game.camera.canvasRect.w / 2 : game.cursor.position.x = -game.camera.canvasRect.w / 2;
    }
    if(Math.abs(game.cursor.position.y) > game.camera.canvasRect.h / 2) {
      (game.cursor.position.y > 0) ? game.cursor.position.y = game.camera.canvasRect.h / 2 : game.cursor.position.y = -game.camera.canvasRect.h / 2;
    }
    if(Math.abs(game.cursor.position.x) < game.player.body.radius() * game.camera.canvasRect.w / game.camera.viewportRect.w &&
       Math.abs(game.cursor.position.y) < game.player.body.radius() * game.camera.canvasRect.h / game.camera.viewportRect.h) {
      game.cursor.position.x = 0;
      game.cursor.position.y = 0;
    }
    game.cursor.position.x = game.cursor.position.x / (game.camera.canvasRect.w / 2 / Cursor.MAX);
    game.cursor.position.y = game.cursor.position.y / (game.camera.canvasRect.h / 2 / Cursor.MAX);
}, false);

/* function resize()
 */
var resize = function() {
  if(Math.min(window.innerWidth, window.innerHeight) == window.innerWidth) {
    game.camera.canvasRect.w = window.innerWidth;
    game.camera.canvasRect.h = window.innerWidth;
  } else {
    game.camera.canvasRect.w = window.innerHeight;
    game.camera.canvasRect.h = window.innerHeight;
  }
  canvas.setAttribute("width", game.camera.canvasRect.w);
  canvas.setAttribute("height", game.camera.canvasRect.h);
  game.camera.refreshViewport();
};
resize();

//game.start();

// The Main Game Loop
var then;
var main = function () {
  var now = Date.now();
  var delta = now - then;
  game.update(delta);
  game.render();
  then = now;
  window.requestAnimationFrame(main);
};

// Start the Game
then = Date.now();
main();

// Go Fullscreen
function fullscreen() {
  var body = window.document.getElementsByTagName("body")[0];
  if (body.requestFullscreen) body.requestFullscreen();
  else if (body.msRequestFullscreen) body.msRequestFullscreen();
  else if (body.mozRequestFullScreen) body.mozRequestFullScreen();
  else if (body.webkitRequestFullscreen) body.webkitRequestFullscreen();
}
