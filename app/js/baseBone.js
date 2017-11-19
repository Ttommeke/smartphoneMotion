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


//human
var geometry = new THREE.BoxGeometry( 0.5, 1.2, 0.8 );
var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
var body = new THREE.Mesh( geometry, material );
body.position.z = -0.4;
body.position.y = -0.4;
scene.add( body );

var geometry2 = new THREE.BoxGeometry( 0.4, 0.6, 0.4 );
var material2 = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
var head = new THREE.Mesh( geometry2, material2 );
head.position.z = -0.4;
head.position.y = 0.5;
scene.add( head );

var geometry3 = new THREE.BoxGeometry( 0.4, 1.2, 0.7 );
var material3 = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
var legs = new THREE.Mesh( geometry3, material3 );
legs.position.z = -0.4;
legs.position.y = -1.6;
scene.add( legs );
//end human

var createCube = function() {
    var geometry = new THREE.BoxGeometry( 0.1, 0.1, 1 );
    var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    cube.rotation.order = "YXZ";

    return cube
};

var getPossitionOfBone = function(beginPos, distance, angle) {
    var spherical = new THREE.Spherical(distance, Math.PI/2 + angle.beta*Math.PI/180, angle.alpha*Math.PI/180);
    var extra = new THREE.Vector3(0,0,distance);
    extra.setFromSpherical(spherical);

    extra.x += beginPos.x;
    extra.y += beginPos.y;
    extra.z += beginPos.z;

    return extra;
};

camera.position.z = 2;
camera.position.y = 3;
camera.position.x = 2;

camera.rotation.order = "YXZ";
camera.rotation.y = Math.PI/4;
camera.rotation.x = -Math.PI/4;

var animate = function () {
	requestAnimationFrame( animate );

    var boneConnection = {
        x: 0,
        y: 0,
        z: 0
    };

    for (var i = 0; i < sensors.length; i++) {
        var sensor = sensors[i];

        var bonePosition = getPossitionOfBone(boneConnection, 0.5, sensor);

        sensor.cube.position.x = bonePosition.x;
        sensor.cube.position.y = bonePosition.y;
        sensor.cube.position.z = bonePosition.z;

        sensor.cube.rotation.y = sensor.alpha*Math.PI/180;
        sensor.cube.rotation.x = sensor.beta*Math.PI/180;
        sensor.cube.rotation.z = -sensor.gamma*Math.PI/180;

        boneConnection = getPossitionOfBone(boneConnection, 1, sensor);
    }

	renderer.render(scene, camera);
};

animate();
