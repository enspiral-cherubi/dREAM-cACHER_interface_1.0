

function setPositionX (speedX, maxDistance) {
  return Math.sin(timer * speedX) * maxDistance;
}

function setPositionY (speedY, maxDistance) {
  return Math.sin((timer * speedY) - Math.PI/2) * maxDistance
}

function oldPositionX (vectorAcuracy, speedX, maxDistance) {
  return Math.sin((timer - vectorAcuracy) * speedX) * maxDistance;
}

function oldPositionY (vectorAcuracy, speedY, maxDistance) {
  return Math.sin(((timer - vectorAcuracy) * speedY) - Math.PI/2) * maxDistance
}

function logFuck() {
  console.log("fuck")
}
// old_positionX = Math.sin((timer - 0.000001) * speedX) * distanceX;