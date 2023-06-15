import { useEffect, useRef, useState } from 'react'
import { LoadingSpinner } from '../../../../LoadingSpinner'

import styles from './styles.module.scss'

interface TrailAnimationProps {
  handleKickWasGoal: (wasTrailGoal?: boolean) => Promise<void>
  blockCloseModal: () => void
}

function passFirstColumn(
  firstColumnChoosed,
  firstColumnNotChoosed,
  setTrailGoalkepperInputClass,
) {
  const classInputChoosedFirstColumn = firstColumnChoosed[0].classList[0] // Ball goes to it
  setTrailGoalkepperInputClass(classInputChoosedFirstColumn)

  const randomFirst = Math.floor(Math.random() * 3)
  firstColumnNotChoosed.splice(randomFirst, 1) // Let in firstColumnNotChoosed only the inputs that will vanish
  firstColumnNotChoosed.forEach((input) => input.classList.add(styles.vanish))
  firstColumnChoosed[0].classList.add(styles.vanish)
}

function passSecondColumn(
  secondColumnChoosed,
  secondColumnNotChoosed,
  setTrailGoalkepperInputClass,
) {
  setTimeout(() => {
    const classInputChoosedSecondColumn = secondColumnChoosed[0].classList[0] // Ball goes to it
    setTrailGoalkepperInputClass(classInputChoosedSecondColumn)

    const randomSecond = Math.floor(Math.random() * 3)
    secondColumnNotChoosed[randomSecond].classList.add(styles.vanish) // Get the other input (beyond the choosed) that will vanish
    secondColumnChoosed[0].classList.add(styles.vanish)
  }, 1200)
}

