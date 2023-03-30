

var battle_cell = document.getElementsByClassName("battle-cell"),
    bot_battle_cell = document.getElementsByClassName("bot-battle-cell"),
    bot_table = document.getElementById('bot-battle-field');

var map_player = [],
    map_bot = [];

var player_ship_list = [],
    bot_ship_list = [];


function botRandomField() {
    addAllShips();
    addZeroInArr(map_player);
    map_bot = map_player;
    bot_ship_list = player_ship_list;
    player_ship_list = [];
    map_player = [];
}



function clearField(){
    for (var i in battle_cell){
        battle_cell[i].classList = "battle-cell"
        battle_cell[i].innerHTML = ""
        map_player[i] = 0;       
    }
}

function start(){
    document.getElementById("control-button").style = "display:none;";
    document.getElementsByClassName("bot-field")[0].style = "display:inline;";
}

function randomButton() {
    clearField()

    player_ship_list = [];

    console.clear();
    
    //disabledButton();
        
    addAllShips();

    addZeroInArr(map_player);

    

    printInBattleField(map_player);

    //document.getElementById("bot-move").disabled = false;
    document.getElementById("bot-start").disabled = false;

}

function printInBattleField(map) {
    for (var i in battle_cell){
        if (map[i] == 1){
            battle_cell[i].classList = "battle-cell ship"
        } 
    }
}

function addZeroInArr (arr){
    for (var i = 0; i <= 99; i++){
        if(arr[i] != 1 ) {
            arr[i] = 0;
        }
    }
}

function refresh(map = map_player) {
    for (var i in battle_cell){
        if (map[i] == 1){
            battle_cell[i].classList = "battle-cell ship"
            battle_cell[i].innerHTML = ""
        } else if (map[i] == 2) {
            battle_cell[i].classList = "battle-cell shot-cell"
            battle_cell[i].innerHTML = ""
        } else if (map[i] == 3) {
            battle_cell[i].classList = "battle-cell ship"
            battle_cell[i].innerHTML = "X"
        }
    
    }
    
}


var shipList = [4,3,3,2,2,2,1,1,1,1],
    countShip = shipList.length;

function addAllShips(list = player_ship_list){
    var i = 0;
    while (i < countShip){
        var shipPos = addShip(shipList[i]);
            if (checkCollision(shipPos)){
                addToArray(shipPos);
                list.push(toPositionArr(shipPos));
                i++;
            } else {
                continue;
            }
    }
    
    
}


function addShip (decks){
    
    var randomDirection = Math.floor(Math.random()*2)
        coord = toCoordinates(random())
        arr = []
        toArr = [];

    if(coord[randomDirection] + decks > 10){
        coord[randomDirection] = 10 - decks
    } 
    
    for( var i = 0; i < decks; i++){
        
        if (randomDirection){
            toArr = [coord[0],coord[1]+i];    
        } else {
            toArr = [coord[0]+i,coord[1]];   
        }
        
        arr.push(toArr);
    } 

    return arr;
}


function addToArray(arr , map = map_player) {
    for (var i in arr){
        map[toPosition(arr[i])] = 1;
    }
}


function checkCollision(arr) {
var notColision = true;

    for (var i in arr) {
        for (var x = -1; x <= 1; x++){
            for (var y = -1; y<=1; y++) {
                var posArr = [arr[i][0]+x,arr[i][1]+y]
                    pos = toPosition(posArr);
 
                if (map_player[pos] == 1){
                    console.log("Colision");
                    notColision = false;
                }
            }
        }
    }

    if (notColision){
        return true;
    } else {
        return false;
    }
}










/**********************
    TO NEED NUMBERS
***********************/



function toPosition (arr){
    return (arr[0]-1)*10+(arr[1]-1);
}

function toPositionArr(arr){
    var posArr = [];
    for (var i in arr){
        posArr.push(toPosition(arr[i]));
    }
    return posArr;
}


function toCoordinates (num) {
    var coord = [];

    coord[0] = Math.floor(num/10) + 1;
    if(num > 10){
        coord[1] = (Number((String(num))[1]))+1;
    } else {
        coord[1] = num+1
    }
    return coord;
}

function toCoordinatesArr (arr) {
    var coordArr = [];
    for (var i in arr){
        coordArr.push(toCoordinates(arr[i]));
    }
    return coordArr;
}


function random() {
    return Math.floor(Math.random()*100);
}










/*******************
    SHIP CHECKER
********************/



var killedShips = 0;

