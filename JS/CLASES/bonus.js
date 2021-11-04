class Bonus {

    constructor(CTX,canvasDOM,bonusNum,speedY,floorPosY,bonusID)
    {
        this.CTX = CTX
        this.canvasDOM = canvasDOM
        this.bonusNum = bonusNum
        this.speedY = speedY
        this.floorPosY = floorPosY
        this.bonusID = bonusID

        this.bonusImg = ["double_point.png","fast.png","freeze.png","shield.jpg","slow.png","freeze.png","balloons.png"]

        this.size = {
            width : 60,
            height : 60
        }

        this.position = {
            Y : - this.size.width,
            X : Math.floor(Math.random()*(this.canvasDOM.width-(this.size.width*2)) + (this.size.width*2))
        }
        this.img = undefined
        
    }
    
    moveBonus(){
        this.position.Y += this.speedY
    }

    drawBonus(){
        this.moveBonus()
        this.img = new Image()
        this.img.src = `../../img/${this.bonusImg[this.bonusNum]}`
        switch(this.bonusNum)
        {
            case 0: case 1: case 2: case 3:
            this.CTX.fillStyle = "green"
            this.CTX.fillRect(this.position.X,this.position.Y,this.size.width,this.size.height)
            break;
            case 4: case 5:
            this.CTX.fillStyle = "red"
            this.CTX.fillRect(this.position.X,this.position.Y,this.size.width,this.size.height)
             break;
            case 6:
            this.CTX.fillStyle = "yellow"
            this.CTX.fillRect(this.position.X,this.position.Y,this.size.width,this.size.height)
            break
        }
        this.CTX.fillStyle = "black"
        this.CTX.drawImage(this.img,this.position.X+10,this.position.Y +10,40,40)
    }

    activateBonus(player){
        switch(this.bonusNum)
        {
            case 0: //X2 POINTS
            player.bonus2x = 1;
            setTimeout(() => {
                console.log("RESET BONUS")
                player.bonus2x = 0;
            }, 6000);
            break;
            case 1: //SPEED UP
            if(player.speed  != 0){
                player.speed += 5
                setTimeout(() => {
                console.log("RESET BONUS")
                player.speed -= 5;
                }, 6000);
             }
            break;
            case 2: // FREEZE THE OTHER PLAYER
                if(player.img_name === "player0_sprite.png")
                {
                    gameManager.player[0].speed = 0;
                    setTimeout(() => {
                    console.log("RESET BONUS")
                    gameManager.player[0].speed = 15;
                    }, 6000);
                }
                else
                {
                    gameManager.player[1].speed = 0;
                    setTimeout(() => {
                    console.log("RESET BONUS")
                    gameManager.player[1].speed = 15;
                    }, 6000);
                }
                break;
                case 3: //INMORTAL
                    player.inmortal = true
                    setTimeout(() => {
                    console.log("RESET BONUS")
                    player.inmortal = false
                    }, 10000);
                break;
                case 4: //SLOW
                if(player.speed  != 0){
                    player.speed -= 5
                    setTimeout(() => {
                    console.log("RESET BONUS")
                    player.speed += 5;
                    }, 6000);
                }
                break;
                case 5: //FREEZE
                if(player.speed  != 0){
                   player.speed = 0;
                    setTimeout(() => {
                    console.log("RESET BONUS")
                    player.speed = 15;
                    }, 6000);
                }
                break;
                case 6://PARTY HARD
                    gameManager.numglobos = 40
                    gameManager.globosSpawnTime = 20
                    setTimeout(() => {
                    gameManager.numglobos = 10
                    gameManager.globosSpawnTime = 50
                    }, 6000);
        }
    }
    checkBorderDown(){
       // this.position.Y + this.size.height >=this.canvasDOM.height - this.floorPosY ?  true : false
       if(this.position.Y + this.size.height >=this.canvasDOM.height - this.floorPosY)
       {
           return true
       }
       else
       {
          return false
       }
    }
}