import { useState, useEffect } from 'react'

export function useApiHealth(): { isConnected: boolean } {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    fetch('/api/rovers')
      .then(() => setIsConnected(true))
      .catch(() => setIsConnected(false))
  }, [])

  return { isConnected }
}
