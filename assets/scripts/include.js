"use strict";

/* abstract class Consumer
 *   Parameters:
 *     None
 *   Methods:
 *     void consume - grow
 *     void execrete - shrink
 */
class Consumer {
  constructor() {
    //if(new.target === Consumer) throw new TypeError("Cannot construct Consumer instances directly");
    if(this.consume === undefined) throw new TypeError("Must override consume");
    if(this.excrete === undefined) throw new TypeError("Must override excrete");
    window.console.log("Consumer instantiated");
  }
}

class Food extends Consumer {
  constructor(x, y, color) {
    super();
    this.body = new Circle(Food.START_MASS);
    this.position = new Point(x, y);
    this.color = color;
    this.age = 0;
    window.console.log("Food instantiated");
  }
  consume(mass) {
    this.body.area += mass;
  }
  excrete(mass) {
    this.body.area -= mass;
  }
  update(milliseconds) {
    this.age += milliseconds;
    //this.consume(milliseconds / this.age / 1000);
    this.consume(milliseconds / 10000);
  }
  render(camera, context) {
    context.save();
    context.lineWidth = "" + (0.25 * camera.canvasRect.w / camera.viewportRect.w);
    context.fillStyle = this.color.style(true);
    context.strokeStyle = this.color.style(false);
    context.beginPath();
    context.arc((this.position.x - camera.viewportRect.x) * camera.canvasRect.w / camera.viewportRect.w, (this.position.y - camera.viewportRect.y) * camera.canvasRect.h / camera.viewportRect.h, this.body.radius() * camera.canvasRect.w / camera.viewportRect.w, 0, 2 * Math.PI);
    //context.closePath();
    context.fill();
    context.stroke();
    context.restore();
  }
  reset(x, y) {
    this.body.area = Food.START_MASS;
    this.position.x = x;
    this.position.y = y;
    this.color.randomize();
    this.age = 0;
    window.console.log("Food reset");
  }
}
Food.START_MASS = 0.001;

/* class Player
 */
class Player extends Consumer {
  constructor(x, y, mass, color) {
    super();
    this.body = new Circle(mass);
    this.acceleration = new Point(0, 0);
    this.velocity = new Point(0, 0);
    this.position = new Point(x, y);
    this.color = color;
    this.age = 1;
    window.console.log("Player instantiated");
  }
  consume(camera, mass) {
    this.body.area += mass;
    camera.viewportRect.w = 20 * this.body.radius();
    camera.viewportRect.h = 20 * this.body.radius();
    window.console.log("Player.mass(" + this.body.area + ") = Player.mass(" + (this.body.area - mass) + ") + Player.consume(" + mass + ")");
  }
  excrete(camera, mass) {
    this.body.area -= mass;
    camera.viewportRect.w = 20 * this.body.radius();
    camera.viewportRect.h = 20 * this.body.radius();
  }
  update(milliseconds, cursor) {
    this.acceleration.x = cursor.x;
    if(Math.round(this.velocity.x) != 0) {
      (this.velocity.x > 0) ? this.acceleration.x -= Player.FRICTION : this.acceleration.x +=  Player.FRICTION;
    } else if(this.acceleration.x == 0) this.velocity.x = 0;
    this.velocity.x += milliseconds / 1000 * this.acceleration.x;
    if(this.velocity.x > Player.MAX_SPEED) this.velocity.x = Player.MAX_SPEED;
    else if(this.velocity.x < Player.MIN_SPEED) this.velocity.x = Player.MIN_SPEED;
    
    this.position.x += milliseconds / 1000 * this.velocity.x;
    if(this.position.x > Game.WIDTH) this.position.x = this.position.x - Game.WIDTH;
    else if(this.position.x < 0) this.position.x = Game.WIDTH - this.position.x;

    this.acceleration.y = cursor.y;
    if(Math.round(this.velocity.y) != 0) {
      (this.velocity.y > 0) ? this.acceleration.y -= Player.FRICTION : this.acceleration.y +=  Player.FRICTION;
    } else if(this.acceleration.y == 0) this.velocity.y = 0;
    this.velocity.y += milliseconds / 1000 * this.acceleration.y;
    if(this.velocity.y > Player.MAX_SPEED) this.velocity.y = Player.MAX_SPEED;
    else if(this.velocity.y < Player.MIN_SPEED) this.velocity.y = Player.MIN_SPEED;

    this.position.y += milliseconds / 1000 * this.velocity.y;
    if(this.position.y > Game.HEIGHT) this.position.y = this.position.y - Game.HEIGHT;
    else if(this.position.y < 0) this.position.y = Game.HEIGHT - this.position.y;
  }
  render(camera, context) {
    context.save();
    context.lineWidth = "" + (0.5 * camera.canvasRect.w / camera.viewportRect.w);
    context.fillStyle = this.color.style(true);
    context.strokeStyle = this.color.style(false);
    context.beginPath();
    context.arc(camera.canvasRect.w / 2, camera.canvasRect.h / 2, this.body.radius() * camera.canvasRect.w / camera.viewportRect.w, 0, 2 * Math.PI);
    //context.closePath();
    context.fill();
    context.stroke();
    context.restore();
  }
}
Player.MAX_SPEED = 25; // in pixels per second (velocity)
Player.MIN_SPEED = -Player.MAX_SPEED;
Player.FRICTION = 5; // in pixels per second^2 (deceleration)

