
import { useEffect, useRef, useState } from 'react'
import { LoadingSpinner } from '../Utils/LoadingSpinner'
import { useBlockKicks } from "../../contexts/BlockKicksContext"

import styles from './styles.module.scss'


interface TrailAnimationProps {
  handleKickWasGoal: (wasTrailGoal?: boolean) => Promise<void>
}

function passFirstColumn(firstColumnChoosed, firstColumnNotChoosed, setTrailGoalkepperInputClass) {
  const classInputChoosedFirstColumn = firstColumnChoosed[0].classList[0] // Ball goes to it
  setTrailGoalkepperInputClass(classInputChoosedFirstColumn)

  const randomFirst = Math.floor(Math.random() * 3)
  firstColumnNotChoosed.splice(randomFirst, 1) // Let in firstColumnNotChoosed only the inputs that will vanish
  firstColumnNotChoosed.forEach(input => input.classList.add("vanish"))
  firstColumnChoosed[0].classList.add("vanish")
}

function passSecondColumn(secondColumnChoosed, secondColumnNotChoosed, setTrailGoalkepperInputClass) {
  setTimeout(() => {
    const classInputChoosedSecondColumn = secondColumnChoosed[0].classList[0] // Ball goes to it
    setTrailGoalkepperInputClass(classInputChoosedSecondColumn)

    const randomSecond = Math.floor(Math.random() * 3)
    secondColumnNotChoosed[randomSecond].classList.add("vanish") // Get the other input (beyond the choosed) that will vanish
    secondColumnChoosed[0].classList.add("vanish")
  }, 1200)
}

export function TrailAnimation({ handleKickWasGoal }: TrailAnimationProps) {
  const { blockNearHourlyChange, blockTrailNearAutoGoal } = useBlockKicks()
  const [isLoading, setIsLoading] = useState(false)
  const [trailGoalkepperInputClass, setTrailGoalkepperInputClass] = useState("")

  const [trailFirstColumnIsChoosed, setTrailFirstColumnIsChoosed] = useState(false)
  const [trailSecondColumnIsChoosed, setTrailSecondColumnIsChoosed] = useState(false)
  const [trailThirdColumnIsChoosed, setTrailThirdColumnIsChoosed] = useState(false)
  const trailFirstColumnFieldset = useRef<HTMLFieldSetElement>(null)
  const trailSecondColumnFieldset = useRef<HTMLFieldSetElement>(null)
  const trailThirdColumnFieldset = useRef<HTMLFieldSetElement>(null)
  
  useEffect(() => {
    const firstColumnChoosed = Object.values(trailFirstColumnFieldset.current.children).filter(input => input.checked)
    const firstColumnNotChoosed = Object.values(trailFirstColumnFieldset.current.children).filter(input => !input.checked)
    const secondColumnChoosed = Object.values(trailSecondColumnFieldset.current.children).filter(input => input.checked)
    const secondColumnNotChoosed = Object.values(trailSecondColumnFieldset.current.children).filter(input => !input.checked)
    const thirdColumnChoosed = Object.values(trailThirdColumnFieldset.current.children).filter(input => input.checked)
    const thirdColumnNotChoosed = Object.values(trailThirdColumnFieldset.current.children).filter(input => !input.checked)
    const classInputChoosedThirdColumn = thirdColumnChoosed[0]?.classList[0] // Ball goes to it

    if (trailFirstColumnIsChoosed && trailSecondColumnIsChoosed && trailThirdColumnIsChoosed) {
      let wasTrailGoal = false
      const trailProbability = Math.random() * 100
      setIsLoading(true)

      setTimeout(async () => {
        setIsLoading(false)
        if (trailProbability < 30) { // Trail goal (Input has to go until the end)
          wasTrailGoal = true

          // First column (3 inputs right and 1 wrong)       
          passFirstColumn(firstColumnChoosed, firstColumnNotChoosed, setTrailGoalkepperInputClass)

          // Second column (2 inputs right and 2 wrong)
          passSecondColumn(secondColumnChoosed, secondColumnNotChoosed, setTrailGoalkepperInputClass)

          // Third column (1 input right and 2 wrong)
          setTimeout(() => {
            setTrailGoalkepperInputClass(classInputChoosedThirdColumn)
            thirdColumnChoosed[0].classList.add("vanish")
          }, 2400)

          setTimeout(() => handleKickWasGoal(wasTrailGoal), 3800)

        } else { // Trail lost
          // 25% wrong in first column; 45% wrong in second column; 30% wrong in third column
          const columnPlayerWillLose = Math.random() * 100
          if (columnPlayerWillLose < 25) { // First column
            const classInputChoosedFirstColumn = firstColumnChoosed[0].classList[0] // Ball goes to it
            setTrailGoalkepperInputClass(classInputChoosedFirstColumn)
            firstColumnNotChoosed.forEach(input => input.classList.add("vanish"))
        
            setTimeout(() => handleKickWasGoal(wasTrailGoal), 1500)
          } else if (columnPlayerWillLose >= 25 && columnPlayerWillLose <= 70) { // Second column
            passFirstColumn(firstColumnChoosed, firstColumnNotChoosed, setTrailGoalkepperInputClass)

            setTimeout(() => {
              const classInputChoosedSecondColumn = secondColumnChoosed[0].classList[0] // Ball goes to it
              setTrailGoalkepperInputClass(classInputChoosedSecondColumn)
    
              const randomSecond = Math.floor(Math.random() * 3)
              secondColumnNotChoosed.splice(randomSecond, 1)
              secondColumnNotChoosed.forEach(input => input.classList.add("vanish"))
              
            }, 1200)

            setTimeout(() => handleKickWasGoal(wasTrailGoal), 2600)
          } else { // Third column
            passFirstColumn(firstColumnChoosed, firstColumnNotChoosed, setTrailGoalkepperInputClass)
          
            // Second column (2 inputs right and 2 wrong)
            passSecondColumn(secondColumnChoosed, secondColumnNotChoosed, setTrailGoalkepperInputClass)
  
            // Third column (1 input right and 2 wrong)
            setTimeout(() => {
              const classInputChoosedThirdColumn = thirdColumnChoosed[0].classList[0] // Ball goes to it
              setTrailGoalkepperInputClass(classInputChoosedThirdColumn)

              const randomThird = Math.floor(Math.random() * 2)
              thirdColumnNotChoosed[randomThird].classList.add("vanish")
            }, 2400)

            setTimeout(() => handleKickWasGoal(wasTrailGoal), 3800)
          }
        }
      }, 1000)

    }
  }, [trailFirstColumnIsChoosed, trailSecondColumnIsChoosed, trailThirdColumnIsChoosed])


  return (
    <div className={`${styles.content} trail-animation`}>
      { isLoading && <LoadingSpinner top='2%' left='2%' /> }

      <div className={styles.trailContent}>
        <fieldset>
          <input 
            className={trailGoalkepperInputClass} 
            type="radio" 
            name='trail-goalkepper' 
            checked 
            readOnly 
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
          { blockTrailNearAutoGoal || blockNearHourlyChange ? (
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