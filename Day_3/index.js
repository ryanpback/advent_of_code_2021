const fs = require('fs')

const readFileIntoArray = () => {
  try {
    return fs.readFileSync('./input.txt', 'utf-8').split("\n")
  } catch (error) {
    console.log(error);
  }
}

const zip = (...arr) => Array.from({ length: Math.max(...arr.map(a => a.length)) }, (_, i) => arr.map(a => a[i]))

const determineMostCommon = (arr, isLife = false, isO2 = true) => {
  const logic   = isO2 ? 'round' : 'floor'
  const sorted  = arr.sort()
  const middle  = Math[logic](sorted.length / 2)

  if (!isLife) {
    return sorted[middle]
  }

  const left  = sorted.slice(0, middle)
  const right = sorted.slice(middle)
  let even;

  if (left.length === right.length && left[left.length - 1] !== right[0]) {
    even = true
  }

  if (isO2 && even) {
    return '1'
  }

  if (!isO2 && even) {
    return '0'
  }

  const mostCommon = left.length > right.length ? left[left.length - 1] : right[0]

  if (isO2) {
    return mostCommon
  }

  return (1 - +mostCommon).toString()
}

const reduceList = (arr, isO2 = true) => {
  function loop(index, newArray) {
    if (newArray.length === 1) {
      return newArray[0]
    }

    const criteria = determineMostCommon(newArray.map(e => e[index]), true, isO2)
    const filtered = newArray.filter(i => i[index] === criteria)

    return loop(index + 1, filtered)
  }

  return loop(0, arr)
}

const determinePowerConsumption = input => {
  const splitInput =
    input.map(i => i.split(''))
      .filter(m => m.length > 1) //account for empty lines

  const bin         = zip(...splitInput).map(arr => determineMostCommon(arr)).join('')
  const gamma       = parseInt(bin, 2)
  const epsilonBin  = bin.split('').map(e => 1 - e).join('')
  const epsilon     = parseInt(epsilonBin, 2)

  return gamma * epsilon
}

const determineLifeSupportRating = input => {
  const o2 = parseInt(reduceList(input), 2)
  const co2 = parseInt(reduceList(input, false), 2)

  return o2 * co2
}


const input = readFileIntoArray()

console.log(determinePowerConsumption(input));
console.log(determineLifeSupportRating(input));
