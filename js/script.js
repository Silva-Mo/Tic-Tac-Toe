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

function player(name, marker){
    return {name, marker};
}

containerBoard.addEventListener('click', (e) => {
    if ((e.target.classList.contains('square')) && (e.target.childNodes.length === 0) && !gameBoard.winner){
        let square =  e.target;
        gameBoard.playerTurnNum(gameBoard.previousPlayer);
        displayController.highlightTurns();
        gameBoard.placeMarker(gameBoard.getMarker(gameBoard.previousPlayer), square);
        if (gameBoard.detectWin(gameBoard.getMarker(gameBoard.previousPlayer)) === "O"){
            console.log("O has won");
            gameBoard.winner = "O";
            displayController.closeHighlights();
            displayController.unHighlightTurns();
            displayController.showWinner("O");

        }
        else if (gameBoard.detectWin(gameBoard.getMarker(gameBoard.previousPlayer)) === "X"){
            console.log("X has won");
            gameBoard.winner = "X"
            displayController.closeHighlights();
            displayController.unHighlightTurns();
            displayController.showWinner("X");
        }
        else if (gameBoard.detectWin(gameBoard.getMarker(gameBoard.previousPlayer)) === "Tie"){
            console.log("Tie");
            gameBoard.winner = "Tie";
            displayController.closeHighlights();
            displayController.unHighlightTurns();
            displayController.showWinner("Tie");
        }
    }
})

pvpBtn.addEventListener('click', () => {
    displayController.showModal();
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

restartBtn.addEventListener('click', () => {
    gameBoard.restartGame();
    squares.forEach((square) => {
        square.innerHTML = "";
    })
    
})

const gameBoard = (function(){
    const gameBoardArr = ["","","" 
                         ,"","",""
                         ,"","",""]
    
    const winCombinations = [
        [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[2,4,6],[0,4,8]
    ]
 
    let previousPlayer = "";

    const detectWin = (marker) => {
        let filteredGameBoard = [];
        for (let i = 0; i < gameBoardArr.length; i++){
            if (gameBoardArr[i] === marker){
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

        if (gameBoardArr.some((element) => {if (element === "") {return true}}) === false){
            return "Tie"
        }
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
            imgX.setAttribute('src', '../imgs/X.svg');
            imgX.classList.add('X');
            square.appendChild(imgX);
        }
        else if (marker === "O"){
            const imgO = document.createElement('img');
            imgO.setAttribute('src', '../imgs/O.svg');
            imgO.classList.add('O');
            square.appendChild(imgO);
        }
    }

    const highlightWinner = (marker, combination) => {
        if (marker === "X"){
            for (let i = 0; i < combination.length; i++){
                let img = squares[combination[i]].firstElementChild;
                squares[combination[i]].removeChild(img);
                const winX = document.createElement('img');
                winX.setAttribute('src', '../imgs/winX.svg');
                winX.classList.add('winX');
                squares[combination[i]].appendChild(winX);
            }
        }
        else if (marker === "O"){
            for (let i = 0; i < combination.length; i++){
                let img = squares[combination[i]].firstElementChild;
                squares[combination[i]].removeChild(img);
                const winO = document.createElement('img');
                winO.setAttribute('src', '../imgs/winO.svg');
                winO.classList.add('winO');
                squares[combination[i]].appendChild(winO);
            }
        }
    }

    const restartGame = () =>{
        previousPlayer = "";
        delete gameBoard.previousPlayer;
        delete gameBoard.winner;
        for (let i = 0; i < gameBoardArr.length; i++){
            gameBoardArr[i] = "";
        }
    }

    return {playerTurnNum, getMarker, placeMarker, detectWin, previousPlayer, restartGame};
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
        startScreen.style.display = "none";
    }
    
    const showGame = () => {
        containerBoard.style.display = "grid";
        gameTurns.style.display = "flex";
        footer.style.display = "block";
        contentDiv.style.display = "flex";
    }

    const showNames = () => {
        player1Name.textContent = gameBoard.player1.name;
        player2Name.textContent = gameBoard.player2.name;
    }

    const highlightTurns = () => {
        if (gameBoard.previousPlayer === "2" || gameBoard.previousPlayer === ""){
            player2Name.style.borderBottom = "3px solid transparent"
            player1Name.style.borderBottom = "3px solid greenYellow";
        }
        else{
            player2Name.style.borderBottom = "3px solid yellow"
            player1Name.style.borderBottom = "3px solid transparent"
        }
    }

    const unHighlightTurns = () => {
        player1Name.style.borderBottom = "3px solid transparent"
        player2Name.style.borderBottom = "3px solid transparent"
    }

    const closeHighlights = () => {
        divGameTurns.style.display = "none";
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
            winner.style.color = "white";
        }
        winner.style.display = "flex";
    } 

    return {showModal, inputFocusEffect, showError, close, showGame, showNames, highlightTurns, unHighlightTurns, closeHighlights, showWinner};
})()

displayController.inputFocusEffect(inputs);
