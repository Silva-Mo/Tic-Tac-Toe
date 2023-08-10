const containerBoard = document.querySelector('.grid-container');
const squares = document.querySelectorAll('.square');
const pvpBtn = document.querySelector('.Player-vs-Player');
const modalContainer = document.querySelector('.modal-container');
const modalPvP = document.querySelector('.modal-PvP');
const submitBtn = document.querySelector('.submit');
const resetBtn = document.querySelector('.reset');
const form = document.querySelector('form');
const inputs = document.querySelectorAll('input');
const startScreen = document.querySelector('.start-screen');
const gameTurns = document.querySelector('.game-turns');
const footer = document.querySelector('.footer');
const contentDiv = document.querySelector('.content');
const player1Name = document.querySelector('.player1-name');
const player2Name = document.querySelector('.player2-name');
const divGameTurns = document.querySelector('.game-turns');
const winner = document.querySelector('.winner');
const winnerName = document.querySelector('.winner-name');
const restartBtn = document.querySelector('.restart-btn');
const AIbtn = document.querySelector('.Player-vs-AI');
const modalAIContainer = document.querySelector('.modal-container-AI');
const easyMode = document.querySelector('.easy');
const hardMode = document.querySelector('.hard');
const closeModalBtns = document.querySelectorAll('img[alt="close"]');
const homeBtn = document.querySelector('.home');

function player(name, marker){
    return {name, marker};
}

containerBoard.addEventListener('click', (e) => {
    if ((e.target.classList.contains('square')) && (e.target.childNodes.length === 0) && !gameBoard.winner && !gameBoard.AIMode){
        let square =  e.target;
        gameBoard.playerTurnNum(gameBoard.previousPlayer);
        displayController.highlightTurns();
        gameBoard.placeMarker(gameBoard.getMarker(gameBoard.previousPlayer), square);
        if (gameBoard.detectWin(gameBoard.getMarker(gameBoard.previousPlayer)) === "O"){
            gameBoard.announceWinner("O");
        }
        else if (gameBoard.detectWin(gameBoard.getMarker(gameBoard.previousPlayer)) === "X"){
            gameBoard.announceWinner("X");
        }
        else if (gameBoard.detectWin(gameBoard.getMarker(gameBoard.previousPlayer)) === "Tie"){
            gameBoard.announceWinner("Tie");
        }
    }

    else if ((e.target.classList.contains('square')) && (e.target.childNodes.length === 0) && !gameBoard.winner && gameBoard.AIMode){
        let square =  e.target;
        gameBoard.placeMarker("X", square);
        gameBoard.previousPlayer = "1";
        if (gameBoard.detectWin("X") === "X"){
            gameBoard.announceWinner("X");
        }
        if (gameBoard.previousPlayer === "1" && !gameBoard.winner && !gameBoard.isBoardFull()){
            gameBoard.placeMarker("O", squares[gameBoard.AInextMove()]);
            if (gameBoard.detectWin("O") === "O"){
                gameBoard.announceWinner("O");
            }
        }
        if (gameBoard.detectWin("X") === "Tie" && !(gameBoard.detectWin("X") === "X") && !(gameBoard.detectWin("O") === "O")){
            gameBoard.announceWinner("Tie");
        }
    }
})

pvpBtn.addEventListener('click', () => {
    displayController.showModal();
})

AIbtn.addEventListener('click', () => {
    displayController.showAIModal();
})

resetBtn.addEventListener('click', (e) => {
    inputs.forEach((input) =>{
        input.classList.remove('focused');
        })
    }) 

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (form.checkValidity()){
        gameBoard.player1 = player(inputs[0].value, "X");
        gameBoard.player2 = player(inputs[1].value, "O");
        resetBtn.click();
        displayController.close(); 
        displayController.showGame(); 
        displayController.showNames(); 
        displayController.highlightTurns(); 
    }
    else{
        displayController.showError();
    }
})

easyMode.addEventListener('click', () => {
    gameBoard.AIMode = true;
    gameBoard.startAIMode();
})

hardMode.addEventListener('click', () => {
    gameBoard.AIMode = true;
    gameBoard.UnbeatableMode = true;
    gameBoard.startAIMode();
})

restartBtn.addEventListener('click', () => {
    gameBoard.restartGame();
    squares.forEach((square) => {
        square.innerHTML = "";
    })
    displayController.closeWinner();
    displayController.showHighlights();
    if (gameBoard.AIMode === false){
        displayController.highlightTurns();    
    }
})

closeModalBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        displayController.closeModal();
    })
})

