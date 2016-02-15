function parseDreamString(dreamString, tagWords) {
  var outputString = dreamString
  for (var i = 0; i < tagWords.length; i++) {

    var currentTagWordSpace = " " + tagWords[i] + " "
    var currentTagWordComma = " " + tagWords[i] + ","
    var currentTagWordStop = " " + tagWords[i] + "."

    // all lowercase
    var aTag = " " + generateATag(tagWords[i]) + " "
    outputString = outputString.replace(currentTagWordSpace, aTag)

    aTag = " " + generateATag(tagWords[i]) + ","
    outputString = outputString.replace(currentTagWordComma, aTag)

    aTag = " " + generateATag(tagWords[i]) + "."
    outputString = outputString.replace(currentTagWordStop, aTag)

    // capitalised

    currentTagWordSpace = " " + capitalizeFirstLetter(tagWords[i]) + " "
    currentTagWordComma = " " + capitalizeFirstLetter(tagWords[i]) + ","
    currentTagWordStop = " " + capitalizeFirstLetter(tagWords[i]) + "."

    aTag = " " + generateATag(capitalizeFirstLetter(tagWords[i])) + " "
    outputString = outputString.replace(currentTagWordSpace, aTag)

    aTag = " " + generateATag(capitalizeFirstLetter(tagWords[i])) + ","
    outputString = outputString.replace(currentTagWordComma, aTag)

    aTag = " " + generateATag(capitalizeFirstLetter(tagWords[i])) + "."
    outputString = outputString.replace(currentTagWordStop, aTag)

    // allCaps
    aTag = generateATag(allCapsTag)
    var allCapsTag = tagWords[i].toUpperCase()

    currentTagWordSpace = " " + tagWords[i].toUpperCase() + " "
    currentTagWordComma = " " + tagWords[i].toUpperCase() + ","
    currentTagWordStop = " " + tagWords[i].toUpperCase() + "."

    aTag = " " + generateATag(tagWords[i].toUpperCase()) + " "
    outputString = outputString.replace(currentTagWordSpace, aTag)

    aTag = " " + generateATag(tagWords[i].toUpperCase()) + ","
    outputString = outputString.replace(currentTagWordComma, aTag)

    aTag = " " + generateATag(tagWords[i].toUpperCase()) + "."
    outputString = outputString.replace(currentTagWordStop, aTag)
  }
  return outputString
}

function generateATag(text) {
  var html = "<a href='/"
  + text
  + "' "
  + "class='tag"
  + "' "
  + "id='"
  + text
  + "'"
  + " type='"
  + "button'>"
  + text
  + "</a>"
  return html
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
