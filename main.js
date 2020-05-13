// Create a client instance
client = new Paho.MQTT.Client("192.168.1.5", 9001, "clientId");

// set callback handlers 
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client 
client.connect({onSuccess:onConnect});



var measurements = [];
var connectedMessage = document.getElementById('status');
connectedMessage.innerHTML = 'I am here';
if ( 'Accelerometer' in window ) {
	var i = 0;
	console.log("qui");
	connectedMessage.innerHTML = 'I am here - part 2';
	while(i<30) {
		// every 10 seconds does what's inside the function
		setTimeout(function() {
			measurements.push(telemetry());
			console.log(measurements);
			i++;
		}, 10000);
	}
}
else connectedMessage.innerHTML = 'Accelerometer not supported';

// creates a new telemetry
function telemetry() {
	let status = document.getElementById('status');
	var newMeasurement = {};
	let sensor = new Accelerometer();
	sensor.addEventListener('reading', function(e) {
		status.innerHTML = 'x: ' + e.target.x + '<br> y: ' + e.target.y + '<br> z: ' + e.target.z;
		newMeasurement.x = e.target.x;
		newMeasurement.y = e.target.y;
		newMeasurement.z = e.target.z;
	});
	sensor.start();
	return newMeasurement;
}

// called when the client connects 
function onConnect() {
	// Once a connection has been made, make a subscription and send a message.
	console.log("onConnect");
	client.subscribe("World");
	message = new Paho.MQTT.Message("All is up!");
	message.destinationName = "World";
	client.send(message); 
}
// called when the client loses its connection 
function onConnectionLost(responseObject) {
	if (responseObject.errorCode !== 0) { 
		console.log("onConnectionLost:"+responseObject.errorMessage);
	} 
}

// called when a message arrives 
function onMessageArrived(message) {
	console.log("onMessageArrived:"+message.payloadString); 
}