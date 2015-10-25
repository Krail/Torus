// 1. Create the canvas
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var then = Date.now();

// 2. Include images
var background = {
  ready: false
};
background.image = new Image();
background.image.src = "./assets/images/antennae.jpg";
background.image.onload = function () {
  background.ready = true;
};
background.render = function () {
  if (background.ready) context.drawImage(background.image, 0, 0);
};

// 3. Game Objects
var Point = function(x, y) {
  this.x = x;
  this.y = y;
};
var Shape = function(points) {
  this.numSides = points.length;
  this.points = points;
  var i;
};
var Food = function () {
  this.x = Math.random() * canvas.width;
  this.y = Math.random() * canvas.height;
  this.side = Math.round(Math.random() * 4 + 1);
  this.mass = this.side * this.side;
  this.red = Math.round(Math.random() * 255);
  this.green = Math.round(Math.random() * 255);
  this.blue = Math.round(Math.random() * 255);
};
Food.prototype.render = function () {
  context.fillStyle = "rgb(" + this.red + ", " + this.green + ", " + this.blue + ")";
  context.fillRect(this.x - this.side / 2, this.y - this.side / 2, this.side, this.side);
};
var food = [], i;
for (i = 0; i < 5000; i++) {
  food[i] = new Food();
}
var playerUID = 0;
var Player = function (name, x, y) {
  this.uid = playerUID++;
  this.name = name;
  this.mass = 50;
  this.speed = 100; // pixels per second
  this.x = x;
  this.y = y;
  this.side = Math.round(Math.sqrt(this.mass));
  this.red = Math.round(Math.random() * 255);
  this.green = Math.round(Math.random() * 255);
  this.blue = Math.round(Math.random() * 255);
  this.foodEaten = 0;
  console.log("Player " + this.uid + " Instantiated.");
};
Player.prototype.render = function () {
  context.fillStyle = "rgb(" + this.red + ", " + this.green + ", " + this.blue + ")";
  context.strokeStyle = "rgb(" + this.red + ", " + this.green + ", " + this.blue + ")";
  context.fillRect(this.x - this.side / 2, this.y - this.side / 2, this.side, this.side);
  context.strokeRect(this.x - 5 * this.side, this.y - 5 * this.side, 10 * this.side, 10 * this.side);
};
Player.prototype.collision = function (x, y, s) {
  if (this.x - this.side / 2 > x + s / 2
     || this.x + this.side / 2 < x - s / 2
     || this.y - this.side / 2 > y + s / 2
     || this.y + this.side / 2 < y - s / 2) return false;
  else return true;
};
var player = new Player("User", 0, 0);

// 4. Player Input
var keysDown = {};
window.addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
}, false);
window.addEventListener("keyup", function (e) {
  delete keysDown[e.keyCode];
}, false);

// 5. New Game
var resetPlayer = function () {
  player.x = canvas.width / 2;
  player.y = canvas.height / 2;
  player.mass = 50;
  player.side = Math.round(Math.sqrt(player.mass));
};
var reset = function () {
  resetPlayer();
  then = Date.now();
};

// 6. Update Objects
var update = function (modifier) {
  if (38 in keysDown && player.y > player.side / 2) { // UP key
    player.y -= player.speed * modifier;
    if (player.y < player.side / 2) player.y = player.side / 2;
  }
  if (40 in keysDown && player.y < canvas.height - player.side / 2) { // DOWN key
    player.y += player.speed * modifier;
    if (player.y > canvas.height - player.side / 2) player.y = canvas.height - player.side / 2;
  }
  if (37 in keysDown && player.x > player.side / 2) { // LEFT key
    player.x -= player.speed * modifier;
    if (player.x <  player.side / 2) player.x = player.side / 2;
  }
  if (39 in keysDown && player.x < canvas.width - player.side / 2) { // RIGHT key
    player.x += player.speed * modifier;
    if (player.x > canvas.width - player.side / 2) player.x = canvas.width - player.side / 2;
  }
  var i;
  for (i = 0; i < food.length; i++) {
    if (player.collision(food[i].x, food[i].y, food[i].side) && player.mass > 2 * food[i].mass) {
      player.foodEaten++;
      player.mass += food[i].mass;
      player.side = Math.round(Math.sqrt(player.mass));
      food[i] = new Food();
    }
  }
};

var drawText = function () {
  context.fillStyle = "rgb(255, 200, 255)";
  context.font = "24px lato-hairline";
  context.textAlign = "center";
  context.textBaseline = "alphabetic";
  context.fillText("# of Blocks Eaten: " + player.foodEaten, canvas.width / 2, canvas.height * 2 / 20);
  context.textAlign = "start";
  context.fillText("speed: " + Math.round(player.speed), canvas.width / 20, canvas.height * 2 / 20);
  context.fillText("x: " + Math.round(player.x), canvas.width / 20, canvas.height * 3 / 20);
  context.fillText("y: " + Math.round(player.y), canvas.width / 20, canvas.height * 4 / 20);
  context.fillText("Mass " + player.mass, canvas.width / 20, canvas.height * 5 / 20);
};
  
// 7. Render Objects
var render = function () {
  context.clearRect(0, 0, canvas.width, canvas.height);
  background.render();
  drawText();
  var i;
  for (i = 0; i < food.length; i++) {
    food[i].render();
  }
  if (player.mass > 100000) resetPlayer();
  player.render();
};
  
// 8. The Main Game Loop
var main = function () {
  var now = Date.now();
  var delta = now - then;
  update(delta / 1000);
  render();
  then = now;
  window.requestAnimationFrame(main);
};

// 10. Start the Game
reset();
main();