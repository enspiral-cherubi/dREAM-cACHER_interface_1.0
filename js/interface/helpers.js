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
// If x*x + y*y + z*z < 1, keep coords
// Normalize dividing x, y and z by Math.sqrt(x*x + y*y + z*z)


function getXYZ () {
  var coords = []
  for (var i = 0; i < 3; i++) {
    coords.push(getRandom(-1,1))
  }
  return coords
}

function isSuitableCoords (coords) {
  return (coords[0]*coords[0] + coords[1]*coords[1] + coords[2]*coords[2]) < 1
}

function normalizedCoordsFrom (coords) {
  var denominator = Math.sqrt(coords[0]*coords[0] + coords[1]*coords[1] + coords[2]*coords[2])
  var normCoords = coords.map(function (coord) {
    return coord / denominator
  })
  return normCoords
}

function getRandomCoords () {
  var normCoords, coords, coordsFound = false

  while (coordsFound === false) {
    coords = getXYZ()
    if (isSuitableCoords(coords)) {
      coordsFound = true
      normCoords = normalizedCoordsFrom(coords)
    }
  }

  return normCoords
}