function shipIsKilled(pos , arr = player_ship_list) {
    var numShip = selectShipByPos(pos, arr),
        shotDecks = 0;

    for (var i in arr[numShip]){
        if (map_player[arr[numShip][i]] == 3){
            shotDecks++;
        }
    }

    if (arr[numShip].length == shotDecks){

        killedShips++;

        console.log(shotDecks + " deck(s) ship die. Killed ships now:" + killedShips);

        selectDirectionMode = false;
        lineKillMode = false;

        aroundShip(arr[numShip]);

        if(player_ship_list.length == killedShips){
            //document.getElementById("bot-move").disabled = true;

            botWin = true;
            
            console.log("BOT WIN!");

            setTimeout("alert('BOT WIN!')", 300);
            

            //refreshBot();
        } 
        return true;
    }
    
}

function selectShipByPos(pos, arr) {
    for (var n in arr){
        for (var i in arr[n]) {
            if (arr[n][i] == pos){
                return n;
            }
        }
    }
}

function aroundShip(arrPos){
    var arr = toCoordinatesArr(arrPos);
        
    for (var i in arr) {
        for (var x = -1; x <= 1; x++){
            for (var y = -1; y<=1; y++) {
                var posArr = [arr[i][0]+x,arr[i][1]+y];
                   if (posArr[0] != 11 && posArr[1] != 11 && posArr[0] != 0 && posArr[1] != 0){
                        var pos = toPosition(posArr);
                        if (map_player[pos] == 0){
                            map_player[pos] = 2;
                            battle_cell[pos].classList = "battle-cell shot-cell";
                        }
                   }
            }
        }
    }
}










/********************
    PLAYER CONTROL  
*********************/



bot_table.addEventListener('click', function(e){
    var cell = e.target.closest('td'),
        included = false,
        id;
        
       for (var i in bot_battle_cell){
            if (bot_battle_cell[i] == cell) {
                id = i;
                included = true;
                break;
            }
       } 
       if (included){
            playerClick(id)
       }
});


function playerClick(id){
    //console.log(id);

    if (map_bot[id] == 1){
        bot_battle_cell[id].innerHTML = "X";
        bot_battle_cell[id].classList = "bot-battle-cell shot-cell";
        map_bot[id] = 3

        playerKillShip(id);

    } else if (map_bot[id] == 0){
        bot_battle_cell[id].classList = "bot-battle-cell shot-cell";
        map_bot[id] = 2

        botMove();

    } else {
        console.log("skiped player move")
    }
   
}


var killedBotShips = 0;

function playerKillShip(id, arr = bot_ship_list){
    var numShip = selectShipByPos(id, arr),
        shotDecks = 0;

    for (var i in arr[numShip]){
        if (map_bot[arr[numShip][i]] == 3){
            shotDecks++;
        }
    }

    if (arr[numShip].length == shotDecks){

        killedBotShips++;

        console.log(shotDecks + " deck(s) ship die. Killed ships now:" + killedBotShips);

        selectDirectionMode = false;
        lineKillMode = false;

        aroundBotShip(arr[numShip]);

        if(bot_ship_list.length == killedBotShips){

            //document.getElementById("bot-move").disabled = true;

            botWin = true;
            
            console.log("YOU WIN!");

            setTimeout("alert('YOU WIN!')", 300);
            

            //refreshBot();
        } 
        return true;
    }
}


function aroundBotShip(arrPos) {
    var arr = toCoordinatesArr(arrPos);
        
    for (var i in arr) {
        for (var x = -1; x <= 1; x++){
            for (var y = -1; y<=1; y++) {
                var posArr = [arr[i][0]+x,arr[i][1]+y];
                   if (posArr[0] != 11 && posArr[1] != 11 && posArr[0] != 0 && posArr[1] != 0){
                        var pos = toPosition(posArr);
                        if (map_bot[pos] == 0){
                            map_bot[pos] = 2;
                            bot_battle_cell[pos].classList = "bot-battle-cell shot-cell";
                        } else if (map_bot[pos] == 3) {
                            bot_battle_cell[pos].classList = "bot-battle-cell ship";
                        }
                   }
            }
        }
    }
}










/****************
    BOT LOGIC
****************/



botRandomField();

var botWin = false;

function botMove(){
    if (!botWin){
        botMoveStep()
    } 
}


var botMovesCounter = 0,
    //botMovesCounterOnHTML = document.getElementById("bot-moves-counter"),
    selectDirectionMode = false,
    lineKillMode = false;

function botMoveStep() {
    if(selectDirectionMode) {
        selectDirection();
    } else if (lineKillMode){
        lineKill();
    } else {
        botRandomStep();
    }

    //botMovesCounter++
    //botMovesCounterOnHTML.innerHTML = 'Bot Move #' + botMovesCounter;

    //document.getElementById("random-button").disabled = true;
}


