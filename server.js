let express = require('express');
let app = express();

app.use("/", express.static(__dirname + "/app"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));

let httpserver = app.listen(5000, function () {
    console.log("Server running at: http://localhost:5000/");
});

let io = require('socket.io')(httpserver);

io.on('connection', function(client) {
    let sensor = {
        alpha: 0,
        beta: 0,
        gamma: 0,
        id: client.id
    };

    client.on('updatePosition', function(data){
        sensor.alpha = data.alpha;
        sensor.beta = data.beta;
        sensor.gamma = data.gamma;

        io.emit('updatePosition',sensor);
    });
});
