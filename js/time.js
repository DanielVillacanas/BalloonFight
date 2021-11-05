class Timer {
  constructor(CTX, canvasDOM, FPS, currentTime, stringTime) {
    this.CTX = CTX;
    this.canvasDOM = canvasDOM;
    this.FPS = FPS;
    this.currentTime = currentTime;
    this.stringTime = stringTime;
  }

  calculateTime(ciclesCont) {
    if (ciclesCont % this.FPS === 0) {
      this.currentTime--;
      this.getMinutes();
      this.getSeconds();
      this.stringTime =
        this.computeTwoDigitNumber(this.getMinutes()) +
        ":" +
        this.computeTwoDigitNumber(this.getSeconds());
    }
  }
  drawTime() {
    this.CTX.font = "50px College";
    this.CTX.fillStyle = "white";
    this.CTX.fillText(
      this.stringTime,
      this.canvasDOM.width / 2 - this.CTX.measureText(this.stringTime).width,
      180
    );
  }
  getMinutes() {
    return Math.floor(Math.floor(this.currentTime) / 60);
    // ... your code goes here
  }

  getSeconds() {
    if (Math.floor(this.currentTime) < 60) {
      return Math.floor(this.currentTime);
    } else {
      return Math.floor(this.currentTime % 60);
    }
  }
  computeTwoDigitNumber(value) {
    if (value.toString().length === 1) {
      return "0" + value.toString();
    } else {
      return value.toString();
    }
  }
}
