class Balloons {
  constructor(CTX, canvasDOM, colorNumber, speedX, floorPosY, balloonID) {
    this.CTX = CTX;
    this.canvasDOM = canvasDOM;
    this.radius = 35;
    this.size = {
      height: 2 * this.radius,
      width: 2 * this.radius,
    };
    this.speed = {
      X: speedX,
      Y: Math.round(Math.random() * 4 + 1),
    };
    this.direcctionX = Math.round(Math.random() * 2 - 1) === 0 ? -1 : 1;
    this.direcctionY = 1;
    this.position = {
      Y: -this.radius,
      X: Math.floor(
        Math.random() * this.canvasDOM.width - this.size.width + this.size.width
      ),
    };
    this.floorPosY = floorPosY;
    this.balloonID = balloonID;
    this.colors = [
      "rgba(186, 5, 236)",
      "rgba(229, 235, 7)",
      "rgba(30, 197, 0)",
      "rgba(0, 33, 197)",
      "white",
    ];
    this.colorNumber = colorNumber;
    this.colDetect = false;
    this.timeCol = gameManager.currentTime;
  }
  drawBalloons(colorNumber) {
    this.moveBalloons();
    this.CTX.beginPath();
    this.CTX.arc(this.position.X, this.position.Y, this.radius, 0, 2 * Math.PI);
    this.CTX.fillStyle = this.colors[colorNumber];
    this.CTX.fill();
    this.CTX.fillStyle = "black";
    this.CTX.stroke();
  }
  moveBalloons() {
    this.checkBordersX() ? (this.direcctionX = this.direcctionX * -1) : null;
    this.checkBordersY() ? (this.direcctionY = this.direcctionY * -1) : null;
    this.position.Y += this.speed.Y * this.direcctionY;
    this.position.X += this.speed.X * this.direcctionX;
  }
  checkBordersX() {
    return (this.position.X > this.canvasDOM.width - this.radius &&
      this.direcctionX === 1) ||
      (this.position.X - this.radius < 0 && this.direcctionX === -1)
      ? true
      : false;
  }
  checkBordersY() {
    return (this.position.Y + this.floorPosY >
      this.canvasDOM.height - this.radius &&
      this.direcctionY === 1) ||
      (this.position.Y - this.radius < 0 && this.direcctionY === -1)
      ? true
      : false;
  }
}
