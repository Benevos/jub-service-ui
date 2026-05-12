import StoreProvider from '@/contexts/StoreProvider'
import React from 'react'

function Providers({ children } : { children: React.ReactNode }) {
  return (
    <StoreProvider>
        { children }
    </StoreProvider>
  )
}

export default Providers