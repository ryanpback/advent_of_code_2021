"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var fs = require("fs");
function readFromFile() {
    try {
        return fs.readFileSync('./input.txt', 'utf-8');
    }
    catch (error) {
        console.error(error);
    }
}
var zip = function () {
    var arr = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arr[_i] = arguments[_i];
    }
    return Array.from({ length: Math.max.apply(Math, arr.map(function (a) { return a.length; })) }, function (_, i) { return arr.map(function (a) { return a[i]; }); });
};
function printBoard(board) {
    console.log(board.map(function (bva) { return bva.map(function (bv) { return JSON.stringify(bv); }).join(','); }));
}
function splitInput(input) {
    var _a = input.split("\n"), gameNumbers = _a[0], boards = _a.slice(1);
    return [
        gameNumbers.split(',').map(function (char) { return +char; }),
        boards.filter(function (v) { return v !== ''; })
    ];
}
function inputsToBoards(arr, numPerArray) {
    var arrLength = arr.length;
    function loop(newArr, index) {
        var nextIndex = index * numPerArray;
        if (nextIndex === arrLength) {
            return newArr;
        }
        var board = arr.slice(nextIndex, nextIndex + numPerArray)
            .map(function (rowString) { return (rowString.trim()
            .split(/\s+/)
            .map(function (char) { return ({ value: +char, selected: false }); })); });
        var builtArr = __spreadArray(__spreadArray([], newArr.slice(0), true), [
            board
        ], false);
        return loop(builtArr, index + 1);
    }
    return loop([], 0);
}
function play(drawnNumbers, boards, lastWinnerGame) {
    if (lastWinnerGame === void 0) { lastWinnerGame = false; }
    var drawnNumbersLength = drawnNumbers.length;
    function playNumber(updatedBoards, index) {
        if (index === drawnNumbersLength) {
            return null;
        }
        var currentPlay = drawnNumbers[index];
        var winningBoard = _winningBoard(updatedBoards, lastWinnerGame);
        if (winningBoard) {
            return [winningBoard, drawnNumbers[index - 1]];
        }
        return playNumber(_playNumberOnBoards(updatedBoards, currentPlay), index + 1);
    }
    return playNumber(boards, 0);
}
function _winningBoard(boards, lastWinnerGame) {
    if (lastWinnerGame) {
        return _getLastWinningBoard(boards);
    }
    var boardsLength = boards.length;
    function loop(index) {
        if (index === boardsLength) {
            return null;
        }
        var nextBoard = boards[index];
        if (_checkBoard(nextBoard)) {
            return nextBoard;
        }
        return loop(index + 1);
    }
    return loop(0);
}
var winningBoards = []; // eh whatever that this isn't functional
function _getLastWinningBoard(boards) {
    var allWinningBoards = boards.filter(function (b) {
        var checkedBoard = _checkBoard(b);
        if (checkedBoard) {
            var boardAlreadyWon = winningBoards.find(function (b) {
                var currentWinningBoardValues = b.flat().map(function (bv) { return bv.value; });
                var checkedBoardValues = checkedBoard.flat().map(function (bv) { return bv.value; });
                var winningString = JSON.stringify(currentWinningBoardValues);
                var checkedString = JSON.stringify(checkedBoardValues);
                return winningString === checkedString;
            });
            if (!boardAlreadyWon) {
                winningBoards.push(checkedBoard);
            }
        }
        return checkedBoard;
    });
    if (allWinningBoards.length === boards.length) {
        return winningBoards[winningBoards.length - 1];
    }
    return null;
}
function _checkBoard(board) {
    var boardHasWinningRow = _checkRows(board);
    if (boardHasWinningRow) {
        return board;
    }
    var boardHasWinningCol = _checkRows(zip.apply(void 0, board));
    if (boardHasWinningCol) {
        return board;
    }
    return null;
}
function _checkRows(board) {
    var boardLength = board.length;
    function checkRow(index) {
        if (index === boardLength) {
            return false;
        }
        var row = board[index];
        var selectedBoardValues = row.filter(function (bv) { return bv.selected; });
        if (selectedBoardValues.length === 5) {
            return true;
        }
        return checkRow(index + 1);
    }
    return checkRow(0);
}
function _playNumberOnBoards(boards, drawnNumber) {
    function playNumber(newBoards, index) {
        if (index === boards.length) {
            return newBoards;
        }
        var updatedBoard = boards[index].map(function (row) { return (row.map(function (bv) { return (bv.value === drawnNumber
            ? __assign(__assign({}, bv), { selected: true }) : bv); })); });
        var builtBoards = __spreadArray(__spreadArray([], newBoards, true), [
            updatedBoard
        ], false);
        return playNumber(builtBoards, index + 1);
    }
    return playNumber([], 0);
}
function getUnmarkedSum(board) {
    return board
        .flat()
        .filter(function (w) { return !w.selected; })
        .reduce(function (a, b) { return (a + b.value); }, 0);
}
var input = readFromFile();
var _a = splitInput(input), drawnNumbers = _a[0], boardInputs = _a[1];
var boards = inputsToBoards(boardInputs, 5);
var lastWinnerGame = false;
// const lastWinnerGame = true
var _b = play(drawnNumbers, boards, lastWinnerGame), winningBoard = _b[0], lastPlay = _b[1];
var total = getUnmarkedSum(winningBoard) * lastPlay;
console.log(total);
