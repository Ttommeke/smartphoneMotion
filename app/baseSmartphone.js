var socket = io();

var sensors = [];
var resetBaseAngles = false;

var baseAngles = {
    alpha: 0,
    beta: 0,
    gamma: 0
};

var handleOrientation = function(event) {
    var alpha    = event.alpha;
    var beta     = event.beta;
    var gamma    = event.gamma;

    if (resetBaseAngles) {
        baseAngles.alpha = alpha;
        baseAngles.beta = beta;
        baseAngles.gamma = gamma;
        resetBaseAngles = false;
    }

    //send over socket
    socket.emit("updatePosition", {
        alpha: alpha - baseAngles.alpha,
        beta: beta - baseAngles.beta,
        gamma: gamma - baseAngles.gamma
    });
}

var zeroOutDevice = function() {
    console.log("setToZero");
    resetBaseAngles = true;
};

var findSensorInList = function(sensorId, list) {
    for (var i = 0; i < list.length; i++) {
        if (sensorId === list[i].id) {
            return list[i];
        }
    }

    return undefined;
};

var updateSensorDiv = function(sensor) {
    sensor.myDiv.innerHTML = "id: " + sensor.id + ",<br />" +
        "alpha: " + sensor.alpha + ",<br />" +
        "beta: " + sensor.beta + ",<br />" +
        "gamma: " + sensor.gamma + "<br /><br />";
};

socket.on("updatePosition", function(data) {
    var sensorInList = findSensorInList(data.id, sensors);

    if (sensorInList == undefined) {
        data.myDiv = document.createElement("div");
        document.getElementById("bodyId").appendChild(data.myDiv);
        sensors.push(data);

        updateSensorDiv(data);
    } else {
        sensorInList.alpha = data.alpha;
        sensorInList.beta = data.beta;
        sensorInList.gamma = data.gamma;

        updateSensorDiv(sensorInList);
    }
});

window.addEventListener("deviceorientation", handleOrientation, true);
