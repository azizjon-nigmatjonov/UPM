export const sortByOrderNumber = (a, b) => {
  if (a.order_number > b.order_number) {
    return 1;
  } else return -1;
};

export const sortByOrderNumberReverse = (a, b) => {
  if (a.order_number < b.order_number) {
    return 1;
  } else return -1;
};
