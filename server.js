var express = require('express');
var app = express();
var request = require('request');

app.get('/vehicles/:id', function (req, res) {
	// options contains parameters in post request to server
	request.post(
		'http://gmapi.azurewebsites.net/getVehicleInfoService',
		{ json: { id: req.params.id, responseType: "JSON", } },
		function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var vim = body.data.vin.value;
				var color = body.data.color.value;
				var numDoors = body.data.fourDoorSedan.value ? 4 :2;
				var driveTrain = body.data.driveTrain.value
				res.json({vin: vim, color: color, doorCount: numDoors, driveTrain: driveTrain})
			}
		}
		);

	//console.log(req.params.id)
});

var server = app.listen(process.env.PORT || 8080, function () {
	var port = server.address().port;
	console.log("App now running on port", port);
});