/* class Background()
 */
class Background {
  constructor(width, height, src, borderColor) {
    this.image = new Image(width, height);
    this.image.width = width;
    this.image.height = height;
    this.image.src = src;
    this.image.ready = false;
    this.image.onload = function() { this.ready = true; };
    this.borderColor = borderColor;
    window.console.log("Background instantiated");
  }
  render(camera, context) {
    context.save();
    //context.lineWidth = "5";
    //context.strokeStyle = "grey";
    context.lineWidth = "" + (3 / 2 * camera.canvasRect.w / camera.viewportRect.w);
    context.lineCap = "round";
    context.strokeStyle = this.borderColor;
    if(this.image.ready) context.drawImage(this.image, camera.viewportRect.x, camera.viewportRect.y, camera.viewportRect.w, camera.viewportRect.h, camera.canvasRect.x, camera.canvasRect.y, camera.canvasRect.w, camera.canvasRect.h);
    context.strokeRect(camera.canvasRect.x, camera.canvasRect.y, camera.canvasRect.w, camera.canvasRect.h);
    context.stroke();
    context.restore();
  }
}

/* class Camera
 */
class Camera {
  constructor(player, canvasWidth, canvasHeight, worldWidth, worldHeight) {
    // player that should be followed
    this.player = player;
    // rectangle that represents the canvas
		this.canvasRect = new Rectangle(0, 0, canvasWidth, canvasHeight);
    // rectangle that represents the viewport
		this.viewportRect = new Rectangle(this.player.position.x - 20 * this.player.body.radius() / 2, this.player.position.y - 20 * this.player.body.radius() / 2, 20 * this.player.body.radius(), 20 * this.player.body.radius());
    // rectangle that represents the world's boundary (room's boundary)
		this.worldRect = new Rectangle(0, 0, worldWidth, worldHeight);
    window.console.log("Camera instantiated");
  }
  update() {
    // keep following the player (or other desired object)
    this.viewportRect.x = this.player.position.x - this.viewportRect.w / 2;
    this.viewportRect.y = this.player.position.y - this.viewportRect.h / 2;
  }
  refreshViewport() {
		this.viewportRect = new Rectangle(this.player.position.x - 20 * this.player.body.radius() / 2, this.player.position.y - 20 * this.player.body.radius() / 2, 20 * this.player.body.radius(), 20 * this.player.body.radius());
    window.console.log("Camera's viewportRect has been reinstantiated");
  }
}

class Cursor {
  constructor(position, color, radius) {
    this.position = position;
    this.color = color;
    this.radius = radius;
    window.console.log("Cursor instantiated");
  }
  render(camera, context) {
    context.save();
    context.lineWidth = 5;
    context.fillStyle = this.color.style(true);
    context.strokeStyle = this.color.style(false);
    context.beginPath();
    context.arc(camera.canvasRect.w / 2 * this.position.x / Cursor.MAX + camera.canvasRect.w / 2, camera.canvasRect.h / 2 * this.position.y / Cursor.MAX + camera.canvasRect.h / 2, this.radius, 0, 2 * Math.PI);
    //context.closePath();
    context.fill();
    context.stroke();
    context.restore();
  }
}
Cursor.MAX = 50;
Cursor.MIN = -Cursor.MAX;

