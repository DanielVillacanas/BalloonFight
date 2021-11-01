class Background  {

constructor(CTX,canvasDOM,height,width,colorNumber){

    this.size={
        height: height,
        width: width,
    }
    this.CTX = CTX
    this.canvasDOM = canvasDOM
    this.posX = 0
    this.posY = 0, 

    this.image = undefined
    this.floor_image = undefined

    this.colorNumber = colorNumber;

    this.init()

    this.colorsBack = ["rgba(186, 5, 236, 0.4)","rgba(229, 235, 7, 0.4)","rgba(30, 197, 0, 0.4)","rgba(0, 33, 197, 0.4)","rgba(0, 0, 0 ,0.0)"]
} 


init() {
this.image =  new Image()
this.image.src = `../img/background.png`

this.floor_image = new Image()
this.floor_image.src = `../img/floor.png`
}

draw() {

    this.image.complete ? this.CTX.drawImage(this.image,0,0,this.size.width,this.size.height) : null
    
    this.floor_image.complete ? this.CTX.drawImage(this.floor_image,0,this.size.height-this.floor_image.height,this.size.width,this.floor_image.height) : null

    this.CTX.fillStyle = this.colorsBack[this.colorNumber];
    this.CTX.fillRect(this.posX,this.posY,this.size.width,this.canvasDOM.height)
}

}