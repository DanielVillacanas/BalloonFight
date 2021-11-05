class Player {
  constructor(CTX, canvasDOM, pos, img_name, speed, score_posX) {
    this.CTX = CTX;
    this.pos = {
      X: pos.x,
      Y: pos.y,
    };
    this.radius = 0;
    this.img = undefined;
    this.img_name = img_name;
    this.speed = speed;

    this.size = {
      height: 117,
      width: 1446,
    };
    this.canvasSize = {
      width: canvasDOM.width,
      height: canvasDOM.height,
    };

    this.bullets = [];

    //Parametros del sprite generico
    this.frames = 16;
    this.framesIndex = 0;
    this.countBullets = 0;

    //SCORE
    this.imgScore = undefined;
    this.score = 0;
    this.bonus2x = 0;
    this.scoreFrames = 10;
    this.scoreFramesIndex = 9;
    this.scoreSize = {
      height: 108,
      width: 921,
    };

    //BONUS
    this.inmortal = false;
  }

  drawPlayer(ciclesCont) {
    this.img = new Image();
    this.img.src = `img/${this.img_name}`;
    this.CTX.drawImage(
      this.img,
      (this.framesIndex * this.size.width) / this.frames,
      0,
      this.size.width / this.frames,
      this.size.height,
      this.pos.X,
      this.pos.Y,
      this.size.width / this.frames,
      this.size.height
    );

    if (ciclesCont % 5 === 0) {
      this.animate();
    }
    this.radius = this.size.height / 2 - 25;
  }

  movePlayer(direcction) {
    this.checkBorders(direcction)
      ? (this.pos.X += 0)
      : (this.pos.X += this.speed * direcction);
  }

  checkBorders(direcction) {
    return (this.pos.X + 20 >
      this.canvasSize.width - this.size.width / this.frames &&
      direcction === 1) ||
      (this.pos.X - 20 < 0 && direcction === -1)
      ? true
      : false;
  }

  animate() {
    if (this.framesIndex === 15) {
      this.framesIndex = 0;
    }
    this.framesIndex++;
  }

  createBullets() {
    if (this.bullets.length < 5) {
      if (this.img_name === "player1_sprite.png") {
        this.bullets.push(
          new Bullets(
            this.CTX,
            this.canvasDOM,
            this.pos.X,
            this.pos.Y,
            10,
            "blue",
            this.countBullets,
            this
          )
        );
        this.countBullets++;
      } else {
        this.bullets.push(
          new Bullets(
            this.CTX,
            this.canvasDOM,
            this.pos.X,
            this.pos.Y,
            10,
            "red",
            this.countBullets,
            this
          )
        );
        this.countBullets++;
      }
    }
  }
  paintBullets() {
    this.bullets.forEach((element) => {
      element.drawBullets();
    });
  }

  removeBullet(bala) {
    this.bullets = this.bullets.filter(
      (element) => element.bulletID != bala.bulletID
    );
  }

  paintScore(playerID) {
    if (this.score.toString().length > 2) {
      for (let i = 0; i < 3; i++) {
        this.drawScore(parseInt(this.score.toString().charAt(i)), i, playerID);
      }
    } else if (this.score.toString().length > 1) {
      for (let i = 0; i < 2; i++) {
        this.drawScore(parseInt(this.score.toString().charAt(i)), i, playerID);
      }
    } else {
      this.drawScore(parseInt(this.score.toString().charAt(0)), 0, playerID);
    }
  }
  drawScore(value, i, playerID) {
    this.imgScore = new Image();
    this.imgScore.src = `img/score${playerID}.png`;
    this.CTX.drawImage(
      this.imgScore,
      (value * this.scoreSize.width) / this.scoreFrames,
      0,
      this.scoreSize.width / this.scoreFrames - 5,
      this.scoreSize.height,
      100 +
        this.size.width * playerID +
        (i * this.scoreSize.width) / this.scoreFrames,
      100,
      this.scoreSize.width / this.scoreFrames,
      this.scoreSize.height
    );
  }
}
