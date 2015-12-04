var toC = (t) => ((t - 32) * 5 / 9).toFixed(1)
var toF = (t) => (t * 9 / 5 + 32).toFixed(1)

export default (temp, currentUnitSystem = 'US') => {
  if (currentUnitSystem === 'US') {
    return toC(temp)
  } else {
    return toF(temp)
  }
}