export function TrailAnimation({
  handleKickWasGoal,
  blockCloseModal,
}: TrailAnimationProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [trailGoalkepperInputClass, setTrailGoalkepperInputClass] = useState('')
  const [disableRadioInput, setDisableRadioInput] = useState(false)

  const [trailFirstColumnIsChoosed, setTrailFirstColumnIsChoosed] =
    useState(false)
  const [trailSecondColumnIsChoosed, setTrailSecondColumnIsChoosed] =
    useState(false)
  const [trailThirdColumnIsChoosed, setTrailThirdColumnIsChoosed] =
    useState(false)

  const trailFirstColumnFieldset = useRef<HTMLFieldSetElement>(null)
  const trailSecondColumnFieldset = useRef<HTMLFieldSetElement>(null)
  const trailThirdColumnFieldset = useRef<HTMLFieldSetElement>(null)

  useEffect(() => {
    const firstColumnChoosedAux = Object.values(
      trailFirstColumnFieldset.current.children,
    )
    const firstColumnChoosed = firstColumnChoosedAux.filter(
      (input: HTMLInputElement) => input.checked,
    )
    const firstColumnNotChoosed = firstColumnChoosedAux.filter(
      (input: HTMLInputElement) => !input.checked,
    )

    const secondColumnChoosedAux = Object.values(
      trailSecondColumnFieldset.current.children,
    )
    const secondColumnChoosed = secondColumnChoosedAux.filter(
      (input: HTMLInputElement) => input.checked,
    )
    const secondColumnNotChoosed = secondColumnChoosedAux.filter(
      (input: HTMLInputElement) => !input.checked,
    )

    const thirdColumnChoosedAux = Object.values(
      trailThirdColumnFieldset.current.children,
    )
    const thirdColumnChoosed = thirdColumnChoosedAux.filter(
      (input: HTMLInputElement) => input.checked,
    )

    const thirdColumnNotChoosed = thirdColumnChoosedAux.filter(
      (input: HTMLInputElement) => !input.checked,
    )

    const classInputChoosedThirdColumn = thirdColumnChoosed[0]?.classList[0] // Ball goes to it

    if (
      trailFirstColumnIsChoosed &&
      trailSecondColumnIsChoosed &&
      trailThirdColumnIsChoosed
    ) {
      blockCloseModal()
      setDisableRadioInput(true)
      let wasTrailGoal = false
      const trailProbability = Math.random() * 100
      setIsLoading(true)

      setTimeout(async () => {
        setIsLoading(false)
        if (trailProbability < 30) {
          // Trail goal (Input has to go until the end)
          wasTrailGoal = true

          // First column (3 inputs right and 1 wrong)
          passFirstColumn(
            firstColumnChoosed,
            firstColumnNotChoosed,
            setTrailGoalkepperInputClass,
          )

          // Second column (2 inputs right and 2 wrong)
          passSecondColumn(
            secondColumnChoosed,
            secondColumnNotChoosed,
            setTrailGoalkepperInputClass,
          )

          // Third column (1 input right and 2 wrong)
          setTimeout(() => {
            setTrailGoalkepperInputClass(classInputChoosedThirdColumn)
            thirdColumnChoosed[0].classList.add(styles.vanish)
          }, 2400)

          setTimeout(() => handleKickWasGoal(wasTrailGoal), 3800)
        } else {
          // Trail lost
          // 25% wrong in first column; 45% wrong in second column; 30% wrong in third column
          const columnPlayerWillLose = Math.random() * 100

          if (columnPlayerWillLose < 25) {
            // Trail lost on first column
            const classInputChoosedFirstColumn =
              firstColumnChoosed[0].classList[0] // Ball goes to it
            setTrailGoalkepperInputClass(classInputChoosedFirstColumn)
            firstColumnNotChoosed.forEach((input) =>
              input.classList.add(styles.vanish),
            )

            setTimeout(() => handleKickWasGoal(wasTrailGoal), 1500)
          } else if (columnPlayerWillLose >= 25 && columnPlayerWillLose <= 70) {
            // Trail lost on second column
            passFirstColumn(
              firstColumnChoosed,
              firstColumnNotChoosed,
              setTrailGoalkepperInputClass,
            )

            setTimeout(() => {
              const classInputChoosedSecondColumn =
                secondColumnChoosed[0].classList[0] // Ball goes to it
              setTrailGoalkepperInputClass(classInputChoosedSecondColumn)

              const randomSecond = Math.floor(Math.random() * 3)
              secondColumnNotChoosed.splice(randomSecond, 1)
              secondColumnNotChoosed.forEach((input) =>
                input.classList.add(styles.vanish),
              )
            }, 1200)

            setTimeout(() => handleKickWasGoal(wasTrailGoal), 2600)
          } else {
            // Trail lost on third column
            passFirstColumn(
              firstColumnChoosed,
              firstColumnNotChoosed,
              setTrailGoalkepperInputClass,
            )

            passSecondColumn(
              secondColumnChoosed,
              secondColumnNotChoosed,
              setTrailGoalkepperInputClass,
            )

            // Third column (1 input right and 2 wrong)
            setTimeout(() => {
              const classInputChoosedThirdColumn =
                thirdColumnChoosed[0].classList[0] // Ball goes to it
              setTrailGoalkepperInputClass(classInputChoosedThirdColumn)

              const randomThird = Math.floor(Math.random() * 2)
              thirdColumnNotChoosed[randomThird].classList.add(styles.vanish)
            }, 2400)

            setTimeout(() => handleKickWasGoal(wasTrailGoal), 3800)
          }
        }
      }, 1000)
    }
  }, [
    trailFirstColumnIsChoosed,
    trailSecondColumnIsChoosed,
    trailThirdColumnIsChoosed,
  ])

  return (
    <div className={`${styles.content} ${styles.trailAnimation}`}>
      {isLoading && <LoadingSpinner top="2%" left="2%" />}

      <div className={styles.trailContent}>
        <fieldset>
          <input
            className={styles[`${trailGoalkepperInputClass}`]}
            type="radio"
            name="trail-goalkepper"
            checked
            readOnly
          />
        </fieldset>

        <fieldset
          ref={trailFirstColumnFieldset}
          onChange={() => setTrailFirstColumnIsChoosed(true)}
          disabled={disableRadioInput}
        >
          <input
            type="radio"
            className="trailFirstColumnFirstRow"
            name="trailFirstColumn"
          />
          <input
            type="radio"
            className="trailFirstColumnSecondRow"
            name="trailFirstColumn"
          />
          <input
            type="radio"
            className="trailFirstColumnThirdRow"
            name="trailFirstColumn"
          />
          <input
            type="radio"
            className="trailFirstColumnFourthRow"
            name="trailFirstColumn"
          />
        </fieldset>

        <fieldset
          ref={trailSecondColumnFieldset}
          onChange={() => setTrailSecondColumnIsChoosed(true)}
          disabled={disableRadioInput}
        >
          <input
            type="radio"
            className="trailSecondColumnFirstRow"
            name="trailSecondColumn"
          />
          <input
            type="radio"
            className="trailSecondColumnSecondRow"
            name="trailSecondColumn"
          />
          <input
            type="radio"
            className="trailSecondColumnThirdRow"
            name="trailSecondColumn"
          />
          <input
            type="radio"
            className="trailSecondColumnFourthRow"
            name="trailSecondColumn"
          />
        </fieldset>

        <fieldset
          ref={trailThirdColumnFieldset}
          onChange={() => setTrailThirdColumnIsChoosed(true)}
          disabled={disableRadioInput}
        >
          <input
            type="radio"
            className="trailThirdColumnFirstRow"
            name="trailThirdColumn"
          />
          <input
            type="radio"
            className="trailThirdColumnSecondRow"
            name="trailThirdColumn"
          />
          <input
            type="radio"
            className="trailThirdColumnThirdRow"
            name="trailThirdColumn"
          />
        </fieldset>
      </div>
    </div>
  )
}
