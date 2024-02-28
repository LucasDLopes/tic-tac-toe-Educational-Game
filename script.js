let curPlayer='X';
let board=['','','','','','','','',''];
let questionList=[
    {"question":"Example 1","options":["1","2","3","4"],"answer":1},
    {"question":"Example 2","options":["1","2","3","4"],"answer":3},
    {"question":"Example 3","options":["123","231","231","12"],"answer":4},
    {"question":"Example 4","options":["1233","231","313","123"],"answer":2},
    {"question":"Example 5","options":["44","33","22","11"],"answer":3},
    {"question":"Example 6","options":["123","123","123","123"],"answer":1},
    {"question":"Example 7","options":["123","123","123","123"],"answer":2},
    {"question":"Example 8","options":["123","123","123","123"],"answer":3},
    {"question":"Example 9","options":["1415","13","123","123"],"answer":4},
    {"question":"Example 10","options":["1223","333","222","11"],"answer":3}
];
const cells = document.querySelectorAll('.cell');
cells.forEach(cell => {
    cell.addEventListener('click', selectedCellEvent, false);
});

let selectedCell =0;
let currentQuestion ={question:"",options:["","","",""],answer:0}
let gameState="player move"; //"player move" "question" "steal" "game over"
const modal = document.getElementById("questionModal");
const questionSlot = document.getElementById("questionSlot");
//var btn = document.getElementById("myBtn");
var rb1 = document.getElementById("rb1");
var rb2 = document.getElementById("rb2");
var rb3 = document.getElementById("rb3");
var rb4 = document.getElementById("rb4");
var lb1 = document.getElementById("lb1");
var lb2 = document.getElementById("lb2");
var lb3 = document.getElementById("lb3");
var lb4 = document.getElementById("lb4");
const radioButtons = document.getElementsByName("radioButton");


//var span = document.getElementsByClassName("close")[0];


// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// }

function selectedCellEvent(event){
let clickedCellIndex = parseInt(event.target.id.replace('cell-',''))-1;
if(board[clickedCellIndex]!=='' || gameState =='game over'){
    return;
}
selectedCell=clickedCellIndex;
if(gameState=="player move"){
    console.log("attempting to display question");
    gameState="question";
    //change player state to "question"
    // and call the function to display a random question
    displayRandomQuestion();
}
}

function selectedOption(index){
    
    if(gameState=="question"){
        if(index==currentQuestion.answer){
            //success, now make the square the current user
            console.log("CORRECT, MARKING SLOT FOR PLAYER");
            board[selectedCell]=curPlayer;
            modal.style.display = "none";
            changePlayer();
            updateBoardDisplay();
            
        }else{
            console.log("INCORRECT, OTHER PLAYER CAN STEAL!!");
            gameState="steal"

            modal.style.display = "none";
            displayRandomQuestion();

        }
    }
    else if(gameState=="steal"){
        if(index==currentQuestion.answer){
            console.log("OPPONENT STEALS!");
            let opponent = 'X';
            if(curPlayer=='X') opponent='O';
            board[selectedCell]=opponent;

        }
        else{
            console.log("Opponent fails to steal");
        }
        modal.style.display = "none";
        changePlayer();
        updateBoardDisplay();
    }
    
}

function changePlayer(){

    curPlayer = curPlayer=='X'?'O':'X';
    console.log("CURRENT PLAYER IS NOW: " + curPlayer);
    gameState="player move"
}

function updateBoardDisplay(){
    for(let i=0;i<cells.length;i++){
        cells[i].innerText = board[i];
    }
    checkForWinOrDraw();
}


function displayRandomQuestion(){
    //step 1: grab random question from question list
    console.log("display question START");
    let ran= Math.floor(Math.random() * (questionList.length));
    console.log(ran);
    currentQuestion=questionList[ran];
    console.log(currentQuestion);
    console.log(modal);
    //step 2: place question text into modal
    questionSlot.innerHTML=currentQuestion.question;

    //step 3: populate radio buttons
    rb1.ariaValueText=currentQuestion.options[0];
    rb2.ariaValueText=currentQuestion.options[1];
    rb3.ariaValueText=currentQuestion.options[2];
    rb4.ariaValueText=currentQuestion.options[3];
    
    lb1.innerHTML=currentQuestion.options[0].toString();
    console.log(lb1);
    lb2.innerHTML=currentQuestion.options[1].toString();
    lb3.innerHTML=currentQuestion.options[2].toString();
    lb4.innerHTML=currentQuestion.options[3].toString();

    //step 4: unselect radio buttons
    for (const radioButton of radioButtons) {
        radioButton.checked = false;
    }

    //step 5: display modal
    modal.style.display = "block";


}

function announceWinner(player) {
    const messageElement = document.getElementById('gameMessage');
    messageElement.innerText = `Player ${player} Wins!`;
  }
  
  function announceDraw() {
    const messageElement = document.getElementById('gameMessage');
    messageElement.innerText = 'Game Draw!';
  }
  
  const winConditions = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Left-to-right diagonal
    [2, 4, 6]  // Right-to-left diagonal
  ];
  
  function checkForWinOrDraw() {
    let roundWon = false;
  
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }
  
    if (roundWon) {
        changePlayer();
        announceWinner(curPlayer);
        gameState="game over";
        return;
    }
  
    let roundDraw = !board.includes('');
    if (roundDraw) {
        announceDraw();
        gameState="game over";
        return;
    }
  }
  
  function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameState = 'player move';
    curPlayer = 'X';
    cells.forEach(cell => {
        cell.innerText = '';
    });
    document.getElementById('gameMessage').innerText = '';
  }
  
  const resetButton = document.getElementById('resetButton');
  resetButton.addEventListener('click', resetGame, false);



