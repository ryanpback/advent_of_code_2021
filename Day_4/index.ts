import fs = require('fs')

type BoardValue = {
  value: number,
  selected: boolean
}
type Board       = BoardValue[][]
type Boards      = Board[]
type BoardWinner = [Board, number]

function readFromFile(): string {
  try {
    return fs.readFileSync('./input.txt', 'utf-8')
  } catch (error) {
    console.error(error);
  }
}

const zip = (...arr) => Array.from({ length: Math.max(...arr.map(a => a.length)) }, (_, i) => arr.map(a => a[i]))

function printBoard(board: Board): void {
  console.log(board.map((bva: BoardValue[]) => bva.map((bv: BoardValue) => JSON.stringify(bv)).join(',')))
}

function splitInput(input: string): [Array<number>, Array<string>] {
  const [gameNumbers, ...boards] = input.split("\n")

  return [
    gameNumbers.split(',').map((char: string) => +char),
    boards.filter((v: string) => v !== '')
  ]
}

function inputsToBoards(arr: Array<string>, numPerArray: number): Boards {
  const arrLength = arr.length

  function loop(newArr: Boards, index: number): Boards {
    const nextIndex = index * numPerArray

    if (nextIndex === arrLength) {
      return newArr
    }

    const board: Board =
      arr.slice(nextIndex, nextIndex + numPerArray)
        .map((rowString: string) => (
          rowString.trim()
            .split(/\s+/)
            .map((char: string) => ({ value: +char, selected: false }))
        ))

    const builtArr = [
      ...newArr.slice(0),
      board
    ]

    return loop(builtArr, index + 1)
  }

  return loop([] as Boards, 0)
}

function play(drawnNumbers: Array<number>, boards: Boards, lastWinnerGame = false): BoardWinner | null {
  const drawnNumbersLength = drawnNumbers.length

  function playNumber(updatedBoards: Boards, index: number): BoardWinner | null {
    if (index === drawnNumbersLength) {
      return null
    }

    const currentPlay  = drawnNumbers[index]
    const winningBoard = _winningBoard(updatedBoards, lastWinnerGame)

    if (winningBoard) {
      return [winningBoard, drawnNumbers[index - 1]] as BoardWinner
    }

    return playNumber(
      _playNumberOnBoards(updatedBoards, currentPlay),
      index + 1
    )
  }

  return playNumber(boards, 0)
}

function _winningBoard(boards: Boards, lastWinnerGame): Board | null {
  if (lastWinnerGame) {
    return _getLastWinningBoard(boards)
  }

  const boardsLength = boards.length

  function loop(index: number): Board | null {
    if (index === boardsLength) {
      return null
    }

    const nextBoard: Board = boards[index]
    if (_checkBoard(nextBoard)) {
      return nextBoard
    }

    return loop(index + 1)
  }

  return loop(0)
}

let winningBoards: Boards = [] // eh whatever that this isn't functional
function _getLastWinningBoard(boards: Boards): Board | null {
  const allWinningBoards = boards.filter((b: Board) => {
    const checkedBoard = _checkBoard(b)

    if (checkedBoard) {
      const boardAlreadyWon =
        winningBoards.find((b: Board) => {
          const currentWinningBoardValues = b.flat().map(bv => bv.value)
          const checkedBoardValues        = checkedBoard.flat().map(bv => bv.value)
          const winningString             = JSON.stringify(currentWinningBoardValues)
          const checkedString             = JSON.stringify(checkedBoardValues)

          return winningString === checkedString
        })

        if (!boardAlreadyWon) {
          winningBoards.push(checkedBoard)
        }
    }

    return checkedBoard
  })

  if (allWinningBoards.length === boards.length) {
    return winningBoards[winningBoards.length - 1]
  }

  return null
}

function _checkBoard(board: Board): Board | null {
  const boardHasWinningRow = _checkRows(board)
  if (boardHasWinningRow) {
    return board
  }

  const boardHasWinningCol = _checkRows(zip(...board))
  if (boardHasWinningCol) {
    return board
  }

  return null
}

function _checkRows(board: Board): boolean {
  const boardLength = board.length

  function checkRow(index: number): boolean {
    if (index === boardLength) {
      return false
    }

    const row: BoardValue[] = board[index]
    const selectedBoardValues: BoardValue[] =
      row.filter((bv: BoardValue) => bv.selected)

    if (selectedBoardValues.length === 5) {
      return true
    }

    return checkRow(index + 1)
  }

  return checkRow(0)
}

function _playNumberOnBoards(boards: Boards, drawnNumber: number): Boards {
  function playNumber(
    newBoards: Boards,
    index: number
  ): Boards {
    if (index === boards.length) {
      return newBoards
    }

    const updatedBoard: Board =
      boards[index].map((row: BoardValue[]) => (
        row.map((bv: BoardValue) => (
          bv.value === drawnNumber
            ? { ...bv, selected: true }
            : bv
        ))
      ))

    const builtBoards: Boards = [
      ...newBoards,
      updatedBoard
    ]

    return playNumber(builtBoards, index + 1)
  }

  return playNumber([] as Boards, 0)
}

function getUnmarkedSum(board: Board): number {
  return board
    .flat()
    .filter(w => !w.selected)
    .reduce((a: number, b: BoardValue) => (a + b.value), 0)
}

const input                       = readFromFile()
const [drawnNumbers, boardInputs] = splitInput(input)
const boards                      = inputsToBoards(boardInputs, 5)

const lastWinnerGame = false
// const lastWinnerGame = true

const [winningBoard, lastPlay] = play(drawnNumbers, boards, lastWinnerGame)
const total                    = getUnmarkedSum(winningBoard) * lastPlay
console.log(total);
