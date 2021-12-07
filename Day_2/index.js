const fs = require('fs');

travel = instructions => {
  return instructions.forward * instructions.depth
}

splitInstructions = (input, aim = false) => {
  const instructions = {
    forward: 0,
    depth: 0,
    up: 0,
    down: 0
  }

  input.forEach(element => {
    const [direction, count] = element.split(' ')
    if (direction !== 'forward' && direction !== 'down' && direction !== 'up' ) {
      return
    }

    const countAsNum = +count

    if (aim && direction === 'forward') {
      const aim = instructions.down - instructions.up
      instructions.depth = instructions.depth + aim * countAsNum
    }

    if (!aim) {
      instructions.depth = instructions.down - instructions.up
    }

    instructions[direction] = instructions[direction] + countAsNum
  });

  return instructions
}

try {
  const input = fs.readFileSync('./input.txt', 'utf-8').split("\n")
  const traveledWithoutAim = travel(splitInstructions(input))
  console.log({traveledWithoutAim});

  const traveledWithAim = travel(splitInstructions(input, true))
  console.log({traveledWithAim});
} catch (error) {
  console.log(error);
}
