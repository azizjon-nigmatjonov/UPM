

export const computeIndexWhenKeypress = (keyCode, currentIndex, maxIndex, width ) => {

  
  if (currentIndex === null) return 0
  
  const numberOfColumns = Math.floor(width / 130)
  
  switch (keyCode) {
    case 'ArrowRight':
      return computeRightClick(currentIndex, numberOfColumns, maxIndex)

    case 'ArrowLeft':
      return computeLeftClick(currentIndex, numberOfColumns, maxIndex)
  
    case 'ArrowDown':
      return computeDownClick(currentIndex, numberOfColumns, maxIndex)
    
    case 'ArrowUp':
      return computeUpClick(currentIndex, numberOfColumns)

    default:
      return currentIndex
  }
}


const computeRightClick = (currentIndex, numberOfColumns, maxIndex) => {
  if (((currentIndex + 1) % numberOfColumns) === 0) return currentIndex
  if(currentIndex === maxIndex) return currentIndex
  return currentIndex + 1
}

const computeLeftClick = (currentIndex, numberOfColumns) => {
  if (((currentIndex) % numberOfColumns) === 0) return currentIndex
  return currentIndex - 1
}

const computeDownClick = (currentIndex, numberOfColumns, maxIndex) => {
  if (currentIndex + numberOfColumns <= maxIndex) return currentIndex + numberOfColumns
  const numberOfRows = Math.ceil((maxIndex + 1) / numberOfColumns)
  const currentRow = Math.ceil(currentIndex / numberOfColumns)
  if(currentRow === numberOfRows) return currentIndex
  return maxIndex
}

const computeUpClick = (currentIndex, numberOfColumns) => {
  if((currentIndex - numberOfColumns) < 0) return currentIndex
  return currentIndex - numberOfColumns
}