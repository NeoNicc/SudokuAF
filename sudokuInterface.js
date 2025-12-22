let gameBoard = document.getElementById('gameBoard');
let newGameButton = document.getElementsByClassName('newGameButton');
let easy = newGameButton[0];
let medium = newGameButton[1];
let hard = newGameButton[2];
let hint = document.getElementById('hintButton');
let difficultyExpander = document.getElementById('difficultyExpander');
let difficultyButtons = document.getElementById('difficultyButtons');
let expandScore = document.getElementById('expandScore');
let scoreBar = document.getElementById('scoreBar');
let menuButtons = document.getElementById('menuButtons');
let score = document.getElementById('score');
let scoreNum = document.getElementById('scoreNum');
let numberButtons = document.getElementById('numberButtons');
let submitUsername = document.getElementById('submitUsername');
let username = document.getElementById('username');
let leaderboardContainer = document.getElementById('leaderboardContainer');

let numberReadied = [0];
let currentScore = 0;
let scoreGain = 25;
let currentUser = 'noname';
let numbersRemaining = [];
let hintNum = 0;
let stopHint = 0;

//readies a number to be checked against
//on the board
for (let i = 1; i < 10; i++) {
    let button = document.getElementById(`${i}Button`);

    //button click event
    button.onclick = () => {
        for (let a = 0; a < 9; a++) {
            let butt = document.querySelectorAll('#numberButtons button');
            butt[a].style.transition = 'background-color 1s ease-out';
            butt[a].style.backgroundColor = 'rgba(110, 165, 240, 0.895)';
            butt[a].style.boxShadow = '2px 1px 4px 0';
        }
        if (numberReadied != button.textContent) {
            numberReadied[0] = button.textContent;
            button.style.transition = 'background-color 1s ease-in-out';
            button.style.backgroundColor = 'rgba(11, 23, 245, 0.66)';
            button.style.transition = 'box-shadow 1s ease-out';
            button.style.boxShadow = '3px 2px 5px 0';
        } else {
            numberReadied[0] = 0;
            button.style.transition = 'background-color 1s ease-in-out';
            button.style.backgroundColor = 'rgba(110, 165, 240, 0.895)';
            button.style.boxShadow = '2px 1px 4px 0';
        }
    }
}

//initialize the game board and set its values
//also attaches an event handler on each cell
//for when the player clicks the cell to see if 
//they picked the correct number
let myGame = new SudokuGame();
myGame.generateBoard(0,0);

function setGame() {
    leaderboardContainer.style.display = 'none';
    scoreBar.style.display = 'flex';
    gameBoard.style.display = 'grid';
    numberButtons.style.display = 'flex';
    loadHighScores('');
    currentScore = 0;
    scoreNum.textContent = currentScore;
    hint.style.backgroundColor = 'rgb(253, 229, 134)';
    for (let a = 0; a < 9; a++) {
    for (let b = 0; b < 9; b++) {
        let cell = document.getElementById('row' + (a+1) + 'col' + (b+1));
        cell.textContent = myGame.gameBoard[a][b];
        //grid click event
        cell.onclick = () => {
            numbersRemaining = [];
            //correct selection
            if (cell.textContent == numberReadied[0] && window.getComputedStyle(cell).color == 'rgba(0, 0, 0, 0)') {
                cell.style.color = 'black';
                cell.style.backgroundColor = 'rgba(201, 252, 168, 0.89)';
                setTimeout(() => {
                    cell.style.transition = 'background-color 1s ease-out';
                    cell.style.backgroundColor = 'rgba(228, 228, 228, 1)';
                }, 10);
                let numButts = document.querySelectorAll('#numberButtons button');
                for (let c = 0; c < 9; c++) {
                    numButts[c].style.backgroundColor = 'rgba(110, 165, 240, 0.895)';
                    numButts[c].style.boxShadow = '2px 1px 4px 0';
                }
                for (let l = 0; l < 9; l++) {
                    for (let m = 0; m < 9; m++) {
                        let newCell = document.getElementById(`row${l+1}col${m+1}`);
                        //console.log("newCell " + newCell.textContent);
                        if (window.getComputedStyle(newCell).color == 'rgba(0, 0, 0, 0)') {
                            //console.log("newCell value " + newCell.style.color);
                            numbersRemaining += newCell.textContent;
                        }
                    }
                }
                currentScore += scoreGain;
                scoreNum.textContent = currentScore;
                if (numbersRemaining.length < 2) {
                    hint.style.backgroundColor = 'rgba(248, 245, 61, 0.21)';
                    stopHint;
                }
                //winning condition
                if (numbersRemaining.length == 0) {
                    saveHighScore(currentUser, currentScore);
                    setTimeout(loadHighScores('yes'), 1000);
                    return;
                }
            //incorrect selection
            } else {
                scoreGain -= 2;
                cell.classList.add('wiggleButton');
                setTimeout(() => {
                    cell.classList.remove('wiggleButton');
                }, 1000);
            }
            numbersRemaining = [];
            for (let l = 0; l < 9; l++) {
                for (let m = 0; m < 9; m++) {
                    let newCell = document.getElementById(`row${l+1}col${m+1}`);
                    console.log("newCell " + newCell.textContent);
                    if (window.getComputedStyle(newCell).color != 'black') {
                        console.log("newCell value " + newCell.style.color);
                        numbersRemaining += newCell.textContent;
                    }
                }
            }
            console.log("numbersRemaining " + numbersRemaining);
        }
        if (a == 0 || a == 3) {
            cell.style.borderTopWidth = `6px`;
        } else if (a == 2 || a == 5 || a == 8) {
            cell.style.borderBottomWidth = `6px`;
        }
        if (b == 0 || b == 3 || b == 6) {
            cell.style.borderLeftWidth = `6px`;
        } if (b == 2 || b == 5 || b == 8) {
            cell.style.borderRightWidth = `6px`;
        }
    }
}
}

