const utilies = {
  checkCircularCollision(radius1, radius2, posX1, posY1, posX2, posY2) {
    let xdis = posX1 + radius1 - posX2;
    let ydis = posY1 + radius1 - posY2;
    let TotalDis = Math.sqrt(Math.pow(xdis, 2) + Math.pow(ydis, 2));
    return TotalDis < radius1 + radius2;
  },
  checkCircularRectagleCollision(
    radius1,
    width,
    height,
    posX1,
    posY1,
    posX2,
    posY2
  ) {
    let xdis = posX1 - (posX2 + width / 2);
    let ydis = posY1 - (posY2 + height / 2);
    let TotalDis = Math.sqrt(Math.pow(xdis, 2) + Math.pow(ydis, 2));
    if (posY1 < posY2 + height / 2) {
      return TotalDis < radius1 + height / 2;
    } else if (posY1 > posY2 + height / 2) {
      return TotalDis < radius1 + width / 2;
    }
  },
  checkBalloonCollision(radius1, radius2, posX1, posY1, posX2, posY2) {
    let xdis = posX1 - posX2;
    let ydis = posY1 - posY2;
    let TotalDis = Math.sqrt(Math.pow(xdis, 2) + Math.pow(ydis, 2));

    return TotalDis < radius1 + radius2;
  },

  checkRectangleRectagleCollision(bullet, bonus) {
    if (
      bullet.pos.X < bonus.position.X + bonus.size.width + 5 &&
      bullet.pos.X + bullet.width + 5 > bonus.position.X &&
      bullet.pos.Y < bonus.position.Y + bonus.size.height &&
      bullet.height + bullet.pos.Y > bonus.position.Y
    ) {
      return true;
    } else {
      return false;
    }
  },
};
