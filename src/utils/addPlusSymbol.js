export const addPlusSymbol = (val) => {
  if(val > 0) return `+${val}`
  return `+${val * (-1)}`
}

export const subtractSymbol = (val) => {
  if(val > 0) return `-${val}`
  return val
}