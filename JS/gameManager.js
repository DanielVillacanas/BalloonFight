const gameManager = {

//#region PROPERTIES
canvasDOM : undefined,

CTX : undefined,

size : {
    height:undefined,
    width:undefined,
},

timer :undefined,
intervalID : undefined,
currentTime : 10,
stringTime : "",

background:undefined,

floorPosY : 100,
player:[],
playerDirecction:[playerDir1 = 0,playerDir2 = 0],
playerSpeed:[playerSpeed1 = 15,playerSpeed2 = 15],
globos:[],
globos_esp:[],
globos_espID : 0,
globoID : 0,

interFaceInterval:undefined,
interFaceImg: undefined,
interFaceCont : 0,
interFaceDir : 1,

colorNumber : 0,

keyspressed : {
    arrowLeft:false,
    arrowRight:false,
    arrowUp:false,
    a :false,
    d :false,
    w :false
    },

ciclesCont :0,

FPS:60,

winImg: undefined,

sound:undefined,
soundcrash:undefined,
soundPlayerHit:undefined,
soundEnd : undefined,
soundInit:undefined,

//#endregion

init(){
    
    this.setContext()
    this.setDimensions()
    this.crateBackGround()
    this.createPlayer(1)
    this.createPlayer(0)
    this.createTimer()
    this.interFace()
   
},

interFace(){
     this.soundInit = new Audio("../MUSIC/InitSound.mp3")
    this.soundInit.play()
   this.interFaceInterval= setInterval(() => {

        this.interFaceImg= new Image()
        this.interFaceImg.src = `../img/Interfaz${this.interFaceCont}.png`
        this.cleanScreen()
        this.CTX.drawImage(this.interFaceImg,0,0,this.size.width,this.size.height)
        this.interFaceCont += 1*this.interFaceDir
        this.interFaceCont > 1 ? this.interFaceDir = -1 : null
        this.interFaceCont === 0 ? this.interFaceDir = 1 : null
        this.listenerStart()
    }, 300);
},
listenerStart(){
   
document.body.addEventListener("keyup",  (e) => {

    if(e.key === "Enter")
    {
        if(this.intervalID === undefined) {
        this.soundInit.pause()
        clearInterval(this.interFaceInterval)
        this.start()
        }
    }

})
},

start(){

    this.sound = new Audio("../MUSIC/01.Forever Bound - Stereo Madness.mp3")
    this.sound.volume = 0.1
    this.sound.play()
    this.soundcrash = new Audio("../MUSIC/yt1s.com - explote sound geometry dash.mp3")
    this.soundPlayerHit =  new Audio ("../MUSIC/HitPlayer.mp3")
    this.soundEnd = new Audio("../MUSIC/Final_Sound.mp3")
   

   this.intervalID = setInterval(() => {
        if(this.timer.currentTime <= 0)
        {
            this.sound.pause()
            this.soundEnd.play()
            clearInterval(this.intervalID)
            if(this.player[0].score < this.player[1].score)
            {
                this.winImg = new Image()
                this.winImg.src = "../img/Player1Wins.png"
                this.winImg.onload = () =>{
                    this.CTX.drawImage(this.winImg,0,0,this.size.width,this.size.height)
                }
                
            } 
            else
            {
               this.winImg = new Image()
                this.winImg.src = "../img/Player2Wins.png"
                this.winImg.onload = () =>{
                    this.CTX.drawImage(this.winImg,0,0,this.size.width,this.size.height)
                }
            }
        }
        this.createGlobo()
        this.createGloboESP()
        this.cleanScreen()
        this.drawAll()
        this.setListeners()
        this.timer.calculateTime(this.ciclesCont)
        this.timer.drawTime()
        this.ciclesCont === 2000 ? this.ciclesCont = 0 : this.ciclesCont ++ 
    }, 1000/this.FPS);

},

setContext(){

    this.canvasDOM = document.querySelector("#mycanvas")
    this.CTX = this.canvasDOM.getContext("2d")

},

setDimensions(){
    
    this.size.height = window.innerHeight
    this.size.width = window.innerWidth
    this.canvasDOM.setAttribute("width",this.size.width)
    this.canvasDOM.setAttribute("height",this.size.height)
    
},


//#region CREATES
crateBackGround(){
    this.colorNumber = Math.round(Math.random() * 4)

    this.background = new Background (this.CTX,this.canvasDOM,this.size.height,this.size.width, this.colorNumber)
},

createPlayer(num){
    this.player.push(new Player(this.CTX,this.canvasDOM,pos={x:this.size.width/4 + (this.size.width/2 * num),y:this.size.height-200},`player${num}_sprite.png`,playerSpeed1))
},

createGlobo(){
     if(this.ciclesCont%50 === 0 && this.globos.length < 10){
        this.globos.push(new Globos(this.CTX,this.canvasDOM,this.colorNumber,2,this.floorPosY,this.globoID))
        this.globoID++
     }
 },

createGloboESP(){
    if(this.ciclesCont%100 === 0 && this.globos_esp.length < 0){
        this.globos_esp.push(new GlobosESP(this.CTX,this.canvasDOM,Math.round(Math.random()*4),2,this.floorPosY,this.globos_espID))
        this.globos_espID ++;
    }
 },

createTimer(){
    this.timer = new Timer(this.CTX,this.canvasDOM,this.FPS,this.currentTime,this.stringTime)
},

cleanScreen(){

    this.CTX.clearRect(0, 0, this.size.width, this.size.height)

},
//#endregion

//#region DRAW
drawAll(){
    this.drawBackGround()
    this.drawPlayer()
    this.drawBullets()
    this.drawGlobos()
    this.player[1].paintScore(0)
    this.player[0].paintScore(1)
    this.checkAllCollisions()
},

drawPlayer(){

    this.player.forEach(element => element.drawPlayer(this.ciclesCont));

},
drawGlobos(){
    this.globos.forEach(element => {
        element.drawGlobos(this.colorNumber)
    });
    this.globos_esp.forEach(element =>{
        element.drawGlobos()
    })
},
drawBackGround(){

    this.background.draw(this.colorNumber)
},
drawBullets(){
    this.player.forEach(element => {
        element.paintBullets()
    });
},
//#endregion

//#region COLLISION
checkAllCollisions()
{
    this.collisionPlayerGlobo()
    this.collisionBulletGlobo()
    this.collisionPlayerGloboESP()
    this.collisionBulletGloboESP()
    this.collisionGloboGlobo()
},

collisionPlayerGlobo(){
    this.player.forEach(element => {
        this.globos.forEach( globos =>{
             if(utilies.checkCircularRectagleCollision(globos.radius,element.size.width/element.frames - 15,element.size.height - 35, globos.position.X,globos.position.Y,element.pos.X,element.pos.Y)){
                 this.removeGlobos(globos)
                 this.soundPlayerHit.play()
                  element.score -= 3
                  element.score<0 ? element.score = 0: null
             }
        })
    });
},

collisionPlayerGloboESP(){
    this.player.forEach(element => {
        this.globos_esp.forEach( globos_esp =>{
             if(utilies.checkCircularRectagleCollision(globos_esp.radius,element.size.width/element.frames - 15,element.size.height - 35, globos_esp.position.X,globos_esp.position.Y,element.pos.X,element.pos.Y)){
                 this.removeGlobosESP(globos_esp)
                 this.soundcrash.volume = 1
                     this.soundPlayerHit.play()
                 element.score -= 3
                 element.score<0 ? element.score = 0: null
             }
        })
    });
},

collisionBulletGlobo(){
    this.player.forEach(player => {
        player.bullets.forEach(bullets =>{
            this.globos.forEach(globos => {
                 if(utilies.checkCircularRectagleCollision(globos.radius,bullets.width,bullets.height, globos.position.X,globos.position.Y, bullets.pos.X, bullets.pos.Y)){
                    this.removeObject(player,bullets,globos)
                    this.soundcrash.volume = 1
                   this.soundcrash.play()
                    player.score++
                 }
            })
        })
    });
},

collisionBulletGloboESP(){
    this.player.forEach(player => {
        player.bullets.forEach(bullets =>{
            this.globos_esp.forEach(globos_esp => {
                 if(utilies.checkCircularRectagleCollision(globos_esp.radius,bullets.width,bullets.height, globos_esp.position.X,globos_esp.position.Y, bullets.pos.X, bullets.pos.Y)){
                    this.removeObject(player,bullets,globos_esp)
                    if (globos_esp.colorNumber === this.colorNumber) {
                        player.score++
                        this.soundcrash.volume = 1
                        this.soundcrash.play()
                    }
                    else
                    {
                        this.soundcrash.volume = 1
                        this.soundcrash.play()
                        player.score -=2
                        player.score < 0 ? player.score = 0:null
                    }
                 }
            })
        })
    });
},

collisionGloboGlobo(){
    this.globos.forEach(globo1 =>{
        this.globos.forEach(globo2 =>{
            if(utilies.checkBalloonCollision(globo1.radius,globo2.radius,globo1.position.X,globo1.position.Y,globo2.position.X,globo2.position.Y)&&(globo1.globoID != globo2.globoID)){
               
               if((globo1.colDetect === false || globo2.colDetect === false) &&  (this.timer.currentTime < globo1.timeCol - 1 || this.timer.currentTime < globo2.timeCol - 1  ) )
               {
                   globo1.colDetect =  true
                   globo2.colDetect = true
                   globo1.timeCol = this.timer.currentTime
                   globo2.timeCol = this.timer.currentTime

                if(globo1.globoID != globo2.globoID)
                {
                    if(globo1.direcctionX != globo2.direcctionX && globo1.direcctionY != globo2.direcctionY)
                    {
                        globo1.direcctionX = globo1.direcctionX *-1
                        globo2.direcctionX = globo2.direcctionX *-1
                        globo1.direcctionY = globo1.direcctionY *-1
                        globo2.direcctionY = globo2.direcctionY *-1
                    }
                    else if(globo1.direcctionX != globo2.direcctionX && globo1.direcctionY === globo2.direcctionY)
                    {
                        if(globo1.position.X < globo2.position.X && globo1.position.Y < globo2.position.Y )
                        {
                        globo1.direcctionX = globo1.direcctionX * -1
                        globo1.direcctionY = globo1.direcctionY * -1
                        globo2.direcctionX = globo2.direcctionX * -1
                        globo2.direcctionY = globo2.direcctionY * 1

                        }
                        else if(globo1.position.X > globo2.position.X && globo1.position.Y < globo2.position.Y )
                        {
                        globo1.direcctionX = globo1.direcctionX * 1
                        globo1.direcctionY = globo1.direcctionY * 1
                        globo2.direcctionX = globo2.direcctionX * 1
                        globo2.direcctionY = globo2.direcctionY * -1

                        }
                        else if(globo1.position.X < globo2.position.X && globo1.position.Y > globo2.position.Y )
                        {
                        globo1.direcctionX = globo1.direcctionX * 1
                        globo1.direcctionY = globo1.direcctionY * -1
                        globo2.direcctionX = globo2.direcctionX * 1
                        globo2.direcctionY = globo2.direcctionY * 1

                        }
                        else if(globo1.position.X > globo2.position.X && globo1.position.Y > globo2.position.Y )
                        {
                        globo1.direcctionX = globo1.direcctionX * -1
                        globo1.direcctionY = globo1.direcctionY * 1
                        globo2.direcctionX = globo2.direcctionX * -1
                        globo2.direcctionY = globo2.direcctionY * -1

                        }
                        
                    }
                    else if(globo1.direcctionX === globo2.direcctionX && globo1.direcctionY != globo2.direcctionY)
                    {
                        if(globo1.position.X < globo2.position.X && globo1.position.Y < globo2.position.Y )
                        {
                        globo1.direcctionX = globo1.direcctionX * -1
                        globo1.direcctionY = globo1.direcctionY * -1
                        globo2.direcctionX = globo2.direcctionX * 1
                        globo2.direcctionY = globo2.direcctionY * 1

                        }
                        else if(globo1.position.X > globo2.position.X && globo1.position.Y < globo2.position.Y )
                        {
                        globo1.direcctionX = globo1.direcctionX * 1
                        globo1.direcctionY = globo1.direcctionY * 1
                        globo2.direcctionX = globo2.direcctionX * -1
                        globo2.direcctionY = globo2.direcctionY * 1

                        }
                        else if(globo1.position.X < globo2.position.X && globo1.position.Y > globo2.position.Y )
                        {
                        globo1.direcctionX = globo1.direcctionX * -1
                        globo1.direcctionY = globo1.direcctionY * 1
                        globo2.direcctionX = globo2.direcctionX * 1
                        globo2.direcctionY = globo2.direcctionY * 1

                        }
                        else if(globo1.position.X > globo2.position.X && globo1.position.Y > globo2.position.Y )
                        {
                        globo1.direcctionX = globo1.direcctionX * 1
                        globo1.direcctionY = globo1.direcctionY * 1
                        globo2.direcctionX = globo2.direcctionX * -1
                        globo2.direcctionY = globo2.direcctionY * -1

                        }
                        
                    }
                    else if(globo1.direcctionX === globo2.direcctionX && globo1.direcctionY === globo2.direcctionY)
                    {
                        if(globo1.position.X < globo2.position.X && globo1.position.Y < globo2.position.Y )
                        {
                        globo1.direcctionX = globo1.direcctionX * -1
                        globo1.direcctionY = globo1.direcctionY * -1
                        globo2.direcctionX = globo2.direcctionX * 1
                        globo2.direcctionY = globo2.direcctionY * 1

                        }
                        else if(globo1.position.X > globo2.position.X && globo1.position.Y < globo2.position.Y )
                        {
                        globo1.direcctionX = globo1.direcctionX * 1
                        globo1.direcctionY = globo1.direcctionY * -1
                        globo2.direcctionX = globo2.direcctionX * -1
                        globo2.direcctionY = globo2.direcctionY * 1

                        }
                        else if(globo1.position.X < globo2.position.X && globo1.position.Y > globo2.position.Y )
                        {
                        globo1.direcctionX = globo1.direcctionX * -1
                        globo1.direcctionY = globo1.direcctionY * 1
                        globo2.direcctionX = globo2.direcctionX * 1
                        globo2.direcctionY = globo2.direcctionY * -1

                        }
                        else if(globo1.position.X > globo2.position.X && globo1.position.Y > globo2.position.Y )
                        {
                        globo1.direcctionX = globo1.direcctionX * 1
                        globo1.direcctionY = globo1.direcctionY * 1
                        globo2.direcctionX = globo2.direcctionX * -1
                        globo2.direcctionY = globo2.direcctionY * -1

                        }
                        
                    }
                } 
              }         
            }
            else if(globo1.colDetect === true && globo2.colDetect === true){
                globo1.colDetect =  false
                globo2.colDetect = false
            }
        })
    })
},

//#endregion

//#region LISTENER
setListeners() { 
    
    
document.body.addEventListener("keydown",  (e) => {
    
    switch(e.key)
    {
         case "ArrowLeft":
             this.keyspressed.arrowLeft = true
             break;
         case "ArrowRight":
             this.keyspressed.arrowRight = true
             break; 
         case "ArrowUp" :
            this.keyspressed.arrowUp = false
            break;
         case "a":
             this.keyspressed.a = true
             break;
         case "d":
             this.keyspressed.d = true
             break;
        case "w":
             this.keyspressed.w = false
             break;
    }
    
});
document.body.addEventListener("keyup", (e) => {
   switch(e.key)
    {
         case "ArrowLeft":
             this.keyspressed.arrowLeft = false
             break;
         case "ArrowRight":
             this.keyspressed.arrowRight = false
             break;
         case "ArrowUp" :
            this.keyspressed.arrowUp = true
            break;
         case "a":
             this.keyspressed.a = false
             break;
         case "d":
             this.keyspressed.d = false
             break;
        case "w":
             this.keyspressed.w = true
             break;
    }

});


      if ( this.keyspressed.arrowLeft) {
        this.player[0].movePlayer(this.playerDir1=-1)
      }
      if ( this.keyspressed.arrowRight) {
        this.player[0].movePlayer(this.playerDir1=1)
      }
      if ( this.keyspressed.arrowUp) {
        this.player[0].createBullets()
        this.keyspressed.arrowUp = false
      }
      if (this.player.length > 1)
      {
        if ( this.keyspressed.a) {
        this.player[1].movePlayer(this.playerDir1=-1)
      }
        if (this.keyspressed.d) {
        this.player[1].movePlayer(this.playerDir1=1)
      } 
      if ( this.keyspressed.w) {
        this.player[1].createBullets()
        this.keyspressed.w = false
      }
      
    }
    
  },
//#endregion

//#region REMOVES
removeObject(player,bala,globo){
    player.removeBullet(bala)
    if(globo.constructor.name === "GlobosESP")
    {
        this.removeGlobosESP(globo)
    }
    else{
     this.removeGlobos(globo)
    }
   
  },

removeGlobos(globo){
    this.globos = this.globos.filter(element => element.globoID != globo.globoID)
  },
removeGlobosESP(globo){
    this.globos_esp = this.globos_esp.filter(element => element.globoID != globo.globoID)
  },
//#endregion

 
}


