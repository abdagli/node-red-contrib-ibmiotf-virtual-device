module.exports = function (RED) {
	function VirtualDevice(config) {
		var Client = require("ibmiotf");

		RED.nodes.createNode(this, config);
		var node = this;

		try {
			node.on('input', function (msg) {
				var deviceConfig = {
					"org" : msg.payload.device.organization,
					"id" : msg.payload.device.deviceId,
					"type" : msg.payload.device.deviceType,
					"auth-method" : msg.payload.device.token,
					"auth-token" : msg.payload.device.authToken
				};

				var deviceClient = new Client.IotfDevice(deviceConfig);
				deviceClient.connect();

				node.status({fill: "green", shape: "dot", text: "Device connecting..."});

				deviceClient.on('connect', function () {
					node.status({fill: "green", shape: "dot", text: "Device connected..."});

					deviceClient.publish("status","json",msg.payload.data);

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