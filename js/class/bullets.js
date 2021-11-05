class Bullets {
  constructor(CTX, canvasDOM, posX, posY, speed, color, bulletID, player) {
    this.CTX = CTX;
    this.canvasDOM = canvasDOM;
    this.pos = {
      X: posX,
      Y: posY,
    };
    this.speed = speed;
    this.direction = -1;
    this.color = color;
    this.width = 5;
    this.height = 20;
    this.bulletID = bulletID;
    this.player = player;
  }

  drawBullets() {
    this.moveBullets();
    this.CTX.fillStyle = this.color;
    this.CTX.fillRect(this.pos.X + 15, this.pos.Y + 5, this.width, this.height);
  }
  moveBullets() {
    this.pos.Y += this.speed * this.direction;
    this.checkLimits();
  }

  checkLimits() {
    if (this.pos.Y + this.height < 0) {
      this.player.removeBullet(this);
    }
  }
}
