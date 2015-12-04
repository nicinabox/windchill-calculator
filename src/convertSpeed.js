export default (speed, currentUnitSystem = 'US') => {
  if (currentUnitSystem === 'US') {
    return (speed * 1.60934).toFixed(1)
  } else {
    return (speed / 1.60934).toFixed(1)
  }
}
