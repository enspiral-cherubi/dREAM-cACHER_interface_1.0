// TODO: use npm module instead of this

function getRandom (min, max) {
  return Math.random() * (max - min) + min;
}

module.exports = getRandom
