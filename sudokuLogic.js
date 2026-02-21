//This is the pure logic behind the number generation for the sudoku board

class SudokuGame {
    constructor() {
        this.row1 = [0,0,0,0,0,0,0,0,0];
        this.row2 = [0,0,0,0,0,0,0,0,0];
        this.row3 = [0,0,0,0,0,0,0,0,0];
        this.row4 = [0,0,0,0,0,0,0,0,0];
        this.row5 = [0,0,0,0,0,0,0,0,0];
        this.row6 = [0,0,0,0,0,0,0,0,0];
        this.row7 = [0,0,0,0,0,0,0,0,0];
        this.row8 = [0,0,0,0,0,0,0,0,0];
        this.row9 = [0,0,0,0,0,0,0,0,0];
        this.gameBoard = [this.row1, this.row2, this.row3, this.row4, this.row5, this.row6, this.row7, this.row8, this.row9];
    }

    randomNum(array) {
        if (array.length == 0) {
            return;
        }
        let randomIndex = Math.floor(Math.random() * array.length);
        let numToReturnArray = array.splice(randomIndex, 1);
        let numToReturn = numToReturnArray[0];
        return numToReturn;
    }

    shuffle(array) {
        for (let i = array.length -1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    generateBoard(row, col) {
        if (row > 8) {
            return true;
        }
        let potentialNums = [1,2,3,4,5,6,7,8,9];
        this.shuffle(potentialNums);
        //console.log(row + " " + col);

        for (let z = 0; z < 9; z++) {
            let trialNum = potentialNums[z];
            //console.log(trialNum + " trial num");
            let matches = 0;

            for (let c = 0; c < col; c++) {
                if (trialNum == this.gameBoard[row][c]) {
                    matches += 1;
                    break;
                }
            }
            for (let d = 0; d < row; d++) {
                if (trialNum == this.gameBoard[d][col]) {
                    matches += 1;
                    break;
                }
            }

            let boxRowStart = row - (row % 3);
            let boxColStart = col - (col % 3);
            for (let r = 0; r < 3; r++) {
                for (let w = 0; w < 3; w++) {
                    if (this.gameBoard[boxRowStart + r][boxColStart + w] === trialNum) {
                        matches += 1;
                        break;
                    }
                    
                }
                if (matches > 0) {
                        break;
                    }
            }

            let nextRow = row;
            let nextCol = col + 1;
            if (nextCol > 8) {
                nextRow = row + 1;
                nextCol = 0;
            }

            if (matches == 0) {
                this.gameBoard[row][col] = trialNum;
                //console.log("Assigned: " + this.gameBoard[row][col]);
                if (this.generateBoard(nextRow, nextCol)) {
                    return true;
                }
            }
        }
        this.gameBoard[row][col] = 0;
        return false;
    }
    
    display() {
        console.log(this.gameBoard);
    }

    wipeBoard() {
        for (let a = 0; a < 9; a++) {
            this.gameBoard[a] = [0,0,0,0,0,0,0,0,0];
        }
    }
}