homeBtn.addEventListener('click', () => {
    restartBtn.click();
    displayController.closeGame();
    displayController.showStartScreen();
    gameBoard.AIMode = false;
    gameBoard.UnbeatableMode = false;
})

const gameBoard = (function(){
    const gameBoardArr = ["","","","","","","","",""];

    const winCombinations = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[2,4,6],[0,4,8]];

    let AIMode = false;

    let UnbeatableMode = false;
 
    let previousPlayer = "";

    const startAIMode = () => {
        gameBoard.player1 = player("You", "X");
        gameBoard.player2 = player("AI", "O");
        displayController.close();
        displayController.showGame();
        displayController.showNames();
        player2Name.style.borderBottom = "3px solid transparent";
        player1Name.style.borderBottom = "3px solid transparent";
    }

    const detectWin = (marker, board = gameBoardArr) => {
        let filteredGameBoard = [];
        for (let i = 0; i < board.length; i++){
            if (board[i] === marker){
                filteredGameBoard.push(i);
            }
        }

        for (let i = 0; i < winCombinations.length; i++){  
            if (marker === "X"){
                if(getCompareResult(filteredGameBoard, winCombinations[i])){
                    highlightWinner("X", winCombinations[i]);   
                    return "X";
                }
            }
            else if (marker === "O"){
                if(getCompareResult(filteredGameBoard, winCombinations[i])){
                    highlightWinner("O", winCombinations[i]);    
                    return "O";
                }
            }  
        }
        if (board.some((element) => {if (element === "") {return true}}) === false){
            return "Tie";
        }
    }

    const announceWinner = (winnerMarker) => {
        gameBoard.winner = winnerMarker;
        displayController.closeHighlights();
        displayController.showWinner(winnerMarker);
    }

    let minimaxMode = false;

    const minimax = (marker, newBoard = gameBoardArr) => {
        minimaxMode = true;
        let emptySpots = [];
        for (let i = 0; i < newBoard.length; i++){
            if (newBoard[i] === "")
            emptySpots.push(i);
        }

        if (detectWin("X", newBoard) === "X"){
            return {score: -10};
        }
        else if (detectWin("O", newBoard) === "O"){
            return {score: 10};
        }

         if (emptySpots.length === 0){
            return {score: 0};
        }

        let moves = [];
        for (let i = 0; i < emptySpots.length; i++) {
            let move = {};
            move.index = emptySpots[i];
            newBoard[emptySpots[i]] = marker;

            if (marker === "O"){
                let result = minimax("X", newBoard).score;
                move.score = result;
            }
            else {
                let result = minimax("O", newBoard).score;
                move.score = result;
            }
            moves.push(move);
            newBoard[emptySpots[i]] = "";
        }

        let bestMove;
        if(marker === "O"){
            let bestScore = -10000;
            for(var i = 0; i < moves.length; i++){
              if(moves[i].score > bestScore){
                bestScore = moves[i].score;
                bestMove = moves[i];
              }
            }
          }else{
            let bestScore = 10000;
            for(let i = 0; i < moves.length; i++){
              if(moves[i].score < bestScore){
                bestScore = moves[i].score;
                bestMove = moves[i];
              }
            }
          }
          minimaxMode = false;
          return bestMove;
    }

    const getCompareResult = (filteredGameBoard, combination) => {
        let accumlator = 0;
        combination.forEach((num) => {
        if (filteredGameBoard.includes(num)){
            accumlator++;
        }
        })
        
        if (!(accumlator < 3)){
            return true;
        }
    }
    
    
    const playerTurnNum = (previousPlayer) =>{
        if (previousPlayer === "2" || previousPlayer === ""){
            gameBoard.previousPlayer = "1";
        }
        else{
            gameBoard.previousPlayer = "2";
        }
    }

    const getMarker = (playerTurn)=> {
        if (playerTurn === "1"){
            return gameBoard.player1.marker;
        }
        else if (playerTurn === "2"){
            return gameBoard.player2.marker;
        }
    }

    const placeMarker = (marker, square) => {
        gameBoardArr[square.getAttribute("data-index")] = `${marker}`;
        if (marker === "X"){
            const imgX = document.createElement('img');
            imgX.setAttribute('src', 'imgs/X.svg');
            imgX.classList.add('X');
            square.appendChild(imgX);
        }
        else if (marker === "O"){
            const imgO = document.createElement('img');
            imgO.setAttribute('src', 'imgs/O.svg');
            imgO.classList.add('O');
            square.appendChild(imgO);
        }
    }

    const highlightWinner = (marker, combination) => {
        if (marker === "X" && !minimaxMode){
            for (let i = 0; i < combination.length; i++){
                let img = squares[combination[i]].firstElementChild;
                img.setAttribute('src', 'imgs/winX.svg');
                img.className = 'winX';
            }
        }
        else if (marker === "O" && !minimaxMode){
            for (let i = 0; i < combination.length; i++){
                let img = squares[combination[i]].firstElementChild;
                img.setAttribute('src', 'imgs/winO.svg');
                img.className = 'winO';
            }
        }
    }

    const restartGame = () =>{
        gameBoard.previousPlayer = "";
        delete gameBoard.winner;
        for (let i = 0; i < gameBoardArr.length; i++){
            gameBoardArr[i] = "";
        }
    }

    const randomMove = () => {
        if (gameBoardArr.some((element) => {if (element === "") {return true}}) === false){
            return;
        }
        let randomNum = (Math.round(Math.random() * 9)).toString();
        if (!(gameBoardArr[randomNum] === "")){
            return randomMove();
        }
        else  {
            return randomNum;
        }
    }

    const AInextMove = () => {
        if (gameBoard.UnbeatableMode){
            return minimax("O").index;    
        }
        else {
            return randomMove();
        }
    }

    const isBoardFull = () => {
        if(gameBoardArr.some((element) => {if (element === "") {return true}}) === false){
            return true;
        }
        else {
            return false;
        }
    }

    return {playerTurnNum, getMarker, placeMarker, detectWin, AInextMove,
        previousPlayer, restartGame, AIMode, isBoardFull, startAIMode, announceWinner};
})()

