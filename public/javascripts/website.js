var socket = io.connect();

var givenUserName = '';

$(document).ready(function(){

    // User name adding
    $('#submitUser').on('click', function(){
        var usernameInputField = $('#usernameInput');
        var usernameRow = $('#usernameRow');
        var findGameButton = $('#findGame');

        // If none given, assigns random name
        if( usernameInputField.val() !== '' ){
            givenUserName = usernameInputField.val();
        } else {
            givenUserName = 'Unknown' + Math.floor((Math.random()*1000)+1); // Should request server for free username
        }

        socket.emit('addUsername', {username: givenUserName});

        socket.on('nameAttempt', function(name){
            if(name.added){
                usernameRow.addClass('hidden');
                findGameButton.removeClass('hidden');
            } else {
                $('#usernameStatus').text(name.reason);
            }
        });
    });

    // Requests a game
    $('#findGameButton').on('click', function(){
        console.log("Find game button clicked!");

        handleGameStart(socket);
        handleWinLoss(socket);
        handleOpponentSelected(socket);
        handleNextRound(socket);
        handleFinish(socket);

        socket.emit('attemptToFindGame');
        $('#findGameButton').text("You've been put in a que!");
    });

    // Create a game
    $('#createNewGame').on('click', function(){
        console.log("Find game button clicked!");

        handleGameStart(socket);
        handleWinLoss(socket);
        handleOpponentSelected(socket);
        handleNextRound(socket);
        handleFinish(socket);
        handleNewGame(socket);

        socket.emit('createNewGame');
        alert('createNewGame');
    });

    // Join a game
    $('#joinGame').on('click', function(){
        console.log("Find game button clicked!");

        handleGameStart(socket);
        handleWinLoss(socket);
        handleOpponentSelected(socket);
        handleNextRound(socket);
        handleFinish(socket);

        socket.emit('joinGame');
        alert('joinGame');
    });

    // Item clickers
    $('#rock').on('click', function(){
        socket.emit('itemSelected', {item: 'rock'});
        selection($(this), $('#paper'), $('#scissors'));
    });

    $('#paper').on('click', function(){
        socket.emit('itemSelected', {item: 'paper'});
        selection($(this), $('#rock'), $('#scissors'));
    });

    $('#scissors').on('click', function(){
        socket.emit('itemSelected', {item: 'scissors'});
        selection($(this), $('#paper'), $('#rock'));
    });

    // Restart buttonn
    $('#restartBtn').on('click', function(){
        console.log('restared');
        socket.emit('nextRound');
    });


    // Socket check
    if(socket){
        console.log("Connected to server");
    } else {
        console.log("Not connected to server");
    }

});

// Adds selected to the first argument, removes it from the others
function selection(item1, item2, item3){
    item1.addClass('selected');
    item2.removeClass('selected');
    item3.removeClass('selected');
}

function handleNextRound(socket){
    socket.on('nextRound', function (names){
        console.log("Restarting a game with: " + names.name.vs);
        activeManche++;

        console.log(manches[activeManche-1]);
        console.log(activeManche);

        $('#findGame, #vsSelected').addClass('hidden');
        $('#actionRow').removeClass('hidden');
        $('#vsRow').removeClass('hidden');


        $('.nameOfOpponent').text(names.name.vs);
        $('.nameOfYou').text(names.name.you);
    });
}

function handleGameStart(socket){
    socket.on('foundGame', function (names){
        console.log("Server found a game with: " + names.name.vs);

        $('#findGame').addClass('hidden');
        $('#actionRow').removeClass('hidden');
        $('#vsRow').removeClass('hidden');

        // MAJ des noms
        $('.nameOfOpponent').text(names.name.vs);
        $('.nameOfYou').text(names.name.you);
    });
}

function handleWinLoss(socket){
    socket.on('result', function (data){
        var outputStatus = $('#winLoseResults'),
            status = data.status,
            manches = data.manches,
            activeManche = data.activeManche;

        // Cache l'annonce de sélection de l'adversaire
        $('#vsSelected').addClass('hidden');

        // Affiche le résultat 
        $('#statusRow').removeClass('hidden');
       
        if(status == 'win'){
            outputStatus.text('Bien joué Morray !');
        }

        if(status == 'lose') {
            outputStatus.text("Oh, c'est la djab un peu là...");
        }

        if(status == 'tie') {
            outputStatus.text("T'as eu chaud maine.");
        }

        console.log(manches);
        console.log(activeManche);

        // Affiche ou nom le résultat
        if (activeManche < manches.length) {
            $('#restartBtn').removeClass('hidden');
        }

    });
}

function handleOpponentSelected(socket){
    socket.on('opponentSelected', function (data){
        $('#vsSelected').removeClass('hidden');
    });
}

function handleFinish(socket){
    socket.on('finish', function (){
        console.log("Finished, cleaned up!");

        // Cleans up rows
        $('.to-reset-row').addClass('hidden');

        // Allows the option to be put back in the que
        $('#findGame').removeClass('hidden');

        // Cleans up selected items
        $('#paper').removeClass('selected');
        $('#rock').removeClass('selected');
        $('#scissors').removeClass('selected');

        $('#findGameButton').text("Click to find a game!");
    });
}

$('#createNewGame').on('click', function(event){
    var userName = $('#usernameInput').val(),
        gameID = $('#gameID_join').val();
        
    document.location.href = '/room/' + gameID;

    socket.emit('createNewGame', {username: givenUserName});

    //fonction de transfert de données
    App.gameId = data.gameId;
    App.mySocketId = data.mySocketId;

    App.players[0].gameId = data.gameId;
    App.players[0].mySocketId = data.mySocketId;

    App.numPlayersInRoom = 1;

    App.Host.displayNewGameScreen();
});

$('#joinGame').on('click', function(event){
    var gameID = $('#gameID_join').val();
    document.location.href = '/room/' + gameID;
});