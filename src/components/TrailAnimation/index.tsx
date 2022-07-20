
import { useEffect, useRef, useState } from 'react'
import { LoadingSpinner } from '../Utils/LoadingSpinner'
import { useBlockKicks } from "../../contexts/BlockKicksContext"

import styles from './styles.module.scss'


interface TrailAnimationProps {
  handleKickWasGoal: () => void;
  // isLoading: boolean
}

export function TrailAnimation({ handleKickWasGoal }: TrailAnimationProps) {
  const { blockNearAutoGoal, blockNearHourlyChange } = useBlockKicks()

  const [trailFirstColumnIsChoosed, setTrailFirstColumnIsChoosed] = useState(false)
  const [trailSecondColumnIsChoosed, setTrailSecondColumnIsChoosed] = useState(false)
  const [trailThirdColumnIsChoosed, setTrailThirdColumnIsChoosed] = useState(false)
  const [firstColumn, setFirstColumn] = useState<EventTarget>()
  const [secondColumn, setSecondColumn] = useState<EventTarget>()
  const [thirdColumn, setThirdColumn] = useState<EventTarget>()

  const ballInitialInput = useRef<HTMLInputElement>(null)
  const trailFirstColumnFieldset = useRef<HTMLFieldSetElement>(null)
  const trailSecondColumnFieldset = useRef<HTMLFieldSetElement>(null)
  const trailThirdColumnFieldset = useRef<HTMLFieldSetElement>(null)
  
  const [isLoading, setIsLoading] = useState(false)

  const [myClass, setMyClass] = useState("")

  useEffect(() => {
    const firstColumnChoosed = Object.values(trailFirstColumnFieldset.current.children).filter(input => input.checked)
    const firstColumnNotChoosed = Object.values(trailFirstColumnFieldset.current.children).filter(input => !input.checked)
    const secondColumnChoosed = Object.values(trailSecondColumnFieldset.current.children).filter(input => input.checked)
    const secondColumnNotChoosed = Object.values(trailSecondColumnFieldset.current.children).filter(input => !input.checked)
    const thirdColumnChoosed = Object.values(trailThirdColumnFieldset.current.children).filter(input => input.checked)
    const thirdColumnNotChoosed = Object.values(trailThirdColumnFieldset.current.children).filter(input => !input.checked)

    if (trailFirstColumnIsChoosed && trailSecondColumnIsChoosed && trailThirdColumnIsChoosed) {
      const trailProbability = Math.random() * 100
      setIsLoading(true)

      setTimeout(async () => {
        setIsLoading(false)
        if (trailProbability < 0) { // Trail goal (Input has to go until the end)

          // First column (3 inputs right and 1 wrong)
          const classInputChoosedFirstColumn = firstColumnChoosed[0].classList[0] // Ball goes to it
          setMyClass(classInputChoosedFirstColumn)

          const randomFirst = Math.floor(Math.random() * 3)
          firstColumnNotChoosed.splice(randomFirst, 1) // Let in firstColumnNotChoosed only the inputs that will vanish
          firstColumnNotChoosed.forEach(input => input.classList.add("vanish"))
          firstColumnChoosed[0].classList.add("vanish")
        
          // Second column (2 inputs right and 2 wrong)
          setTimeout(() => {
            const classInputChoosedSecondColumn = secondColumnChoosed[0].classList[0] // Ball goes to it
            setMyClass(classInputChoosedSecondColumn)
  
            const randomSecond = Math.floor(Math.random() * 3)
            secondColumnNotChoosed[randomSecond].classList.add("vanish") // Get the other input (beyond the choosed) that will vanish
            secondColumnChoosed[0].classList.add("vanish")
          }, 1200)

          // Third column (1 input right and 2 wrong)
          setTimeout(() => {
            const classInputChoosedThirdColumn = thirdColumnChoosed[0].classList[0] // Ball goes to it
            setMyClass(classInputChoosedThirdColumn)
  
            thirdColumnChoosed[0].classList.add("vanish")
          }, 2400)

        } else { // Trail lost
          // 33,33% wrong in first column; 33,33% wrong in second column; 33,33% wrong in third column
          const columnPlayerWillLose = Math.random() * 100
          if (columnPlayerWillLose < 33.33) { // First column
            const classInputChoosedFirstColumn = firstColumnChoosed[0].classList[0] // Ball goes to it
            setMyClass(classInputChoosedFirstColumn)
            firstColumnNotChoosed.forEach(input => input.classList.add("vanish"))

          } else if (columnPlayerWillLose > 33.3 && columnPlayerWillLose < 66.66) { // Second column
            const classInputChoosedFirstColumn = firstColumnChoosed[0].classList[0] // Ball goes to it
            setMyClass(classInputChoosedFirstColumn)

            const randomFirst = Math.floor(Math.random() * 3)
            firstColumnNotChoosed.splice(randomFirst, 1) // Let in firstColumnNotChoosed only the inputs that will vanish
            firstColumnNotChoosed.forEach(input => input.classList.add("vanish"))
            firstColumnChoosed[0].classList.add("vanish")

            setTimeout(() => {
              const classInputChoosedSecondColumn = secondColumnChoosed[0].classList[0] // Ball goes to it
              setMyClass(classInputChoosedSecondColumn)
    
              const randomSecond = Math.floor(Math.random() * 3)
              secondColumnNotChoosed.splice(randomSecond, 1)
              secondColumnNotChoosed.forEach(input => input.classList.add("vanish"))
              
            }, 1200)
          } else { // Third column
          // First column (3 inputs right and 1 wrong)
          const classInputChoosedFirstColumn = firstColumnChoosed[0].classList[0] // Ball goes to it
          setMyClass(classInputChoosedFirstColumn)

          const randomFirst = Math.floor(Math.random() * 3)
          firstColumnNotChoosed.splice(randomFirst, 1) // Let in firstColumnNotChoosed only the inputs that will vanish
          firstColumnNotChoosed.forEach(input => input.classList.add("vanish"))
          firstColumnChoosed[0].classList.add("vanish")
        
          // Second column (2 inputs right and 2 wrong)
          setTimeout(() => {
            const classInputChoosedSecondColumn = secondColumnChoosed[0].classList[0] // Ball goes to it
            setMyClass(classInputChoosedSecondColumn)
  
            const randomSecond = Math.floor(Math.random() * 3)
            secondColumnNotChoosed[randomSecond].classList.add("vanish") // Get the other input (beyond the choosed) that will vanish
            secondColumnChoosed[0].classList.add("vanish")
          }, 1200)

          // Third column (1 input right and 2 wrong)
          setTimeout(() => {
            const classInputChoosedThirdColumn = thirdColumnChoosed[0].classList[0] // Ball goes to it
            setMyClass(classInputChoosedThirdColumn)

            const randomThird = Math.floor(Math.random() * 2)
            thirdColumnNotChoosed[randomThird].classList.add("vanish")
          }, 2400)
          }
        }
      }, 1000)

      // handleKickWasGoal()
    }
  }, [trailFirstColumnIsChoosed, trailSecondColumnIsChoosed, trailThirdColumnIsChoosed])


  return (
    <div className={`${styles.content} trail-animation`}>
      { isLoading && <LoadingSpinner top='2%' left='2%' /> }

      <div className={styles.trailContent}>
        <fieldset>
          <input 
            className={myClass} 
            type="radio" 
            name='trail-goalkepper' 
            checked 
            readOnly 
            ref={ballInitialInput} 
          />
        </fieldset>

        <fieldset ref={trailFirstColumnFieldset} onChange={() => setTrailFirstColumnIsChoosed(true)}>
          <input type="radio" name='trail-part-one' className="trail-first-column-first-row" />
          <input type="radio" name='trail-part-one' className="trail-first-column-second-row" />
          <input type="radio" name='trail-part-one' className="trail-first-column-third-row" />
          <input type="radio" name='trail-part-one' className="trail-first-column-fourth-row" />
        </fieldset>

        <fieldset ref={trailSecondColumnFieldset} onChange={() => setTrailSecondColumnIsChoosed(true)}>
          <input type="radio" name='trail-part-two' className="trail-second-column-first-row" />
          <input type="radio" name='trail-part-two' className="trail-second-column-second-row" />
          <input type="radio" name='trail-part-two' className="trail-second-column-third-row" />
          <input type="radio" name='trail-part-two' className="trail-second-column-fourth-row" />
        </fieldset>

        <fieldset ref={trailThirdColumnFieldset} onChange={() => setTrailThirdColumnIsChoosed(true)}>
          { blockNearAutoGoal || blockNearHourlyChange ? (
            <>
              <input type="radio" name='trail-part-three' disabled />
              <input type="radio" name='trail-part-three' disabled />
              <input type="radio" name='trail-part-three' disabled />
            </>
          ) : (
            <>
              <input type="radio" name='trail-part-three' className="trail-third-column-first-row" />
              <input type="radio" name='trail-part-three' className="trail-third-column-second-row" />
              <input type="radio" name='trail-part-three' className="trail-third-column-third-row" />
            </>
          ) }
        </fieldset>
      </div>
    </div>
  )
}