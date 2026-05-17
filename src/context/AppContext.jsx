import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext)

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('light')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const value = {
    theme,
    setTheme,
    sidebarOpen,
    setSidebarOpen,
    searchQuery,
    setSearchQuery
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}