var debug = function(game) {
  game.context.save();
  game.context.font = "24px lato-hairline";
  game.context.textAlign = "center";
  game.context.textBaseline = "alphabetic";
  game.context.fillStyle = "white";
  game.context.fillText("Canvas: (" + Math.round(game.camera.canvasRect.x) + ", " + Math.round(game.camera.canvasRect.y) + ", " + Math.round(game.camera.canvasRect.w) + ", " + Math.round(game.camera.canvasRect.h) + ")", game.camera.canvasRect.w * 3 / 10, game.camera.canvasRect.h * 4 / 10);
  game.context.fillText("Viewport: (" + Math.round(game.camera.viewportRect.x) + ", " + Math.round(game.camera.viewportRect.y) + ", " + Math.round(game.camera.viewportRect.w) + ", " + Math.round(game.camera.viewportRect.h) + ")", game.camera.canvasRect.w * 3 / 10, game.camera.canvasRect.h * 5 / 10);
  game.context.fillText("Cursor: (" + Math.round(game.cursor.position.x) + ", " + Math.round(game.cursor.position.y) + ")", game.camera.canvasRect.w * 3 / 10, game.camera.canvasRect.h * 6 / 10);
  game.context.fillText("Player: (" + Math.round(game.player.position.x) + ", " + Math.round(game.player.position.y) + ")", game.camera.canvasRect.w * 3 / 10, game.camera.canvasRect.h * 7 / 10);
  game.context.fillText("Velocity: (" + Math.round(game.player.velocity.x) + ", " + Math.round(game.player.velocity.y) + ")", game.camera.canvasRect.w * 3 / 10, game.camera.canvasRect.h * 8 / 10);
  game.context.fillText("Accel: (" + Math.round(game.player.acceleration.x) + ", " + Math.round(game.player.acceleration.y) + ")", game.camera.canvasRect.w * 3 / 10, game.camera.canvasRect.h * 9 / 10);
  game.context.fill();
  game.context.restore();
};

/* class Game()
 */
class Game {
  constructor(canvas, canvasWidth, canvasHeight) {
    this.context = canvas.getContext("2d");
    this.player = new Player(Game.WIDTH / 2, Game.HEIGHT / 2, 5, new Color(true));
    this.cursor = new Cursor(new Point(0, 0), new Color(true), 5);
    //this.background = new Background(Game.WIDTH, Game.HEIGHT, "./assets/images/antennae.jpg");
    this.background = new Background(Game.WIDTH, Game.HEIGHT, "./assets/images/background.png", this.player.color.style(false));
    this.camera = new Camera(this.player, canvasWidth, canvasHeight, Game.WIDTH, Game.HEIGHT);
    this.food = [];
    for(var i = 0; i < 1000; i++) {
      this.food[i] = new Food(Math.round(Math.random() * Game.WIDTH), Math.round(Math.random() * Game.HEIGHT), new Color(true));
    }
    this.now = Date.now();
    this.then = Date.now();
    this.delta = this.now - this.then;
    // Change background color
    window.document.getElementsByTagName("body")[0].style.backgroundColor = this.player.color.style(true);
    window.console.log("Game instantiated");
  }
  render() {
    //this.context.clearRect(0, 0, this.camera.canvasRect.w, this.camera.canvasRect.h);
    // Save the state, so we can undo the clipping
    this.context.save();
    // Create a circle
    this.context.beginPath();
    this.context.arc(this.camera.canvasRect.w/2, this.camera.canvasRect.h/2, Math.min(this.camera.canvasRect.w, this.camera.canvasRect.h)/2, 0, Math.PI * 2);
    // Clip to the current path
    this.context.clip();
    // Draw on canvas
    this.background.render(this.camera, this.context);
    for(var i = 0; i < this.food.length; i++) {
      let x = this.food[i].position.x;
      let y = this.food[i].position.y;
      if(this.food[i].body.within(x, y, this.camera.viewportRect)) {
        // detected food in viewport
        this.food[i].render(this.camera, this.context);
        if(this.food[i].position.x >= this.player.position.x - this.player.body.radius() &&
            this.food[i].position.x <= this.player.position.x + this.player.body.radius() &&
            this.food[i].position.y >= this.player.position.y - this.player.body.radius() &&
            this.food[i].position.y <= this.player.position.y + this.player.body.radius()) {
          // detected collision between food and player
          this.player.consume(this.camera, this.food[i].body.mass());
          this.food[i].reset(Math.round(Math.random() * Game.WIDTH), Math.round(Math.random() * Game.HEIGHT));
          window.console.log("Food consumed");
        }
      }
    }
    this.player.render(this.camera, this.context);
    this.cursor.render(this.camera, this.context);
    //debug(this);
    // Undo the clipping
    this.context.restore();
  }
  update(milliseconds) {
    this.player.update(milliseconds, this.cursor.position);
    for(var i = 0; i < this.food.length; i++) {
      this.food[i].update(milliseconds);
    }
    this.camera.update();
  }
  /*
  play() {
    this.now = Date.now();
    this.delta = this.now - this.then;
    this.update(this.delta);
    this.render();
    this.then = this.now;
    window.requestAnimationFrame(this.play);
  }
  start() {
    this.then = Date.now;
    this.play();
  }*/
}
//Game.WIDTH = 1600 * 2;
//Game.HEIGHT = 1000 * 2;
Game.WIDTH = 3377;
Game.HEIGHT = 1899;
