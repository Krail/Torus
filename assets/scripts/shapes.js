"use strict";

/* class Point(x, y)
 *   Parameters:
 *     int x - x coordinate
 *     int y - y coordinate
 */
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    window.console.log("Point instantiated");
  }
  distanceFrom(that) {
    // d = sqrt[ (x-x0)^2 + (y-y0)^2 ]
    return Math.sqrt(Math.pow((this.x - that.x), 2) + Math.pow((this.y - that.y), 2));
  }
  magnitude() {
    return this.distanceFrom(new Point(0, 0));
  }
}

/* class Line(start, end)
 *   Parameters:
 *     Point start - starting point
 *     Poing end - ending point
 */
class Line {
  constructor(start, end) {
    this.start = start;
    this.end = end;
    window.console.log("Line instantiated");
  }
  isParallel(that) {
    var thisSlope = (this.end.y - this.start.y) / (this.end.x - this.start.x);
    var thatSlope = (that.end.y - that.start.y) / (that.end.x - that.start.x);
    return (thisSlope == thatSlope);
  }
  makePerpendicular() {
    // m = -1 / m0
    // b = y - mx
    // y = mx + b
    // x = (y-b) / m
    var m = - (this.end.x - this.start.x) / (this.end.y - this.start.y);
    var b = this.start.y - m * this.start.x;
    if(this.start.x == this.end.x) {
      return new Line(new Point(this.start.x, this.start.y), new Point((this.end.y-b)/m, this.end.y));
    } else { return new Line(new Point(this.start.x, this.start.y), new Point(this.end.x, m*this.end.x+b)); }
  }
}

/* abstract class Shape
 *   no parameters
 */
class Shape {
  constructor() {
    //if(new.target === Shape) throw new TypeError("Cannot construct Shape instances directly");
    //if(this.render === undefined) throw new TypeError("Must override render");
    if(this.mass === undefined) throw new TypeError("Must override mass");
    window.console.log("Shape instantiated");
  }
}

/* class Rectangle extends Shape
 *   Parameters:
 *     int x - left side
 *     int y - top side
 *     int w - width
 *     int h - height
 */
class Rectangle extends Shape {
  constructor(x, y, w, h) {
    super();
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    window.console.log("Rectangle instantiated");
  }
  mass() {
    return this.w * this.h;
  }
  within(rect) {
    return (rect.x <= this.x &&
            rect.x + rect.w >= this.x + this.w &&
            rect.y <= this.y &&
            rect.y + rect.h >= this.y + this.h);
  }
}

/* class Circle extends Shape
 *   Parameters:
 *     int r - radius
 */
class Circle extends Shape {
  constructor(area) {
    super();
    this.area = area;
    window.console.log("Circle instantiated");
  }
  radius() {
    return Math.sqrt(this.area / Math.PI);
  }
  mass() {
    return Math.PI * Math.pow(this.radius(), 2);
  }
  within(x, y, rect) {
    return (rect.x <= x + this.radius() &&
            rect.x + rect.w >= x - this.radius() &&
            rect.y <= y + this.radius() &&
            rect.y + rect.h >= y - this.radius());
  }
}

/* class RegularPolygon(centerPoint, vertexRadius, rotation, numVertices)
 *   Parameters:
 *     Point centerPoint - center point of this polygon.
 *     int vertexRadius - distance from the center point to any vertex.
 *     float rotation - (0 to 2pi) Represents the rotation of the polygon.
 *     int numVertices (>2) - number of sides/vertices.
 */
