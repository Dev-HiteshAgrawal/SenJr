import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

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