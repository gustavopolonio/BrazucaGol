import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { api } from '../services/api'

interface UserPreferencesProviderProps {
  children: ReactNode
}

interface UserPreferences {
  kickAlert: boolean
  goalSound: boolean
}

interface UserPreferencesQueryResponse {
  userPreferences: {
    kickAlert: boolean
    goalSound: boolean
  }
  updateUserPreferences: (preferences: UserPreferences) => void
}

const UserPreferencesContext = createContext({} as UserPreferencesQueryResponse)

export function UserPreferencesProvider({
  children,
}: UserPreferencesProviderProps) {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    goalSound: false,
    kickAlert: false,
  })

  useEffect(() => {
    const getPreferences = async () => {
      const response = await api.get('/api/user-preferences')
      setUserPreferences(response.data.userPreferences)
    }
    getPreferences()
  }, [])

  function updateUserPreferences(preferences: UserPreferences) {
    setUserPreferences(preferences)
  }

  return (
    <UserPreferencesContext.Provider
      value={{ userPreferences, updateUserPreferences }}
    >
      {children}
    </UserPreferencesContext.Provider>
  )
}

export const useUserPreferences = () => useContext(UserPreferencesContext)
