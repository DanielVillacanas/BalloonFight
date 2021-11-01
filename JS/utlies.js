const utilies ={

    checkCircularCollision(radius1,radius2,posX1,posY1,posX2,posY2)
    {
        let xdis = posX1+radius1 - posX2+radius2
        let ydis = posY1+radius1 - posY2 + radius2

        let TotalDis = Math.sqrt(Math.pow(xdis,2) + Math.pow(ydis,2))

       return (TotalDis < radius1+radius2)
    }


}