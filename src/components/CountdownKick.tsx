import { useState, useEffect, ReactNode } from 'react'
import { useIndividualGoals } from '../contexts/IndividualGoalsContext'

interface CountdownKickProps {
  title: string,
  kickType: string,
  children: ReactNode
}

export function CountdownKick({ title, kickType, children }: CountdownKickProps) {
  const [time, setTime] = useState(300)
  const { 
    autoGoals, 
    setAutoGoals, 
    penaltyGoals, 
    setPenaltyGoals, 
    freeKickGoals, 
    setFreeKickGoals,
    trailGoals,
    setTrailGoals
  } = useIndividualGoals()


  useEffect(() => {
    setTimeout(() => {
      if (time > 0) {
        setTime(time - 1)
      } else { // Time to kick
        switch (kickType) {

          case 'penalty': // Calculate probability to do goal (90% of chance)
            const penaltyProbability = Math.random() * 100
            if (penaltyProbability < 90) {
              // console.log('penaltyProbability', penaltyProbability)
              // console.log('PENALTY GOAL')
              setPenaltyGoals(penaltyGoals + 1)
            } else {
              // console.log('penaltyProbability', penaltyProbability)
              // console.log('PENALTY LOST')
            }
            setTime(300)
          break

          case 'free-kick': // Calculate probability to do goal (70% of chance)
            const freeKickProbability = Math.random() * 100
            if (freeKickProbability < 70) {
              // console.log('freeKickProbability', freeKickProbability)
              // console.log('FREE KICK GOAL')
              setFreeKickGoals(freeKickGoals + 1)
            } else {
              // console.log('freeKickProbability', freeKickProbability)
              // console.log('FREE KICK LOST')
            }
            setTime(300)
          break

          case 'trail': // Calculate probability to do goal (30% of chance)
            const trailProbability = Math.random() * 100
            if (trailProbability < 30) {
              console.log('trailProbability', trailProbability)
              console.log('TRAIL GOAL')
              setTrailGoals(trailGoals + 1)
            } else {
              console.log('trailProbability', trailProbability)
              console.log('TRAIL LOST')
            }
            setTime(300)
          break

          default:
            setAutoGoals(autoGoals + 1)
            setTime(300)
        }
       
      }
    }, 1000)
  }, [time])

  return (
    <>
      <h1>{title}: {time}</h1>
      {children}
    </>
  )
}