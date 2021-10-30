class Bullets {
    constructor(CTX,canvasDOM,posX,posY,speed,color)
    {
        this.CTX = CTX;
        this.canvasDOM =  canvasDOM
        this.pos = {
            X : posX,
            Y : posY,
        }
        this.speed = speed
        this.direction = -1
        this.color = color
    }

    drawBullets(){

        this.CTX.fillStyle = this.color;
        this.CTX.fillRect(this.pos.X + 15,this.pos.Y + 5,5,20)
        this.moveBullets()
    }
    moveBullets(){
        this.pos.Y += this.speed * this.direction
    }
    removeBullets(){
        
    }
}