//sets up the board to have blanks for the player to fill
//difficulty is an int for how many blanks you want
function setDifficulty(difficulty) {
    let gridNums = document.querySelectorAll('#gameBoard div');
    for (let j = 0; j < 81; j++) {
        gridNums[j].style.color = 'black';
    }
    for (let d = 0; d < (difficulty + 1); d++) {
        let row = Math.floor(1 + (Math.random() * 9));
        let col = Math.floor(1 + (Math.random() * 9));
        let cell = document.getElementById('row' + (row) + 'col' + (col));
        if (window.getComputedStyle(cell).color == 'rgba(0,0,0,0)') {
            d--;
        } else {
            cell.style.color = 'rgba(0,0,0,0)';
        }
    }
    scoreGain = difficulty;
}

function checkSpace(num) {
    if (num == numberReadied[0]) {
        return true;
    } else {
        return false;
    }
}

function expandButtons (option) {
    if (option == 'difficulty') {
        if (window.getComputedStyle(difficultyButtons).display == 'none') {
            difficultyButtons.style.display = 'flex';
        } else {
            difficultyButtons.style.display = 'none';
        }
    } else if (option == 'scoreBar') {
        if (window.getComputedStyle(scoreBar).display == 'none') {
            scoreBar.style.display = 'flex';
        } else {
            scoreBar.style.display = 'none';
        }
    } else if (option == 'hide') {
        if (window.getComputedStyle(menuButtons).display == 'none') {
            menuButtons.style.display = 'flex';
            difficultyButtons.style.display = 'flex';
            score.style.display = 'block';
        } else {
            menuButtons.style.display = 'none';
            difficultyButtons.style.display = 'none';
            score.style.display = 'none';
        }
    }
}

easy.onclick = () => {
    myGame.wipeBoard();
    myGame.generateBoard(0,0);
    setGame();
    setDifficulty(20);
    expandButtons('difficulty');
}
medium.onclick = () => {
    myGame.wipeBoard();
    myGame.generateBoard(0,0);
    setGame();
    setDifficulty(30);
    expandButtons('difficulty');
}
hard.onclick = () => {
    myGame.wipeBoard();
    myGame.generateBoard(0,0);
    setGame();
    setDifficulty(40);
    expandButtons('difficulty');
}

hint.onclick = () => {
    numbersRemaining = [];
    for (let l = 0; l < 9; l++) {
        for (let m = 0; m < 9; m++) {
            let newCell = document.getElementById(`row${l+1}col${m+1}`);
            
            if (window.getComputedStyle(newCell).color == 'rgba(0, 0, 0, 0)') {
                numbersRemaining += newCell.textContent;
            }
        }
    }
    console.log("hint clicked");
    
    for (let a = 0; a < 9; a++) {
        for (let b = 0; b < 9; b++) {
            let currentCell = document.getElementById(`row${a+1}col${b+1}`);
            if (window.getComputedStyle(currentCell).color == 'rgba(0, 0, 0, 0)' && stopHint == 0) {
                console.log("was blank");
                console.log("numbersRemaining: " + numbersRemaining[0]);
                if (currentCell.textContent == numbersRemaining[0]) {
                    console.log("success");
                    currentCell.style.color = 'black';
                    stopHint++;
                }
            }
        }
    }
    stopHint = 0;
    if (hintNum > 0) {
        hintNum--;
    }
    scoreGain = scoreGain - 5;
    if (scoreGain < 0) {
        scoreGain = 0;
    }
    numbersRemaining = [];
    for (let l = 0; l < 9; l++) {
        for (let m = 0; m < 9; m++) {
            let newCell = document.getElementById(`row${l+1}col${m+1}`);
            if (window.getComputedStyle(newCell).color == 'rgba(0, 0, 0, 0)') {
                numbersRemaining += newCell.textContent;
            }
        }
    }
    if (numbersRemaining.length < 4) {
        hint.style.backgroundColor = 'rgba(248, 245, 61, 0.21)';
        stopHint++;
        return;
    }
}

difficultyExpander.onclick = () => {
    expandButtons("difficulty");
}
expandScore.onclick = () => {
    expandButtons("scoreBar");
}

submitUsername.onclick = (e) => {
    e.preventDefault();
    currentUser = $('#usernameField').val();
    console.log(currentUser);
    $('#usernameFormContainer').css('display', 'none');
    username.textContent = currentUser;
    expandButtons('hide');
}

function saveHighScore(playerUsername, finalScore) {
    const url = 'https://sudokuaf.onrender.com/add-data';
    const data = {
        username: playerUsername,
        score: finalScore
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
        console.log("Success: ", result.message);
        alert('Score Saved!');
    })
    .catch(error => {
        console.error('Error ', error);
    });
    difficultyButtons.style.display = 'none';
    numberButtons.style.display = 'none';
    scoreBar.style.display = 'none';
    gameBoard.style.display = 'none';
}

function loadHighScores(display) {
    console.log("loaded");
    fetch('https://sudokuaf.onrender.com/get-highscores')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('scoreBody');
        tableBody.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.USERNAME}</td>
                <td>${row.SCORE}</td>
            `;
            tableBody.appendChild(tr);
        });
    })
    .catch(error => console.error('Error:', error));
    if (display == 'yes') {
        leaderboardContainer.style.display = 'flex';
    } else {
        leaderboardContainer.style.display = 'none';
    }
}