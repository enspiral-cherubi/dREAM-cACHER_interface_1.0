function createStarField () {

  ////////////////////////////////////
  //    create sun angle            //
  ////////////////////////////////////

  // begining position
  var sunAngle = -1/6*Math.PI*2;
  // the day duraction in seconds
  var dayDuration = 20
  // then you periodically update it
  onRenderFcts.push(function(delta, now){
      sunAngle    += delta/dayDuration * Math.PI*2
  })

  ////////////////////////////////////
  //    add the starField           //
  ////////////////////////////////////

  var starField   = new THREEx.DayNight.StarField()
  scene.add( starField.object3d )
  onRenderFcts.push(function() {
    starField.update(sunAngle)
  })
}
