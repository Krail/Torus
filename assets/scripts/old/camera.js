/* class Camera
 */
class Camera {
  constructor(/*optional*/xView, /*optional*/yView, canvasWidth, canvasHeight, worldWidth, worldHeight) {
    // position of camera (top-left coordinate)
		this.xView = xView || 0;
		this.yView = yView || 0;
    // distance from followed object to border before camera starts move
		this.xDeadZone = 0; // min distance to horizontal borders
		this.yDeadZone = 0; // min distance to vertical borders
    // viewport dimensions
		this.wView = canvasWidth;
		this.hView = canvasHeight;
    // allow camera to move in vertical and horizontal axis
		this.axis = AXIS.BOTH;
    // object that should be followed
    this.followed = null;
    // rectangle that represents the viewport
		this.viewportRect = new Rectangle(this.xView, this.yView, this.wView, this.hView);
    // rectangle that represents the world's boundary (room's boundary)
		this.worldRect = new Rectangle(0, 0, worldWidth, worldHeight);
    window.console.log("Camera instantiated");
  }
  follow(player, xDeadZone, yDeadZone) {
    this.followed = player;
    this.xDeadZone = xDeadZone;
    this.yDeadZone = yDeadZone;
  }
  update() {
    // keep following the player (or other desired object)
    if(this.followed != null) {
      if(this.axis == AXIS.HORIZONTAL || this.axis == AXIS.BOTH) {
        // moves camera on horizontal axis based on followed object position
        if(this.followed.x - this.xView  + this.xDeadZone > this.wView)
            this.xView = this.followed.x - (this.wView - this.xDeadZone);
        else if(this.followed.x  - this.xDeadZone < this.xView)
            this.xView = this.followed.x  - this.xDeadZone;
      }
      if(this.axis == AXIS.VERTICAL || this.axis == AXIS.BOTH) {
        // moves camera on vertical axis based on followed object position
        if(this.followed.y - this.yView + this.yDeadZone > this.hView)
            this.yView = this.followed.y - (this.hView - this.yDeadZone);
        else if(this.followed.y - this.yDeadZone < this.yView)
          this.yView = this.followed.y - this.yDeadZone;
      }
    }
    // update viewportRect
    this.viewportRect.x = this.xView;
    this.viewportRect.y = this.yView;
		// don't let camera leaves the world's boundary
		if(!this.viewportRect.within(this.worldRect)) {
      if(this.viewportRect.x < this.worldRect.x)
          this.xView = this.worldRect.x;
      if(this.viewportRect.y < this.worldRect.y)
					this.yView = this.worldRect.y;
      if(this.viewportRect.x + this.viewportRect.w > this.worldRect.x + this.worldRect.w)
          this.xView = this.worldRect.x + this.worldRect.w - this.wView;
      if(this.viewportRect.y + this.viewportRect.h > this.worldRect.y + this.worldRect.h)
          this.yView = this.worldRect.y + this.worldRect.h - this.hView;
    }
  }
}