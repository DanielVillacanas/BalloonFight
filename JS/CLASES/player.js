class Player {

    constructor(CTX,canvasDOM,pos,radius,img_name,speed)
    {
        this.CTX =  CTX;
        this.pos = {
            X : pos.x,
            Y : pos.y,
        }
        this.radius = radius;
        this.img = undefined;
        this.img_name =  img_name;
        this.speed = speed;

        this.size ={
            height : 117,
            width : 1446,
        }
        this.canvasSize ={
            width : canvasDOM.width,
            height : canvasDOM.height,
        }

        //Parametros del sprite generico
        this.frames = 16;
        this.framesIndex = 0;


    }

    drawPlayer(ciclesCont){
        
        this.img = new Image()
        this.img.src = `../../img/${this.img_name}`
        this.CTX.drawImage(
            this.img,
            this.framesIndex * this.size.width / this.frames , 0 ,
            this.size.width/this.frames,this.size.height,
            this.pos.X , this.pos.Y ,
            this.size.width/this.frames,this.size.height)

            if(ciclesCont % 5 === 0){
                  this.animate()
            }
      

    }

    movePlayer(direcction){

        this.checkBorders(direcction) ? this.pos.X += 0 : this.pos.X += this.speed * direcction

    }

    checkBorders(direcction){

       return this.pos.X + 20 > this.canvasSize.width - this.size.width/this.frames && direcction === 1 || this.pos.X - 20 < 0 && direcction === -1 ?  true : false
  
    }
    
    animate() {
    if (this.framesIndex === 15) {
      this.framesIndex = 0
    }
    this.framesIndex++
  }

}