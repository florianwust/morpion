var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use('/', express.static('public'));

var games = [];
var pendingGames = [];
var activeGames = [];

var getActiveGameById = function(id){
	var activeGame = activeGames.filter(function(game){
		return game.id === id
	});
	if(activeGame.length == 0){
		return {notReady: true}
	}else{
		return activeGame[0];
	}
}
// Créer un déplacement
app.post('/games/:id/moves', function(req, res) {
	var game = getActiveGameById(parseInt(req.params.id));
	game.table[req.body.i-1][req.body.j-1] = req.body.turn;
	game.turn = (game.turn === 'x' ? 'o' : 'x');
	res.send(game);
});

app.post('/games/:id/output', function(req, res){
	var game = getActiveGameById(parseInt(req.params.id));
	game.output = req.body.output;
	res.send(game);
});

// Nouvelle partie
app.post('/games', function(req, res) {
	if(pendingGames.length > 0){
		pendingGames[0].playersOnline.push("o");
		var game = pendingGames.shift();
		game.player = 'o';
		game.gameStart = true;
		activeGames.push(game);
		res.send(game);
		delete game.player;
	} 
	else{
		game = {
			id: parseInt(Math.random(1)*1000000),
		    table: [
		        ['', '', ''],
		        ['', '', ''],
		        ['', '', '']
		    ],
		    output: '',
		   	gameStart: false,
		    playersOnline: ['x'],
		    player: 'x',
		    turn: 'x',
		    win: false
		};
		pendingGames.push(game);
		res.send(game);
	}
});

// Récuperer l'état de la partie
app.get('/games/:id', function(req, res) {
    res.send(getActiveGameById(parseInt(req.params.id)));
})

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});