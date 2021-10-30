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
balas:[],

ciclesCont :0,

FPS:60,


init(){

    this.setContext()
    this.setDimensions()
    this.crateBackGround()
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
    this.background = new Background (this.CTX,this.size.height,this.size.width)
},

createPlayer(){
    this.player.push(new Player(this.CTX,this.canvasDOM,pos={x:this.size.width/2,y:this.size.height-200},50,"player_sprite.png",playerSpeed1))
},
 createGlobo(){
     if(this.ciclesCont%100 === 0 && this.globos.length < 10){
        this.globos.push(new Globos(this.CTX,this.canvasDOM,"white",2,this.floorPosY))
     }
 },
cleanScreen(){

    this.CTX.clearRect(0, 0, this.size.width, this.size.height)

},

drawAll(){

    this.drawBackGround()
    this.drawPlayer()
    this.drawGlobos()

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
    this.background.draw()
},

setListeners() {
    document.onkeydown = (e) => {
      if (e.key === "ArrowLeft") {
        this.player[0].movePlayer(this.playerDir1=-1)
      }
      if (e.key === "ArrowRight") {
        this.player[0].movePlayer(this.playerDir1=1)
      }
      if (this.player.length > 1)
      {
         if (e.key === "a") {
        this.player[1].movePlayer(this.playerDir1=-1)
      }
      if (e.key === "d") {
        this.player[1].movePlayer(this.playerDir1=1)
      } 
      }
    }
    
  },

}