const displayController = (function (){
    const showModal= () => {
        modalContainer.style.display = "flex";
    }

    const inputFocusEffect = (inputs) => {
        inputs.forEach((input) => {
            input.addEventListener('focus', (e) => {
                input.classList.add('focused');
            })
        
            input.addEventListener('blur', (e) => {
                if (input.value === "" || input.value === null){
                    input.classList.remove('focused');
                }
                else {
                    e.preventDefault();
                }
            })    
        })
    }

    const showError = () => {
        Array.from(inputs).reverse().forEach((input) => {
            if (!input.validity.valid){
                input.reportValidity();
            }
        })
    }

    const close = () => {
        modalContainer.style.display = "none";
        modalAIContainer.style.display = "none";
        startScreen.style.display = "none";
    }

    const closeGame = () =>{
        containerBoard.style.display = "none";
        gameTurns.style.display = "none";
        footer.style.display = "none";
        contentDiv.style.display = "none";
    }

    const showStartScreen = () =>{
        startScreen.style.display = "flex";
    }

    const closeModal = () => {
        modalContainer.style.display = "none";
        modalAIContainer.style.display = "none";
    }

    const showGame = () => {
        containerBoard.style.display = "grid";
        gameTurns.style.display = "flex";
        footer.style.display = "flex";
        contentDiv.style.display = "flex";
    }

    const showNames = () => {
        player1Name.textContent = gameBoard.player1.name;
        player2Name.textContent = gameBoard.player2.name;
    }

    const highlightTurns = () => {
        if (gameBoard.previousPlayer === "2" || gameBoard.previousPlayer === ""){
            player2Name.style.borderBottom = "3px solid transparent";
            player1Name.style.borderBottom = "3px solid greenYellow";
        }
        else{
            player2Name.style.borderBottom = "3px solid yellow";
            player1Name.style.borderBottom = "3px solid transparent";
        }
    }

    const closeHighlights = () => {
        divGameTurns.style.display = "none";
    }

    const showHighlights = () => {
        divGameTurns.style.display = "flex";
    }

    const showWinner = (winnerResult) => {
        if (winnerResult === "X"){
            winnerName.textContent = `Winner is ${gameBoard.player1.name}`;
            winnerName.style.color = "greenyellow";
        }
        else if (winnerResult === "O"){
            winnerName.textContent = `Winner is ${gameBoard.player2.name}`;
            winnerName.style.color = "yellow";
        }
        else if (winnerResult === "Tie"){
            winnerName.textContent = "it's a Tie";
            winnerName.style.color = "white";
        }
        winner.style.display = "flex";
    } 

    const closeWinner = () => {
        winner.style.display= "none";
    }

    const showAIModal = () => {
        modalAIContainer.style.display = "flex";
    }

    return {showModal, inputFocusEffect, showError, close, showGame, showNames, closeModal, showStartScreen,
        highlightTurns,closeHighlights, showWinner, closeWinner, showHighlights, showAIModal, closeGame};
})()

displayController.inputFocusEffect(inputs);
