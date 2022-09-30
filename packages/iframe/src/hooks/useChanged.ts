import { useState, useEffect } from 'react'
import usePrevious from './usePrevious'

export default function useChanged(value: unknown) {
  const previous = usePrevious(value)
  const [changed, setChanged] = useState<boolean>(false)
  useEffect(() => {
    if (value !== previous) {
      setChanged(true)
    }
  }, [value, previous])
  return changed
}
