const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('/dev/ttyACM0', {
    autoOpen: true,
    baudRate: 9600
});

const socket = require('socket.io-client')('http://localhost:5000');
socket.on('connect', function(){
    console.log("connected");
});
socket.on('updatePosition', function(data){
    console.log(data);
});
socket.on('disconnect', function(){
    console.log('disconnect');
});

const parser = port.pipe(new Readline({ delimiter: '\n' }));
parser.on('data', function(data) {
    let res = data.split("\t");
    let roll = res[1]*180/Math.PI;
    let pitch = res[3]*180/Math.PI;
    let yaw = res[5]*180/Math.PI;

    socket.emit("updatePosition", {
        alpha: pitch,
        beta: yaw,
        gamma: roll
    });
    //console.log("roll:", roll, " pitch:", pitch, " yaw:", yaw);
});
