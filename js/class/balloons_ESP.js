class BalloonsESP extends Balloons {
  constructor(
    CTX,
    canvasDOM,
    radius,
    size,
    speed,
    direcctionX,
    direcctionY,
    position,
    floorPosY,
    balloonID,
    colors,
    colDetect,
    timeCol
  ) {
    super(
      CTX,
      canvasDOM,
      radius,
      size,
      speed,
      direcctionX,
      direcctionY,
      position,
      floorPosY,
      balloonID,
      colors,
      colDetect,
      timeCol
    );
  }

  moveBalloons() {
    this.checkBordersX() ? (this.direcctionX = this.direcctionX * -1) : null;
    this.checkBordersY() ? (this.direcctionY = this.direcctionY * -1) : null;
    this.position.Y += this.speed.Y * this.direcctionY;
    this.position.X += this.speed.X * this.direcctionX;
    this.checkBorderDown();
  }
  checkBorderDown() {
    if (
      this.position.Y + this.radius + this.floorPosY >
      this.canvasDOM.height
    ) {
      gameManager.colorNumber = this.colorNumber;
    }
  }
  drawBalloons() {
    this.moveBalloons();
    this.CTX.beginPath();
    this.CTX.arc(this.position.X, this.position.Y, this.radius, 0, 2 * Math.PI);
    this.CTX.fillStyle = this.colors[this.colorNumber];
    this.CTX.fill();
    this.CTX.fillStyle = "black";
    this.CTX.stroke();
  }
}
