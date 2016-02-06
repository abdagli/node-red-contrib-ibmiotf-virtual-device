module.exports = function (RED) {
	function VirtualDevice(config) {
		var Client = require("ibmiotf");

		RED.nodes.createNode(this, config);
		var node = this;

		try {
			node.on('input', function (msg) {
				var deviceConfig = {
					"org" : msg.device.org,
					"id" : msg.device.deviceId,
					"type" : msg.device.deviceType,
					"auth-method" : msg.device.token,
					"auth-token" : msg.device.authToken
				};

				console.log(deviceConfig);
				console.log(msg);

				var deviceClient = new Client.IotfDevice(deviceConfig);
				deviceClient.connect();

				node.status({fill: "green", shape: "dot", text: "Device connecting..."});

				deviceClient.on('connect', function () {
					node.status({fill: "green", shape: "dot", text: "Device connected..."});

					deviceClient.publish(msg.eventType,"json",msg.payload);

					node.status({});
					client.disconnect();
				});
			});
		} catch (err) {
			node.status({fill: "red", shape: "dot", text: err.message});
			node.error(err.message);
		}
	}

	RED.nodes.registerType("virtual-device", VirtualDevice);
};