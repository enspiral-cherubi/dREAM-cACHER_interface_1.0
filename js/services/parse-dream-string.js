var capitalize = require('capitalizer')
var tagTemplate = require('./../templates/tag')

// TODO: refactor
function parseDreamString(dreamString, tagWords) {
  var outputString = dreamString
  for (var i = 0; i < tagWords.length; i++) {

    var currentTagWordSpace = " " + tagWords[i] + " "
    var currentTagWordComma = " " + tagWords[i] + ","
    var currentTagWordStop = " " + tagWords[i] + "."

    // all lowercase
    var aTag = " " + tagTemplate(tagWords[i]) + " "
    outputString = outputString.replace(currentTagWordSpace, aTag)

    aTag = " " + tagTemplate(tagWords[i]) + ","
    outputString = outputString.replace(currentTagWordComma, aTag)

    aTag = " " + tagTemplate(tagWords[i]) + "."
    outputString = outputString.replace(currentTagWordStop, aTag)

    // capitalised

    currentTagWordSpace = " " + capitalize(tagWords[i]) + " "
    currentTagWordComma = " " + capitalize(tagWords[i]) + ","
    currentTagWordStop = " " + capitalize(tagWords[i]) + "."

    aTag = " " + tagTemplate(capitalize(tagWords[i])) + " "
    outputString = outputString.replace(currentTagWordSpace, aTag)

    aTag = " " + tagTemplate(capitalize(tagWords[i])) + ","
    outputString = outputString.replace(currentTagWordComma, aTag)

    aTag = " " + tagTemplate(capitalize(tagWords[i])) + "."
    outputString = outputString.replace(currentTagWordStop, aTag)

    // allCaps
    aTag = tagTemplate(allCapsTag)
    var allCapsTag = tagWords[i].toUpperCase()

    currentTagWordSpace = " " + tagWords[i].toUpperCase() + " "
    currentTagWordComma = " " + tagWords[i].toUpperCase() + ","
    currentTagWordStop = " " + tagWords[i].toUpperCase() + "."

    aTag = " " + tagTemplate(tagWords[i].toUpperCase()) + " "
    outputString = outputString.replace(currentTagWordSpace, aTag)

    aTag = " " + tagTemplate(tagWords[i].toUpperCase()) + ","
    outputString = outputString.replace(currentTagWordComma, aTag)

    aTag = " " + tagTemplate(tagWords[i].toUpperCase()) + "."
    outputString = outputString.replace(currentTagWordStop, aTag)
  }
  return outputString
}

module.exports = parseDreamString
