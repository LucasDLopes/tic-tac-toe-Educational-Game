//Script setup, start global variables, gamestate, questionlist, board, etc
const clientId="013679e73555b52";
//const clientSecret = "dc8782724fd6355c6867b018bddd200122af5073";
const refreshToken="25c878fa7a91576fad7dcff3de7035b4c44e3651";
const albumToken ="OnQLObe";
var imgurResponse;

var myHeaders = new Headers();
myHeaders.append("Authorization", "Client-ID {{clientId}}");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
};

let curPlayer='X';
let board=['','','','','','','','',''];
let questionList=[
    {"question":"Sample Question 1","options":["1","2","3","4"],"answer":1, "image":"","answerImage":[]},
    {"question":"When was the followind meme template first introduced?","options":["1","2","3","4"],"answer":3 ,"image":"","answerImage":[]},
    {"question":"Select the best definition of PLANT below:","options":["A creature that breathes fire","A creature with legs","A creature that has eyes","Has leaves"],"answer":4 ,"image":"","answerImage":[]},
    {"question":"Example 4","options":["1233","231","313","123"],"answer":2 ,"image":"","answerImage":[]},
    {"question":"Example 5","options":["44","33","22","11"],"answer":3 ,"image":"","answerImage":[]},
    {"question":"What is the meaning of life?","options":["123","123","123","123"],"answer":1 ,"image":"","answerImage":[]},
    {"question":"If picked at random, what is the chance you will get this answer right?","options":["25%","25%","50%","75%"],"answer":2 ,"image":"","answerImage":[]},
    {"question":"Yet another question","options":["123","123","123","123"],"answer":3 ,"image":"","answerImage":[]},
    {"question":"What should follow this sequence? 0-1-1-2-3-5-8","options":["122","13","11","12"],"answer":4 ,"image":"","answerImage":[]},
    {"question":"What is 3!?","options":["2","3","6","11"],"answer":3 ,"image":"","answerImage":[]}
];
/*
Start grabbing images from IMGUR following the formatting rules of the application (refer to README) and populate the necessary fields.
*/
fetch( 'https://api.imgur.com/3/album/' + albumToken +'/images',{
    method:"GET",
    headers:{
        'Authorization':'Client-ID '+clientId
    }
})
.then(response => response.json())
  .then(result => {
    console.log(result);
    imgurResponse=result;
    let i =0;
    imgurResponse.data.forEach(img=>{
        if(img.description.includes('-')){
            console.log("found an answer image!");
            var questionIndex= img.description.substring(0, img.description.indexOf("-"))-1;
            var answerIndex =img.description.slice(img.description.indexOf("-")+1)-1;
            questionList[questionIndex].answerImage[answerIndex]=img.link;
        }else{
            console.log("found a Question image");
            var x = Number(img.description)-1;
            questionList[x].image=img.link;
        }
    });
})
  .catch(error => console.log('error', error));

//Add event listeners to cells in the html.
const cells = document.querySelectorAll('.cell');
cells.forEach(cell => {
    cell.addEventListener('click', selectedCellEvent, false);
});

let selectedCell =0;
let currentQuestion ={question:"",options:["","","",""],answer:0}
let gameState="player move"; //"player move" "question" "steal" "game over"
const modal = document.getElementById("questionModal");
const questionSlot = document.getElementById("questionSlot");
const imageSlot = document.getElementById("imageSlot");
var rb1 = document.getElementById("rb1");
var rb2 = document.getElementById("rb2");
var rb3 = document.getElementById("rb3");
var rb4 = document.getElementById("rb4");
var lb1 = document.getElementById("lb1");
var lb2 = document.getElementById("lb2");
var lb3 = document.getElementById("lb3");
var lb4 = document.getElementById("lb4");
const radioButtons = document.getElementsByName("radioButton");
/*
This is the action triggered whenever a cell was clicked.
*/
function selectedCellEvent(event){
    let clickedCellIndex = parseInt(event.target.id.replace('cell-',''))-1;
    if(board[clickedCellIndex]!=='' || gameState =='game over'){
        return;
    }
    selectedCell=clickedCellIndex;
    if(gameState=="player move"){
        //console.log("attempting to display question");
        gameState="question";
        //change player state to "question"
        // and call the function to display a random question
        displayRandomQuestion();
    }
}
/*
This is the action triggered whenever an "Answer-Option"/radio button is selected
Handles the switching of regular and steal modes
*/
function selectedOption(index){
    if(gameState=="question"){
        if(index==currentQuestion.answer){
            //success, now make the square the current user
            //console.log("CORRECT, MARKING SLOT FOR PLAYER");
            board[selectedCell]=curPlayer;
            modal.style.display = "none";
            updateBoardDisplay();
        }else{
            //console.log("INCORRECT, OTHER PLAYER CAN STEAL!!");
            gameState="steal"
            modal.style.display = "none";
            displayRandomQuestion();
        }
    }
    else if(gameState=="steal"){
        if(index==currentQuestion.answer){
            //console.log("OPPONENT STEALS!");
            let opponent = 'X';
            if(curPlayer=='X') opponent='O';
            board[selectedCell]=opponent;
        }
        else{
            //console.log("Opponent fails to steal");
        }
        modal.style.display = "none";
        updateBoardDisplay();
    }
}

/**
 * change current player
 */
function changePlayer(){
    curPlayer = curPlayer=='X'?'O':'X';
    //console.log("CURRENT PLAYER IS NOW: " + curPlayer);
    gameState="player move"
}

/**
 * change the dom display
 */
function updateBoardDisplay(){
    for(let i=0;i<cells.length;i++){
        cells[i].innerText = board[i];
    }
    checkForWinOrDraw();
}

/**
 * Grab a random question from the list
 * populate the modal with the appropriate text and images
 * display the modal
 */
function displayRandomQuestion(){
    //step 1: grab random question from question list
    let ran= Math.floor(Math.random() * (questionList.length));
    //let ran=0;
    //console.log(ran);
    currentQuestion=questionList[ran];
    //console.log(currentQuestion);

    //step 2: place question text into modal
    questionSlot.innerHTML=currentQuestion.question;
    imageSlot.src = currentQuestion.image;
    var imageAnswer = document.querySelectorAll('.answer-image');
    var index=0;
    imageAnswer.forEach(imageAnswerSlot => {
        if(currentQuestion.answerImage[index]){
            imageAnswerSlot.src=currentQuestion.answerImage[index];
            imageAnswerSlot.style.display = "block";
        }else{
            imageAnswerSlot.style.display = "none";
        }
        index++;
    });
    
    //Step 3:populate labels of the radio buttons
    lb1.innerHTML=currentQuestion.options[0].toString();
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
  /**
   * Use above const and functions alongside checkForWinOrDraw
   * checks board against winConditions, and trhows either win or draw or next turn
   * @returns 
   */
  
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
        if(gameState=='steal'){
            changePlayer();
        }
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
    changePlayer();
  }

  /**
   * Reset Game, reset board state. Question array with images,etc remains.
   */

  function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameState = 'player move';
    curPlayer = 'X';
    cells.forEach(cell => {
        cell.innerText = '';
    });
    document.getElementById('gameMessage').innerText = '';
  }
  
  //attach listener to reset button
  const resetButton = document.getElementById('resetButton');
  resetButton.addEventListener('click', resetGame, false);



