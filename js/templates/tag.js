module.exports = function (text) {
  return "<a " + "href='/" + text + "' " + "class='tag' " + "id='" + text + "'>"
       + text
       + "</a>"
}