function botRandomStep(){
    var r = random();    

    if (map_player[r] == 1) {

        map_player[r] = 3;

        refresh();

        //console.log("shot (rSt) " + toCoordinates(r));

        if (!shipIsKilled(r)){
            selectDirectionMode = true;
            shotCoord = toCoordinates(r);
        }
        
        botMove();

    } else if (map_player[r] == 0 && map_player[r] != 2 && map_player[r] != 3){
        //console.log("miss (rSt) " + toCoordinates(r));

        map_player[r] = 2;
        refresh();

    } else {
        if (map_player.includes(0) || map_player.includes(1)){

            //console.log("Skip Random Position")

            botRandomStep();
        } else {
            botWin = true;
            console.log("not more move")
        }
        
    }
} 


var shotCoord;

function selectDirection() {
    var direction = Math.floor(Math.random()*4),
        nextTryPos,
        shotArr = [0,0];

    switch (direction) {
        case 0:
            nextTryPos = shotCoord[0]+1;
            break;
        case 1:
            nextTryPos = shotCoord[0]-1;
            break;
        case 2:
            nextTryPos = shotCoord[1]+1;
            break;
        case 3:
            nextTryPos = shotCoord[1]-1;
            break;
    }

    if (direction == 0 || direction == 1) {
        shotArr[0] = nextTryPos;
        shotArr[1] = shotCoord[1];
        howLine = 0; //"V"
    } else {
        shotArr[0] = shotCoord[0];
        shotArr[1] = nextTryPos;
        howLine = 1; //"H"
    }

    var shotPos = toPosition(shotArr);

    if (shotArr[0] != 11 && shotArr[1] != 11 && shotArr[0] != 0 && shotArr[1] != 0 && map_player[shotPos] != 2){
        if (map_player[shotPos] == 1) {
            
            console.log("shot (d) " + shotArr);

            map_player[shotPos] = 3;
            refresh();

            selectDirectionMode = false;

            if (!shipIsKilled(shotPos)){
                arrLine = [shotCoord[howLine], shotArr[howLine]];

                lineKillMode = true;
                
            }

            botMove();

        }  else {
            console.log("miss (d) " + shotArr)

            map_player[shotPos] = 2;
            refresh();
        }

    } else {
        console.log("Skip position (selectDirection)")

        if (selectDirectionMode){
            selectDirection();
        }
        
    }

}

var howLine,
    arrLine,
    checkCoord = [0,0],
    checkPos;
    
    

function lineKill(){
    
        checkCoord = giveEdgeCoord(arrLine),        
        checkPos = toPositionArr(checkCoord);
    
        
        
    //console.log(checkCoord);
    

    if (checkCoord.length == 2) {
        var r = Math.floor(Math.random()*2);
        if (lineTryKill(r)) {

        } else {
            lineTryKill(an(r))
        }
        
    } else {
        lineTryKill(0)
    }
 
}

function lineTryKill(r){
    if (map_player[checkPos[r]] == 1){

        //console.log("shot (line) "+ checkCoord[r]);
    
        map_player[checkPos[r]] = 3;
        arrLineAdd(checkCoord[r]);            
        refresh();
        
        if (shipIsKilled(checkPos[r])){
            lineKillMode = false;
        }

        botMove();

        return true;
        
        } else if (map_player[checkPos[r]] == 0){
    
        //console.log("miss (line) "+ checkCoord[r]);
    
        map_player[checkPos[r]] = 2;
            arrLineDel(r);
            refresh();

            return true;
        } else {
            return false;
        }
}


function arrLineDel(n){
    var arrOldLine = checkCoord;
    checkCoord = [];
    checkCoord.push(arrOldLine[n]);
}

function arrLineAdd(arr){
    arrLine.push(arr[howLine]);
}


function an(n){
    if (n) {
        return 0;
    } else {
        return 1;
    }
}



function giveEdgeCoord (arr){
    var first,
        second,
        checkArr = [],
        arrCoords = [];

        first = (Math.min.apply(null, arr)) - 1;
        second = (Math.max.apply(null, arr)) + 1;
        
        if (first != 0) {
            checkArr.push(first);
            if (second != 11){
                checkArr.push(second); 
            }
        } else {
            if (second != 11){
                checkArr.push(second); 
            }
        }
    
        for (var i in checkArr){
            
            if (howLine) {
                arrCoords.push([shotCoord[0], checkArr[i]])
                
            } else {
                arrCoords.push([checkArr[i], shotCoord[1]])
            }
        }

        return arrCoords;
}

