const gameManager = {

canvasDOM : undefined,

CTX : undefined,

size : {
    height:undefined,
    width:undefined,
},

background:undefined,

floorPosY : 100,
player:[],
playerDirecction:[playerDir1 = 0,playerDir2 = 0],
playerSpeed:[playerSpeed1 = 15,playerSpeed2 = 15],
globos:[],
globos_esp:[],
globoID : 0,

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


init(){
    
    this.setContext()
    this.setDimensions()
    this.crateBackGround()
    this.createPlayer()
    this.createPlayer()
    this.start()
    
},

start(){

    setInterval(() => {
        this.createGlobo()
        this.cleanScreen()
        this.drawAll()
        this.setListeners()
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


crateBackGround(){
    colorNumber = Math.round(Math.random() * 4)

    this.background = new Background (this.CTX,this.canvasDOM,this.size.height,this.size.width, colorNumber)
},

createPlayer(){
    this.player.push(new Player(this.CTX,this.canvasDOM,pos={x:this.size.width/2,y:this.size.height-200},"player_sprite.png",playerSpeed1))
},
 createGlobo(){
     if(this.ciclesCont%100 === 0 && this.globos.length < 10){
        this.globos.push(new Globos(this.CTX,this.canvasDOM,colorNumber,2,this.floorPosY,this.globoID))
        this.globoID++
     }
 },
cleanScreen(){

    this.CTX.clearRect(0, 0, this.size.width, this.size.height)

},

drawAll(){
    this.drawBackGround()
    this.drawPlayer()
    this.drawBullets()
    this.drawGlobos() 
    this.player[0].paintScore()
    this.checkAllCollisions()
},

drawPlayer(){

    this.player.forEach(element => element.drawPlayer(this.ciclesCont));

},
drawGlobos(){
    this.globos.forEach(element => {
        element.drawGlobos()
    });
},
drawBackGround(){

    this.background.draw(this.backgroundColor)
},
drawBullets(){
    this.player.forEach(element => {
        element.paintBullets()
    });
},

checkAllCollisions()
{
    this.collisionPlayerGlobo()
    this.collisionBulletGlobo()
},

collisionPlayerGlobo(){//Revisar collider
    this.player.forEach(element => {
        this.globos.forEach( globos =>{
             if(utilies.checkCircularRectagleCollision(globos.radius,element.size.width/element.frames - 15,element.size.height - 35, globos.position.X,globos.position.Y,element.pos.X,element.pos.Y)){
                 this.removeGlobos(globos)
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
                    if (globos.colorNumber === this.background.colorNumber) {
                        player.score++
                        console.log(player.score)
                    }
                 }
            })
        })
    });
},

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

  removeObject(player,bala,globo){
    player.removeBullet(bala)

    this.removeGlobos(globo)
  },

  removeGlobos(globo){
    this.globos = this.globos.filter(element => element.globoID != globo.globoID)
  }

}