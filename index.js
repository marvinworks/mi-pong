
var port = process.env.PORT || 48566,
    express = require('express'),
    app     = express(),
    http    = require('http').Server(app);
    io      = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));


var games = {};

io.on('connection', function(socket){
    socket.on('connectTo', function(gameID, name) {
        if(name === 'host') {
            // Creating new game instance
            if(!games[gameID]) {
                games[gameID] = {'socket': socket, 'playerSockets': []};
            }

            // Remove game when closed / disconnected
            socket.on('disconnect', function() {
                if(games[gameID])
                    delete games[gameID];
            })
        }
        else {
            // Sending new paddle-position
            socket.on('message', function(data) {
                if(games[gameID]) {
                    games[gameID].socket.send(data);
                }
                else {
                    console.log('GameID not found: ' + gameID);
                }
            });

            if(games[gameID]) {
                // Login
                games[gameID].socket.emit('member', name);
            }
        }
    });
});



http.listen(port, function() {
    console.log('Listening on *:' + port);
})
