module.exports = function (RED) {
	function VirtualDevice(config) {
		var Client = require("ibmiotf");

		RED.nodes.createNode(this, n);
		var node = this;

		try {
			node.on('input', function (msg) {
				var deviceConfig = {
					"org" : msg.organization,
					"id" : msg.deviceId,
					"type" : msg.deviceType,
					"auth-method" : msg.token,
					"auth-token" : msg.authToken
				};

				var deviceClient = new Client.IotfDevice(deviceConfig);
				deviceClient.connect();

				node.status({fill: "green", shape: "dot", text: "Device connecting..."});

				deviceClient.on('connect', function () {
					node.status({fill: "green", shape: "dot", text: "Device connected..."});

					deviceClient.publish("status","json",msg.payload);

					node.status({});
					node.send({payload: result});
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