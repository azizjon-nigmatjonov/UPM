

export const statusStates = [
  {
    label: 'REJECTED',
    value: -1,
  },
  {
    label: 'NOT_DONE',
    value: 0,
  },
  {
    label: 'DONE',
    value: 1,
  },
  {
    label: 'ACCEPTED',
    value: 2,
  }
]

export const getStatusState = (stateValue = 0) => {
  return statusStates.find(status => status.value === stateValue)
}