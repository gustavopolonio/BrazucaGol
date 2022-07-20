import { ReactNode, createContext, useState, Dispatch, SetStateAction, useContext } from 'react'

interface BlockKicksProviderProps {
  children: ReactNode
}

interface BlockKicksContextProps {
  blockNearAutoGoal: boolean;
  setBlockNearAutoGoal: Dispatch<SetStateAction<boolean>>;
  blockTrailNearAutoGoal: boolean;
  setBlockTrailNearAutoGoal: Dispatch<SetStateAction<boolean>>;
  blockNearHourlyChange: boolean;
  setBlockNearHourlyChange: Dispatch<SetStateAction<boolean>>
}

const BlockKicksContext = createContext({
  blockNearAutoGoal: false,
  setBlockNearAutoGoal: () => {},
  blockTrailNearAutoGoal: false,
  setBlockTrailNearAutoGoal: () => {},
  blockNearHourlyChange: false,
  setBlockNearHourlyChange: () => {}
} as BlockKicksContextProps)

export function BlockKicksProvider({ children }: BlockKicksProviderProps) {
  const [blockNearAutoGoal, setBlockNearAutoGoal] = useState(false)
  const [blockTrailNearAutoGoal, setBlockTrailNearAutoGoal] = useState(false)
  const [blockNearHourlyChange, setBlockNearHourlyChange] = useState(false)

  const value = {
    blockNearAutoGoal,
    setBlockNearAutoGoal,
    blockNearHourlyChange,
    setBlockNearHourlyChange,
    blockTrailNearAutoGoal,
    setBlockTrailNearAutoGoal
  }

  return (
    <BlockKicksContext.Provider value={value}>
      {children}
    </BlockKicksContext.Provider>
  )
}

export const useBlockKicks = () => useContext(BlockKicksContext)