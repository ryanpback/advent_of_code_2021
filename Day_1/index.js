const fs = require('fs')

countIncrease = (input, window) => {
  return input.filter((_, index, arr) => {
    const nextIndex = index + 1
    const left      = arr.slice(index, index + window).reduce((a, b) => +a + +b, 0)
    const right     = arr.slice(nextIndex, nextIndex + window).reduce((a, b) => +a + +b, 0)

    return right > left
  }).length
}

try {
  const input = fs.readFileSync('./input.txt', 'utf-8').split("\n")
  // const increase1 = countIncrease(input, 1)
  // console.log(increase1)

  const increase3 = countIncrease(input, 3)
  console.log(increase3)
} catch (err) {
  console.log(err)
}
