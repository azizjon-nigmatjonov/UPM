import { useRef, useState } from "react"


const useMemorizedState = (initialValue) => {
  const [value, _setValue] = useState(initialValue)

  const valueRef = useRef(value)
  const setValue = data => {
    valueRef.current = data
    _setValue(data)
  }

  return [value, setValue, valueRef]
}

export default useMemorizedState