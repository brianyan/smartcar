var express = require('express');
var app = express();
var request = require('request');
var door = require('./structs.js')
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
		});

	//console.log(req.params.id)
});
var door = function(location,locked){  
    this.location = data;
    this.locked = locked;
}

app.get('/vehicles/:id/doors', function(req,res){
request.post(
		'http://gmapi.azurewebsites.net/getSecurityStatusService',
		{ json: { id: req.params.id, responseType: "JSON", } },
		function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var doors = body.data.doors.values
				var jsonResult = {
					doorsArray: []
				};
				for(i=0; i< doors.length; i++){
					var jsonData = {}
					jsonData["location"] = doors[i].location.value;
					jsonData["locked"] = doors[i].locked.value;
					jsonResult.doorsArray.push(jsonData);
				}
				//var response 
				res.json(jsonResult.doorsArray)
			}
		});
});

app.get('/vehicles/:id/fuel', function(req,res){
request.post(
	'http://gmapi.azurewebsites.net/getEnergyService',
	{ json: { id: req.params.id, responseType: "JSON", } },
	function (error, response, body){
		if (!error && response.statusCode == 200) {
				var fuel= body.data.tankLevel.value;
				res.json({percent: fuel})
			}
	});
});



app.get('/vehicles/:id/battery', function(req,res){
request.post(
	'http://gmapi.azurewebsites.net/getEnergyService',
	{ json: { id: req.params.id, responseType: "JSON", } },
	function (error, response, body){
		if (!error && response.statusCode == 200) {
				var battery= body.data.batteryLevel.value;
				res.json({percent: battery})
			}
	});
});

app.post('/vehicles/:id/engine', function(req,res){
	var action = req.params.action;
	var actionResult = "";
	if(action == "START"){
		actionResult = "START_VEHICLE";
	} else if(action == "STOP"){
		actionResult = "STOP_VEHICLE";
	}
	request.post(
		'http://gmapi.azurewebsites.net/actionEngineService',
		{ json: { id: req.params.id, command: actionResult,responseType: "JSON", } },
		function (error, response, body){
			if (!error && response.statusCode == 200) {
				var jsonResult = body.actionResult.status;
				var statusResult = "";
				if(jsonResult == "EXECUTED"){
					statusResult = "success";
				} else if(jsonResult == "FAILED"){
					statusResult = "error";
				}
				res.json({status: statusResult})
			}
	});
});

var server = app.listen(process.env.PORT || 8080, function () {
	var port = server.address().port;
	console.log("App now running on port", port);
});