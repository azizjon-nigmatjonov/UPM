

const sortByBoardOrderNumber = (a, b) => {
  if (a.board_order_number > b.board_order_number) {
    return 1
  }
  else return -1
}

export default sortByBoardOrderNumber