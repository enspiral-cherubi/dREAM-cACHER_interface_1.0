var THREE = require('three')
var getMatrixData = require('./get-matrix-data')
var geometryChooser = require('./../services/geometry-chooser')
var range = require('lodash.range')
var applyVertexColorsToGeometry = require('./../services/apply-vertex-colors-to-geometry')

module.exports = function (dreams) {
  var allDreamsGeometry = new THREE.Geometry()
  var pickingGeometry = new THREE.Geometry()
  var pickingData = []

  dreams.forEach(function ( dream ) {
    var matrixData = getMatrixData(dream.objectId)
    var singleDreamGeom = geometryChooser(dream.sentiment)
    var quaternion = new THREE.Quaternion()
    quaternion.setFromEuler( matrixData.rotation, false );
    var matrix = new THREE.Matrix4()
    matrix.compose( matrixData.position, quaternion, matrixData.scale );

    // this is how we can find the faces for this particular geom, after it is merged into the single geom
    var faceCountBeforeMerge = allDreamsGeometry.faces.length
    allDreamsGeometry.merge(singleDreamGeom, matrix)
    var faceIndices = {
      low: faceCountBeforeMerge,
      hi: faceCountBeforeMerge + singleDreamGeom.faces.length
    }
    range(faceIndices.low, faceIndices.hi).forEach(function (faceIndex) { // this is to support dream.viewed feature yet to be added to the rails back end
      allDreamsGeometry.faces[faceIndex].materialIndex = (dream.viewed) ? 1 : 0
    })

    // give the singleDreamGeom's vertices a color corresponding to the "id"
    var color = new THREE.Color()
    applyVertexColorsToGeometry( singleDreamGeom, color.setHex( dream.objectId ) )

    pickingGeometry.merge( singleDreamGeom, matrix )

    pickingData.push({
      position: matrixData.position,
      rotation: matrixData.rotation,
      scale: matrixData.scale,
      faceIndices: faceIndices
    })
  })

  return {
    allDreamsGeometry: allDreamsGeometry,
    pickingGeometry: pickingGeometry,
    pickingData: pickingData
  }
}
