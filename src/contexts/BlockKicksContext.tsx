import { ReactNode, createContext, useState, Dispatch, SetStateAction, useContext } from 'react'

interface BlockKicksProviderProps {
  children: ReactNode
}

interface BlockKicksContextProps {
  blockNearAutoGoal: boolean;
  setBlockNearAutoGoal: Dispatch<SetStateAction<boolean>>;
  blockNearHourlyChange: boolean;
  setBlockNearHourlyChange: Dispatch<SetStateAction<boolean>>
}

const BlockKicksContext = createContext({
  blockNearAutoGoal: false,
  setBlockNearAutoGoal: () => {},
  blockNearHourlyChange: false,
  setBlockNearHourlyChange: () => {}
} as BlockKicksContextProps)

export function BlockKicksProvider({ children }: BlockKicksProviderProps) {
  const [blockNearAutoGoal, setBlockNearAutoGoal] = useState(false)
  const [blockNearHourlyChange, setBlockNearHourlyChange] = useState(false)

  const value = {
    blockNearAutoGoal,
    setBlockNearAutoGoal,
    blockNearHourlyChange,
    setBlockNearHourlyChange
  }

  return (
    <BlockKicksContext.Provider value={value}>
      {children}
    </BlockKicksContext.Provider>
  )
}

export const useBlockKicks = () => useContext(BlockKicksContext)