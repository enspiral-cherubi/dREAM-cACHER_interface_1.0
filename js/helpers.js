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