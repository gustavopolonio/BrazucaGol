export function trailAnimation(
  wasGoal: boolean,
  firstColumnChoosed: Element[],
  secondColumnChoosed: Element[],
  thirdColumnChoosed: Element[],
) {
  console.log(secondColumnChoosed[0].classList[0])
  console.log(secondColumnChoosed)

  if (wasGoal) {
    // Input has to go until the end

    // First column (3 inputs right and 1 wrong)
    const classInputChoosed = firstColumnChoosed[0].classList[0]

    // Second column (2 inputs right and 2 wrong)

    // Third column (1 input right and 2 wrong)
  } else {
    // 33,33% wrong in first column; 33,33% wrong in second column; 33,33% wrong in third column
  }
}
