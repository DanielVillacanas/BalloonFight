const gameManager = {
  //#region PROPERTIES
  canvasDOM: undefined,

  CTX: undefined,

  size: {
    height: undefined,
    width: undefined,
  },

  timer: undefined,
  intervalID: undefined,
  currentTime: 90,
  stringTime: "",

  background: undefined,

  floorPosY: 100,
  player: [],
  playerDirecction: [(playerDir1 = 0), (playerDir2 = 0)],
  playerSpeed: [(playerSpeed1 = 8), (playerSpeed2 = 8)],
  ballons: [],
  ballons_esp: [],
  ballons_espID: 0,
  balloonID: 0,
  bonus: [],
  bonusID: 0,

  interFaceInterval: undefined,
  interFaceImg: undefined,
  sizePressEnter: {
    height: 84,
    width: 4484,
  },
  pressEnterImg: undefined,
  interFaceCont: 0,
  interFaceDir: 1,
  framesPressEnter: 9,

  colorNumber: 0,

  keyspressed: {
    arrowLeft: false,
    arrowRight: false,
    arrowUp: false,
    a: false,
    d: false,
    w: false,
  },

  ciclesCont: 0,

  FPS: 60,

  winImg: undefined,

  sound: undefined,
  soundcrash: undefined,
  soundPlayerHit: undefined,
  soundEnd: undefined,
  soundInit: undefined,

  numballons: 7,
  numballonsESP: 2,
  ballonsSpawnTime: 30,

  //#endregion

  init() {
    this.setContext();
    this.setDimensions();
    this.crateBackGround();
    this.createPlayer(1);
    this.createPlayer(0);
    this.createTimer();
    this.interFace();
  },

  interFace() {
    this.interFaceInterval = setInterval(() => {
      this.interFaceImg = new Image();
      this.interFaceImg.src = `img/Interfaz.png`;
      this.pressEnterImg = new Image();
      this.pressEnterImg.src = `img/Interfaz_Press_Enter_Sprite.png`;
      this.cleanScreen();
      this.CTX.drawImage(
        this.interFaceImg,
        0,
        0,
        this.size.width,
        this.size.height
      );
      this.interFaceCont += 1 * this.interFaceDir;
      this.interFaceCont > this.framesPressEnter
        ? (this.interFaceDir = -1)
        : null;
      this.interFaceCont === 0 ? (this.interFaceDir = 1) : null;
      this.CTX.drawImage(
        this.pressEnterImg,
        (this.interFaceCont * this.sizePressEnter.width) /
          this.framesPressEnter,
        0,
        this.sizePressEnter.width / this.framesPressEnter,
        this.sizePressEnter.height,
        this.size.width / 2 -
          this.sizePressEnter.width / this.framesPressEnter / 2,
        this.size.height / 2,
        this.sizePressEnter.width / this.framesPressEnter,
        this.sizePressEnter.height
      );
      this.listenerStart();
    }, 100);
  },
  listenerStart() {
    document.body.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        if (this.intervalID === undefined) {
          clearInterval(this.interFaceInterval);
          this.start();
        }
      }
    });
  },

  start() {
    this.sound = new Audio("music/01.Forever Bound - Stereo Madness.mp3");
    this.sound.volume = 0.3;
    this.sound.play();
    this.soundcrash = new Audio(
      "music/yt1s.com - explote sound geometry dash.mp3"
    );
    this.soundPlayerHit = new Audio("music/HitPlayer.mp3");
    this.soundPlayerHit.volume = 0.5;
    this.soundEnd = new Audio("music/Final_Sound.mp3");

    this.intervalID = setInterval(() => {
      if (this.timer.currentTime <= 0) {
        this.sound.pause();
        this.soundEnd.play();

        if (this.player[0].score === this.player[1].score) {
          this.timer.currentTime += 11;
        } else {
          if (this.player[0].score < this.player[1].score) {
            this.winImg = new Image();
            this.winImg.src = "img/Player1Wins.png";
            this.winImg.onload = () => {
              this.CTX.drawImage(
                this.winImg,
                0,
                0,
                this.size.width,
                this.size.height
              );
            };
          } else {
            this.winImg = new Image();
            this.winImg.src = "img/Player2Wins.png";
            this.winImg.onload = () => {
              this.CTX.drawImage(
                this.winImg,
                0,
                0,
                this.size.width,
                this.size.height
              );
            };
          }
          clearInterval(this.intervalID);
        }
      }
      this.createBallooon();
      this.createBallooonESP();
      this.createBonus();
      this.cleanScreen();
      this.drawAll();
      this.setListeners();
      this.timer.calculateTime(this.ciclesCont);
      this.timer.drawTime();
      this.ciclesCont === 2000 ? (this.ciclesCont = 0) : this.ciclesCont++;
    }, 1000 / this.FPS);
  },

  setContext() {
    this.canvasDOM = document.querySelector("#mycanvas");
    this.CTX = this.canvasDOM.getContext("2d");
  },

  setDimensions() {
    this.size.height = window.innerHeight;
    this.size.width = window.innerWidth;
    this.canvasDOM.setAttribute("width", this.size.width);
    this.canvasDOM.setAttribute("height", this.size.height);
  },

  //#region CREATES
  crateBackGround() {
    this.colorNumber = Math.round(Math.random() * 4);

    this.background = new Background(
      this.CTX,
      this.canvasDOM,
      this.size.height,
      this.size.width,
      this.colorNumber
    );
  },

  createPlayer(num) {
    this.player.push(
      new Player(
        this.CTX,
        this.canvasDOM,
        (pos = {
          x: this.size.width / 4 + (this.size.width / 2) * num,
          y: this.size.height - 200,
        }),
        `player${num}_sprite.png`,
        playerSpeed1
      )
    );
  },

  createBallooon() {
    if (
      this.ciclesCont % this.ballonsSpawnTime === 0 &&
      this.ballons.length < this.numballons
    ) {
      this.ballons.push(
        new Balloons(
          this.CTX,
          this.canvasDOM,
          this.colorNumber,
          2,
          this.floorPosY,
          this.balloonID
        )
      );
      this.balloonID++;
    }
  },

  createBallooonESP() {
    if (
      this.ciclesCont % 100 === 0 &&
      this.ballons_esp.length < this.numballonsESP
    ) {
      this.ballons_esp.push(
        new BalloonsESP(
          this.CTX,
          this.canvasDOM,
          Math.round(Math.random() * 4),
          2,
          this.floorPosY,
          this.ballons_espID
        )
      );
      this.ballons_espID++;
    }
  },

  createTimer() {
    this.timer = new Timer(
      this.CTX,
      this.canvasDOM,
      this.FPS,
      this.currentTime,
      this.stringTime
    );
  },

  createBonus() {
    if (this.ciclesCont % 600 === 0 && this.bonus.length < 1) {
      this.bonus.push(
        new Bonus(
          this.CTX,
          this.canvasDOM,
          Math.round(Math.random() * 6),
          2,
          this.floorPosY,
          this.bonusID
        )
      );
      this.bonusID++;
    }
  },

  cleanScreen() {
    this.CTX.clearRect(0, 0, this.size.width, this.size.height);
  },
  //#endregion

  //#region DRAW
  drawAll() {
    this.drawBackGround();
    this.drawPlayer();
    this.drawBullets();
    this.drawBalloons();
    this.player[1].paintScore(0);
    this.player[0].paintScore(1);
    this.checkAllCollisions();
    this.drawBonus();
  },

  drawPlayer() {
    this.player.forEach((element) => element.drawPlayer(this.ciclesCont));
  },
  drawBalloons() {
    this.ballons.forEach((element) => {
      element.drawBalloons(this.colorNumber);
    });
    this.ballons_esp.forEach((element) => {
      element.drawBalloons();
    });
  },
  drawBackGround() {
    this.background.draw(this.colorNumber);
  },
  drawBullets() {
    this.player.forEach((element) => {
      element.paintBullets();
    });
  },
  drawBonus() {
    this.bonus.forEach((bonus) => {
      bonus.drawBonus();
      bonus.checkBorderDown() ? this.removeBonus(bonus) : null;
    });
  },
  //#endregion

  //#region COLLISION

  checkAllCollisions() {
    this.collisionPlayerBallooon();
    this.collisionBulletBallooon();
    this.collisionPlayerBallooonESP();
    this.collisionBulletBallooonESP();
    this.collisionBallooonBallooon();
    this.collisionBallooonBallooonESP();
    this.collisionBallooonESPBallooonESP();
    this.collisionBulletBonus();
  },
  collisionPlayerBallooon() {
    this.player.forEach((element) => {
      this.ballons.forEach((ballons) => {
        if (
          utilies.checkCircularRectagleCollision(
            ballons.radius,
            element.size.width / element.frames - 15,
            element.size.height - 35,
            ballons.position.X,
            ballons.position.Y,
            element.pos.X,
            element.pos.Y
          )
        ) {
          if (element.inmortal) {
          } else {
            element.score -= 3;
            this.removeBalloons(ballons);
            this.soundPlayerHit.play();
          }
          element.score < 0 ? (element.score = 0) : null;
        }
      });
    });
  },
  collisionPlayerBallooonESP() {
    this.player.forEach((element) => {
      this.ballons_esp.forEach((ballons_esp) => {
        if (
          utilies.checkCircularRectagleCollision(
            ballons_esp.radius,
            element.size.width / element.frames - 15,
            element.size.height - 35,
            ballons_esp.position.X,
            ballons_esp.position.Y,
            element.pos.X,
            element.pos.Y
          )
        ) {
          if (element.inmortal) {
          } else {
            element.score -= 3;
            this.removeBalloonsESP(ballons_esp);
            this.soundPlayerHit.play();
          }
          element.score < 0 ? (element.score = 0) : null;
        }
      });
    });
  },
  collisionBulletBallooon() {
    this.player.forEach((player) => {
      player.bullets.forEach((bullets) => {
        this.ballons.forEach((ballons) => {
          if (
            utilies.checkCircularRectagleCollision(
              ballons.radius,
              bullets.width,
              bullets.height,
              ballons.position.X,
              ballons.position.Y,
              bullets.pos.X,
              bullets.pos.Y
            )
          ) {
            this.removeObject(player, bullets, ballons);
            player.score += 1 + player.bonus2x;
            this.soundcrash.play();
          }
        });
      });
    });
  },
  collisionBulletBallooonESP() {
    this.player.forEach((player) => {
      player.bullets.forEach((bullets) => {
        this.ballons_esp.forEach((ballons_esp) => {
          if (
            utilies.checkCircularRectagleCollision(
              ballons_esp.radius,
              bullets.width,
              bullets.height,
              ballons_esp.position.X,
              ballons_esp.position.Y,
              bullets.pos.X,
              bullets.pos.Y
            )
          ) {
            this.removeObject(player, bullets, ballons_esp);
            this.soundcrash.play();
            if (ballons_esp.colorNumber === this.colorNumber) {
              player.score += 1 + player.bonus2x;
            } else {
              player.score -= 2;
              player.score < 0 ? (player.score = 0) : null;
            }
          }
        });
      });
    });
  },
  collisionBallooonBallooon() {
    this.ballons.forEach((balloons1) => {
      this.ballons.forEach((balloons2) => {
        if (
          utilies.checkBalloonCollision(
            balloons1.radius,
            balloons2.radius,
            balloons1.position.X,
            balloons1.position.Y,
            balloons2.position.X,
            balloons2.position.Y
          ) &&
          balloons1.balloonID != balloons2.balloonID
        ) {
          if (
            (balloons1.colDetect === false || balloons2.colDetect === false) &&
            (this.timer.currentTime < balloons1.timeCol - 1 ||
              this.timer.currentTime < balloons2.timeCol - 1)
          ) {
            balloons1.colDetect = true;
            balloons2.colDetect = true;
            balloons1.timeCol = this.timer.currentTime;
            balloons2.timeCol = this.timer.currentTime;
            if (balloons1.balloonID != balloons2.balloonID) {
              if (
                balloons1.direcctionX != balloons2.direcctionX &&
                balloons1.direcctionY != balloons2.direcctionY
              ) {
                balloons1.direcctionX = balloons1.direcctionX * -1;
                balloons2.direcctionX = balloons2.direcctionX * -1;
                balloons1.direcctionY = balloons1.direcctionY * -1;
                balloons2.direcctionY = balloons2.direcctionY * -1;
              } else if (
                balloons1.direcctionX != balloons2.direcctionX &&
                balloons1.direcctionY === balloons2.direcctionY
              ) {
                if (
                  balloons1.position.X < balloons2.position.X &&
                  balloons1.position.Y < balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * -1;
                  balloons1.direcctionY = balloons1.direcctionY * -1;
                  balloons2.direcctionX = balloons2.direcctionX * -1;
                  balloons2.direcctionY = balloons2.direcctionY * 1;
                } else if (
                  balloons1.position.X > balloons2.position.X &&
                  balloons1.position.Y < balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * 1;
                  balloons1.direcctionY = balloons1.direcctionY * 1;
                  balloons2.direcctionX = balloons2.direcctionX * 1;
                  balloons2.direcctionY = balloons2.direcctionY * -1;
                } else if (
                  balloons1.position.X < balloons2.position.X &&
                  balloons1.position.Y > balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * 1;
                  balloons1.direcctionY = balloons1.direcctionY * -1;
                  balloons2.direcctionX = balloons2.direcctionX * 1;
                  balloons2.direcctionY = balloons2.direcctionY * 1;
                } else if (
                  balloons1.position.X > balloons2.position.X &&
                  balloons1.position.Y > balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * -1;
                  balloons1.direcctionY = balloons1.direcctionY * 1;
                  balloons2.direcctionX = balloons2.direcctionX * -1;
                  balloons2.direcctionY = balloons2.direcctionY * -1;
                }
              } else if (
                balloons1.direcctionX === balloons2.direcctionX &&
                balloons1.direcctionY != balloons2.direcctionY
              ) {
                if (
                  balloons1.position.X < balloons2.position.X &&
                  balloons1.position.Y < balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * -1;
                  balloons1.direcctionY = balloons1.direcctionY * -1;
                  balloons2.direcctionX = balloons2.direcctionX * 1;
                  balloons2.direcctionY = balloons2.direcctionY * 1;
                } else if (
                  balloons1.position.X > balloons2.position.X &&
                  balloons1.position.Y < balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * 1;
                  balloons1.direcctionY = balloons1.direcctionY * 1;
                  balloons2.direcctionX = balloons2.direcctionX * -1;
                  balloons2.direcctionY = balloons2.direcctionY * 1;
                } else if (
                  balloons1.position.X < balloons2.position.X &&
                  balloons1.position.Y > balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * -1;
                  balloons1.direcctionY = balloons1.direcctionY * 1;
                  balloons2.direcctionX = balloons2.direcctionX * 1;
                  balloons2.direcctionY = balloons2.direcctionY * 1;
                } else if (
                  balloons1.position.X > balloons2.position.X &&
                  balloons1.position.Y > balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * 1;
                  balloons1.direcctionY = balloons1.direcctionY * 1;
                  balloons2.direcctionX = balloons2.direcctionX * -1;
                  balloons2.direcctionY = balloons2.direcctionY * -1;
                }
              } else if (
                balloons1.direcctionX === balloons2.direcctionX &&
                balloons1.direcctionY === balloons2.direcctionY
              ) {
                if (
                  balloons1.position.X < balloons2.position.X &&
                  balloons1.position.Y < balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * -1;
                  balloons1.direcctionY = balloons1.direcctionY * -1;
                  balloons2.direcctionX = balloons2.direcctionX * 1;
                  balloons2.direcctionY = balloons2.direcctionY * 1;
                } else if (
                  balloons1.position.X > balloons2.position.X &&
                  balloons1.position.Y < balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * 1;
                  balloons1.direcctionY = balloons1.direcctionY * -1;
                  balloons2.direcctionX = balloons2.direcctionX * -1;
                  balloons2.direcctionY = balloons2.direcctionY * 1;
                } else if (
                  balloons1.position.X < balloons2.position.X &&
                  balloons1.position.Y > balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * -1;
                  balloons1.direcctionY = balloons1.direcctionY * 1;
                  balloons2.direcctionX = balloons2.direcctionX * 1;
                  balloons2.direcctionY = balloons2.direcctionY * -1;
                } else if (
                  balloons1.position.X > balloons2.position.X &&
                  balloons1.position.Y > balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * 1;
                  balloons1.direcctionY = balloons1.direcctionY * 1;
                  balloons2.direcctionX = balloons2.direcctionX * -1;
                  balloons2.direcctionY = balloons2.direcctionY * -1;
                }
              }
            }
          }
        } else if (
          balloons1.colDetect === true &&
          balloons2.colDetect === true
        ) {
          balloons1.colDetect = false;
          balloons2.colDetect = false;
        }
      });
    });
  },
  collisionBallooonBallooonESP() {
    this.ballons.forEach((balloons1) => {
      this.ballons_esp.forEach((balloons2) => {
        if (
          utilies.checkBalloonCollision(
            balloons1.radius,
            balloons2.radius,
            balloons1.position.X,
            balloons1.position.Y,
            balloons2.position.X,
            balloons2.position.Y
          ) &&
          balloons1.balloonID != balloons2.balloonID
        ) {
          if (
            (balloons1.colDetect === false || balloons2.colDetect === false) &&
            (this.timer.currentTime < balloons1.timeCol - 1 ||
              this.timer.currentTime < balloons2.timeCol - 1)
          ) {
            balloons1.colDetect = true;
            balloons2.colDetect = true;
            balloons1.timeCol = this.timer.currentTime;
            balloons2.timeCol = this.timer.currentTime;
            if (balloons1.balloonID != balloons2.balloonID) {
              if (
                balloons1.direcctionX != balloons2.direcctionX &&
                balloons1.direcctionY != balloons2.direcctionY
              ) {
                balloons1.direcctionX = balloons1.direcctionX * -1;
                balloons2.direcctionX = balloons2.direcctionX * -1;
                balloons1.direcctionY = balloons1.direcctionY * -1;
                balloons2.direcctionY = balloons2.direcctionY * -1;
              } else if (
                balloons1.direcctionX != balloons2.direcctionX &&
                balloons1.direcctionY === balloons2.direcctionY
              ) {
                if (
                  balloons1.position.X < balloons2.position.X &&
                  balloons1.position.Y < balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * -1;
                  balloons1.direcctionY = balloons1.direcctionY * -1;
                  balloons2.direcctionX = balloons2.direcctionX * -1;
                  balloons2.direcctionY = balloons2.direcctionY * 1;
                } else if (
                  balloons1.position.X > balloons2.position.X &&
                  balloons1.position.Y < balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * 1;
                  balloons1.direcctionY = balloons1.direcctionY * 1;
                  balloons2.direcctionX = balloons2.direcctionX * 1;
                  balloons2.direcctionY = balloons2.direcctionY * -1;
                } else if (
                  balloons1.position.X < balloons2.position.X &&
                  balloons1.position.Y > balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * 1;
                  balloons1.direcctionY = balloons1.direcctionY * -1;
                  balloons2.direcctionX = balloons2.direcctionX * 1;
                  balloons2.direcctionY = balloons2.direcctionY * 1;
                } else if (
                  balloons1.position.X > balloons2.position.X &&
                  balloons1.position.Y > balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * -1;
                  balloons1.direcctionY = balloons1.direcctionY * 1;
                  balloons2.direcctionX = balloons2.direcctionX * -1;
                  balloons2.direcctionY = balloons2.direcctionY * -1;
                }
              } else if (
                balloons1.direcctionX === balloons2.direcctionX &&
                balloons1.direcctionY != balloons2.direcctionY
              ) {
                if (
                  balloons1.position.X < balloons2.position.X &&
                  balloons1.position.Y < balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * -1;
                  balloons1.direcctionY = balloons1.direcctionY * -1;
                  balloons2.direcctionX = balloons2.direcctionX * 1;
                  balloons2.direcctionY = balloons2.direcctionY * 1;
                } else if (
                  balloons1.position.X > balloons2.position.X &&
                  balloons1.position.Y < balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * 1;
                  balloons1.direcctionY = balloons1.direcctionY * 1;
                  balloons2.direcctionX = balloons2.direcctionX * -1;
                  balloons2.direcctionY = balloons2.direcctionY * 1;
                } else if (
                  balloons1.position.X < balloons2.position.X &&
                  balloons1.position.Y > balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * -1;
                  balloons1.direcctionY = balloons1.direcctionY * 1;
                  balloons2.direcctionX = balloons2.direcctionX * 1;
                  balloons2.direcctionY = balloons2.direcctionY * 1;
                } else if (
                  balloons1.position.X > balloons2.position.X &&
                  balloons1.position.Y > balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * 1;
                  balloons1.direcctionY = balloons1.direcctionY * 1;
                  balloons2.direcctionX = balloons2.direcctionX * -1;
                  balloons2.direcctionY = balloons2.direcctionY * -1;
                }
              } else if (
                balloons1.direcctionX === balloons2.direcctionX &&
                balloons1.direcctionY === balloons2.direcctionY
              ) {
                if (
                  balloons1.position.X < balloons2.position.X &&
                  balloons1.position.Y < balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * -1;
                  balloons1.direcctionY = balloons1.direcctionY * -1;
                  balloons2.direcctionX = balloons2.direcctionX * 1;
                  balloons2.direcctionY = balloons2.direcctionY * 1;
                } else if (
                  balloons1.position.X > balloons2.position.X &&
                  balloons1.position.Y < balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * 1;
                  balloons1.direcctionY = balloons1.direcctionY * -1;
                  balloons2.direcctionX = balloons2.direcctionX * -1;
                  balloons2.direcctionY = balloons2.direcctionY * 1;
                } else if (
                  balloons1.position.X < balloons2.position.X &&
                  balloons1.position.Y > balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * -1;
                  balloons1.direcctionY = balloons1.direcctionY * 1;
                  balloons2.direcctionX = balloons2.direcctionX * 1;
                  balloons2.direcctionY = balloons2.direcctionY * -1;
                } else if (
                  balloons1.position.X > balloons2.position.X &&
                  balloons1.position.Y > balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * 1;
                  balloons1.direcctionY = balloons1.direcctionY * 1;
                  balloons2.direcctionX = balloons2.direcctionX * -1;
                  balloons2.direcctionY = balloons2.direcctionY * -1;
                }
              }
            }
          }
        } else if (
          balloons1.colDetect === true &&
          balloons2.colDetect === true
        ) {
          balloons1.colDetect = false;
          balloons2.colDetect = false;
        }
      });
    });
  },
  collisionBallooonESPBallooonESP() {
    this.ballons_esp.forEach((balloons1) => {
      this.ballons_esp.forEach((balloons2) => {
        if (
          utilies.checkBalloonCollision(
            balloons1.radius,
            balloons2.radius,
            balloons1.position.X,
            balloons1.position.Y,
            balloons2.position.X,
            balloons2.position.Y
          ) &&
          balloons1.balloonID != balloons2.balloonID
        ) {
          if (
            (balloons1.colDetect === false || balloons2.colDetect === false) &&
            (this.timer.currentTime < balloons1.timeCol - 1 ||
              this.timer.currentTime < balloons2.timeCol - 1)
          ) {
            balloons1.colDetect = true;
            balloons2.colDetect = true;
            balloons1.timeCol = this.timer.currentTime;
            balloons2.timeCol = this.timer.currentTime;
            if (balloons1.balloonID != balloons2.balloonID) {
              if (
                balloons1.direcctionX != balloons2.direcctionX &&
                balloons1.direcctionY != balloons2.direcctionY
              ) {
                balloons1.direcctionX = balloons1.direcctionX * -1;
                balloons2.direcctionX = balloons2.direcctionX * -1;
                balloons1.direcctionY = balloons1.direcctionY * -1;
                balloons2.direcctionY = balloons2.direcctionY * -1;
              } else if (
                balloons1.direcctionX != balloons2.direcctionX &&
                balloons1.direcctionY === balloons2.direcctionY
              ) {
                if (
                  balloons1.position.X < balloons2.position.X &&
                  balloons1.position.Y < balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * -1;
                  balloons1.direcctionY = balloons1.direcctionY * -1;
                  balloons2.direcctionX = balloons2.direcctionX * -1;
                  balloons2.direcctionY = balloons2.direcctionY * 1;
                } else if (
                  balloons1.position.X > balloons2.position.X &&
                  balloons1.position.Y < balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * 1;
                  balloons1.direcctionY = balloons1.direcctionY * 1;
                  balloons2.direcctionX = balloons2.direcctionX * 1;
                  balloons2.direcctionY = balloons2.direcctionY * -1;
                } else if (
                  balloons1.position.X < balloons2.position.X &&
                  balloons1.position.Y > balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * 1;
                  balloons1.direcctionY = balloons1.direcctionY * -1;
                  balloons2.direcctionX = balloons2.direcctionX * 1;
                  balloons2.direcctionY = balloons2.direcctionY * 1;
                } else if (
                  balloons1.position.X > balloons2.position.X &&
                  balloons1.position.Y > balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * -1;
                  balloons1.direcctionY = balloons1.direcctionY * 1;
                  balloons2.direcctionX = balloons2.direcctionX * -1;
                  balloons2.direcctionY = balloons2.direcctionY * -1;
                }
              } else if (
                balloons1.direcctionX === balloons2.direcctionX &&
                balloons1.direcctionY != balloons2.direcctionY
              ) {
                if (
                  balloons1.position.X < balloons2.position.X &&
                  balloons1.position.Y < balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * -1;
                  balloons1.direcctionY = balloons1.direcctionY * -1;
                  balloons2.direcctionX = balloons2.direcctionX * 1;
                  balloons2.direcctionY = balloons2.direcctionY * 1;
                } else if (
                  balloons1.position.X > balloons2.position.X &&
                  balloons1.position.Y < balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * 1;
                  balloons1.direcctionY = balloons1.direcctionY * 1;
                  balloons2.direcctionX = balloons2.direcctionX * -1;
                  balloons2.direcctionY = balloons2.direcctionY * 1;
                } else if (
                  balloons1.position.X < balloons2.position.X &&
                  balloons1.position.Y > balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * -1;
                  balloons1.direcctionY = balloons1.direcctionY * 1;
                  balloons2.direcctionX = balloons2.direcctionX * 1;
                  balloons2.direcctionY = balloons2.direcctionY * 1;
                } else if (
                  balloons1.position.X > balloons2.position.X &&
                  balloons1.position.Y > balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * 1;
                  balloons1.direcctionY = balloons1.direcctionY * 1;
                  balloons2.direcctionX = balloons2.direcctionX * -1;
                  balloons2.direcctionY = balloons2.direcctionY * -1;
                }
              } else if (
                balloons1.direcctionX === balloons2.direcctionX &&
                balloons1.direcctionY === balloons2.direcctionY
              ) {
                if (
                  balloons1.position.X < balloons2.position.X &&
                  balloons1.position.Y < balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * -1;
                  balloons1.direcctionY = balloons1.direcctionY * -1;
                  balloons2.direcctionX = balloons2.direcctionX * 1;
                  balloons2.direcctionY = balloons2.direcctionY * 1;
                } else if (
                  balloons1.position.X > balloons2.position.X &&
                  balloons1.position.Y < balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * 1;
                  balloons1.direcctionY = balloons1.direcctionY * -1;
                  balloons2.direcctionX = balloons2.direcctionX * -1;
                  balloons2.direcctionY = balloons2.direcctionY * 1;
                } else if (
                  balloons1.position.X < balloons2.position.X &&
                  balloons1.position.Y > balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * -1;
                  balloons1.direcctionY = balloons1.direcctionY * 1;
                  balloons2.direcctionX = balloons2.direcctionX * 1;
                  balloons2.direcctionY = balloons2.direcctionY * -1;
                } else if (
                  balloons1.position.X > balloons2.position.X &&
                  balloons1.position.Y > balloons2.position.Y
                ) {
                  balloons1.direcctionX = balloons1.direcctionX * 1;
                  balloons1.direcctionY = balloons1.direcctionY * 1;
                  balloons2.direcctionX = balloons2.direcctionX * -1;
                  balloons2.direcctionY = balloons2.direcctionY * -1;
                }
              }
            }
          }
        } else if (
          balloons1.colDetect === true &&
          balloons2.colDetect === true
        ) {
          balloons1.colDetect = false;
          balloons2.colDetect = false;
        }
      });
    });
  },
  collisionBulletBonus() {
    this.player.forEach((player) => {
      player.bullets.forEach((bullets) => {
        this.bonus.forEach((bonus) => {
          if (utilies.checkRectangleRectagleCollision(bullets, bonus)) {
            this.removeBonus(bonus);
            this.removeObject(player, bullets);
            bonus.activateBonus(player);
          }
        });
      });
    });
  },

  //#endregion

  //#region LISTENER
  setListeners() {
    document.body.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          this.keyspressed.arrowLeft = true;
          break;
        case "ArrowRight":
          this.keyspressed.arrowRight = true;
          break;
        case "ArrowUp":
          this.keyspressed.arrowUp = false;
          break;
        case "a":
          this.keyspressed.a = true;
          break;
        case "d":
          this.keyspressed.d = true;
          break;
        case "w":
          this.keyspressed.w = false;
          break;
      }
    });
    document.body.addEventListener("keyup", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          this.keyspressed.arrowLeft = false;
          break;
        case "ArrowRight":
          this.keyspressed.arrowRight = false;
          break;
        case "ArrowUp":
          this.keyspressed.arrowUp = true;
          break;
        case "a":
          this.keyspressed.a = false;
          break;
        case "d":
          this.keyspressed.d = false;
          break;
        case "w":
          this.keyspressed.w = true;
          break;
      }
    });

    if (this.keyspressed.arrowLeft) {
      this.player[0].movePlayer((this.playerDir1 = -1));
    }
    if (this.keyspressed.arrowRight) {
      this.player[0].movePlayer((this.playerDir1 = 1));
    }
    if (this.keyspressed.arrowUp) {
      this.player[0].createBullets();
      this.keyspressed.arrowUp = false;
    }
    if (this.player.length > 1) {
      if (this.keyspressed.a) {
        this.player[1].movePlayer((this.playerDir1 = -1));
      }
      if (this.keyspressed.d) {
        this.player[1].movePlayer((this.playerDir1 = 1));
      }
      if (this.keyspressed.w) {
        this.player[1].createBullets();
        this.keyspressed.w = false;
      }
    }
  },
  //#endregion

  //#region REMOVES
  removeObject(player, bala, balloons) {
    player.removeBullet(bala);
    if (balloons != undefined) {
      if (balloons.constructor.name === "BalloonsESP") {
        this.removeBalloonsESP(balloons);
      } else {
        this.removeBalloons(balloons);
      }
    }
  },

  removeBalloons(balloons) {
    this.ballons = this.ballons.filter(
      (element) => element.balloonID != balloons.balloonID
    );
  },
  removeBalloonsESP(balloons) {
    this.ballons_esp = this.ballons_esp.filter(
      (element) => element.balloonID != balloons.balloonID
    );
  },
  removeBonus(bonus) {
    this.bonus = this.bonus.filter(
      (element) => element.bonusID != bonus.bonusID
    );
  },
  //#endregion
};
