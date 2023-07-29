const containerBoard = document.querySelector('.grid-container');
const squares = document.querySelectorAll('.square');

function player(name, marker){
    return {name, marker};
}

const player1 = player('Jack', "X");
const player2 = player('Silva', "O");
let previousPlayer = "";
let winner = "";

containerBoard.addEventListener('click', (e) => {
    if (!(e.target === containerBoard) && (e.target.textContent === "") && !winner){
        let square =  e.target;
        gameBoard.playerTurnNum(previousPlayer);
        gameBoard.placeMarker(gameBoard.getMarker(previousPlayer), square);
        if (gameBoard.detectWin(gameBoard.getMarker(previousPlayer)) === "O"){
            console.log("0 has won");
            winner = "O";
        }
        else if (gameBoard.detectWin(gameBoard.getMarker(previousPlayer)) === "X"){
            console.log("X has won");
            winner = "X"
        }
    }
})

const gameBoard = (function(){
    const gameBoardArr = ["","","" 
                         ,"","",""
                         ,"","",""]
    
    const winCombinations = [
        [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[2,4,6],[0,4,8]
    ]

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
                    return "X";
                }
            }
            else if (marker === "O"){
                if(getCompareResult(filteredGameBoard, winCombinations[i])){
                    return "O";
                }
            }  
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
    
    
    const playerTurnNum = () =>{
        if (previousPlayer === "2" || previousPlayer === ""){
            previousPlayer = "1";
        }
        else{
            previousPlayer = "2";
        }
    }

    const getMarker = (playerTurn)=> {
        console.log(playerTurn);
        if (playerTurn === "1"){
            return player1.marker;
        }
        else if (playerTurn === "2"){
            return player2.marker;
        }
    }

    const placeMarker = (marker, square) => {
        gameBoardArr[square.getAttribute("data-index")] = `${marker}`;
        square.textContent = `${marker}`;
    }


    return {playerTurnNum, getMarker, placeMarker, detectWin}
})()

