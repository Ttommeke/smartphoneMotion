var socket = io();

var sensors = [];

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
        data.cube = createCube();
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


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
scene.add( directionalLight );
var light = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.2 );
scene.add( light );

var createCube = function() {
    var geometry = new THREE.BoxGeometry( 0.5, 0.1, 1 );
    var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    cube.rotation.order = "YXZ";

    return cube
};

camera.position.z = 5;
camera.position.y = 0.5;

var animate = function () {
	requestAnimationFrame( animate );

    for (var i = 0; i < sensors.length; i++) {
        var sensor = sensors[i];

        sensor.cube.position.x = (i - sensors.length/2 + 0.5)*1.5;

        sensor.cube.rotation.y = sensor.alpha*Math.PI/180;
        sensor.cube.rotation.x = sensor.beta*Math.PI/180;
        sensor.cube.rotation.z = -sensor.gamma*Math.PI/180;
    }

	renderer.render(scene, camera);
};

animate();
