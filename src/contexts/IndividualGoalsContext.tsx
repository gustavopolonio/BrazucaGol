import { createContext, ReactNode, useState, useContext, Dispatch, SetStateAction, useEffect } from 'react'
import { api } from '../services/api'

interface IndividualGoalsProviderProps {
  children: ReactNode
}

interface IndividualGoalsContextProps {
  autoGoals: number,
  setAutoGoals: Dispatch<SetStateAction<number>>,
  penaltyGoals: number,
  setPenaltyGoals: Dispatch<SetStateAction<number>>,
  freeKickGoals: number,
  setFreeKickGoals: Dispatch<SetStateAction<number>>,
  trailGoals: number,
  setTrailGoals: Dispatch<SetStateAction<number>>,
  totalGoals: number,
  hourlyGoals: number,
  setHourlyGoals: Dispatch<SetStateAction<number>>
}

const IndividualGoalsContext = createContext({
  autoGoals: 0,
  setAutoGoals: () => {},
  penaltyGoals: 0,
  setPenaltyGoals: () => {},
  freeKickGoals: 0,
  setFreeKickGoals: () => {},
  trailGoals: 0,
  setTrailGoals: () => {},
  totalGoals: 0,
  hourlyGoals: 0,
  setHourlyGoals: () => {}
} as IndividualGoalsContextProps)

export function IndividualGoalsProvider({ children }: IndividualGoalsProviderProps) {
  const [autoGoals, setAutoGoals] = useState(0)
  const [penaltyGoals, setPenaltyGoals] = useState(0)
  const [freeKickGoals, setFreeKickGoals] = useState(0)
  const [trailGoals, setTrailGoals] = useState(0)
  const [totalGoals, setTotalGoals] = useState(0)
  const [hourlyGoals, setHourlyGoals] = useState(0)

  const fetchIndividualGoals = async () => {
    console.log('hihihi')
    const response = await api.get("/api/individual-goals")
    const { 
      avatarAutoGoals, 
      avatarPenaltyGoals, 
      avatarFreeKickGoals, 
      avatarTrailGoals,
      avatarHourlyGoals
    } = response.data.data

    setAutoGoals(avatarAutoGoals)
    setPenaltyGoals(avatarPenaltyGoals)
    setFreeKickGoals(avatarFreeKickGoals)
    setTrailGoals(avatarTrailGoals)
    setHourlyGoals(avatarHourlyGoals)
  }
  fetchIndividualGoals()

  const value = { 
    autoGoals, 
    setAutoGoals, 
    penaltyGoals, 
    setPenaltyGoals, 
    freeKickGoals, 
    setFreeKickGoals,
    trailGoals,
    setTrailGoals,
    totalGoals,
    hourlyGoals,
    setHourlyGoals
  }

  useEffect(() => {
    setTotalGoals(autoGoals + penaltyGoals + freeKickGoals + trailGoals)
    // console.log('totalGoals', totalGoals)
  }, [autoGoals, penaltyGoals, freeKickGoals, trailGoals])


  return (
    <IndividualGoalsContext.Provider value={value}>
      {children}
    </IndividualGoalsContext.Provider>
  )
}

export const useIndividualGoals = () => useContext(IndividualGoalsContext)