class RegularPolygon extends Shape {
  constructor(centerPoint, vertexRadius, rotation, numVertices) {
    super();
    this.center = centerPoint;
    this.outerRadius = vertexRadius;
    this.theta = rotation;
    this.vertices = [];
    var dtheta = 2 * Math.PI / numVertices;
    for(var i = 0; i < numVertices; i++) {
      this.vertices[i] = new Point(
        this.outerRadius * Math.cos(this.theta + i * dtheta) + this.center.x,
        this.outerRadius * Math.sin(this.theta + i * dtheta) + this.center.y
      );
    }
    this.innerRadius = Math.sqrt(Math.pow(this.outerRadius, 2) - Math.pow((1 / 2) * this.vertices[0].distanceFrom(this.vertices[1]), 2));
    this.red = Math.round(Math.random() * 255);
    this.green = Math.round(Math.random() * 255);
    this.blue = Math.round(Math.random() * 255);
    while(this.red + this.green + this.blue > 400) {
      this.red = Math.round(Math.random() * 255);
      this.green = Math.round(Math.random() * 255);
      this.blue = Math.round(Math.random() * 255);
    }
    window.console.log("Polygon instantiated");
  }
  render(context) {
    context.save();
    context.beginPath();
    context.moveTo(this.vertices[0].x, this.vertices[0].y);
    var i;
    for(i = 1; i < this.vertices.length; i++) {
      context.lineTo(this.vertices[i].x, this.vertices[i].y);
    }
    context.closePath();
    context.lineWidth = "5";
    context.lineJoin = 'round';
    context.fillStyle = "rgb(" + this.red + ", " + this.green + ", " + this.blue + ")";
    context.fill();
    context.strokeStyle = "rgb(" + Math.round((255-this.red)/2 + this.red) + ", " + Math.round((255-this.green)/2 + this.green) + ", " + Math.round((255-this.blue)/2 + this.blue) + ")";
    context.stroke();
    context.restore();
  }
  mass() {
    return this.vertices.length * Math.pow(this.innerRadius, 2) * Math.tan(Math.PI / this.vertices.length);
  }
  rotate(radians) {
    this.theta += radians;
    var dtheta = 2 * Math.PI / this.vertices.length;
    for(var i = 0; i < this.vertices.length; i++) {
      this.vertices[i].x = this.radius * Math.cos(this.theta + i * dtheta) + this.center.x;
      this.vertices[i].y = this.radius * Math.sin(this.theta + i * dtheta) + this.center.y;
    }
  }
  move(x, y) {
    this.center.x = x;
    this.center.y = y;
    var dtheta = 2 * Math.PI / this.vertices.length;
    for(var i = 0; i < this.vertices.length; i++) {
      this.vertices[i].x = this.radius * Math.cos(this.theta + i * dtheta) + this.center.x;
      this.vertices[i].y = this.radius * Math.sin(this.theta + i * dtheta) + this.center.y;
    }
  }
}

class Color {
  constructor(light) {
    this.light = light;
    this.red = Math.round(Math.random() * 255);
    this.green = Math.round(Math.random() * 255);
    this.blue = Math.round(Math.random() * 255);
    if(this.light) {
      while(this.red + this.green + this.blue > 255 * 3 / 2) {
        this.red = Math.round(Math.random() * 255);
        this.green = Math.round(Math.random() * 255);
        this.blue = Math.round(Math.random() * 255);
      }
    } else {
      while(this.red + this.green + this.blue < 255 * 3 / 2) {
        this.red = Math.round(Math.random() * 255);
        this.green = Math.round(Math.random() * 255);
        this.blue = Math.round(Math.random() * 255);
      }
    }
  }
  randomize() {
    if(this.light) {
      while(this.red + this.green + this.blue > 255 * 3 / 2) {
        this.red = Math.round(Math.random() * 255);
        this.green = Math.round(Math.random() * 255);
        this.blue = Math.round(Math.random() * 255);
      }
    } else {
      while(this.red + this.green + this.blue < 255 * 3 / 2) {
        this.red = Math.round(Math.random() * 255);
        this.green = Math.round(Math.random() * 255);
        this.blue = Math.round(Math.random() * 255);
      }
    }
  }
  style(light) {
    if(light) return "rgb(" + this.red + ", " + this.green + ", " + this.blue + ")";
    else return"rgb(" + Math.round((255-this.red)/2 + this.red) + ", " + Math.round((255-this.green)/2 + this.green) + ", " + Math.round((255-this.blue)/2 + this.blue) + ")";
  }
}