function getRandom (min, max) {
  return Math.random() * (max - min) + min;
}

function dreamDiv (dream) {
  var html = ""
  + "<div id='dreamDiv'>"
  +   "<p>"
  +     dream
  +   "</p>"
  + "<div>"
  return html
}


// Pick a random point inside the [-1,1]x[-1,1]x[-1,1] cube
// If x*x + y*y + z*z > 1 repeat from 1
// Normalize dividing x, y and z by Math.sqrt(x*x + y*y + z*z)


function getXYZ () {
  var coords = []
  for (var i = 0; i < 3; i++) {
    coords.push(getRandom(-1,1))
  }
  return coords
}

var normCoords
function getRandomCoords () {
  var coords = getXYZ()
  if ((coords[0]*coords[0] + coords[1]*coords[1] + coords[2]*coords[2]) < 1) {
    normCoords = []
    for (var i = 0; i < coords.length; i++) {
      normCoords.push( coords[i] / Math.sqrt(coords[0]*coords[0] + coords[1]*coords[1] + coords[2]*coords[2]) )
    }
    return normCoords
  } else {
    getRandomCoords()
  }

}

getRandomCoords()


