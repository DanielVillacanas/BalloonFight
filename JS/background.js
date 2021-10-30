class Background  {

constructor(CTX,height,width){

    this.size={
        height: height,
        width: width,
    }
    this.CTX = CTX
    this.posX = 0
    this.posY = 0, 

    this.image = undefined
    this.floor_image = undefined
    this.init()
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
}

}