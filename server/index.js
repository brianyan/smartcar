'use strict';

var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
// SmartCar get request for general info
app.get('/vehicles/:id', function (req, res) {
	// send Post request to GM API
	request.post(
		'http://gmapi.azurewebsites.net/getVehicleInfoService',
		{ json: { id: req.params.id, responseType: "JSON" } },
		function (error, response, body) {
			// if valid request
			if (body.status == 404) {
				res.status(404).send();
			} else {
				var vim = body.data.vin.value;
				var color = body.data.color.value;
				var numDoors = body.data.fourDoorSedan.value ? 4 :2;
				var driveTrain = body.data.driveTrain.value;
				res.json({vin: vim, color: color, doorCount: numDoors, driveTrain: driveTrain});
			}
		});
});

// SmartCar get request for doors
app.get('/vehicles/:id/doors', function(req,res){
	// send Post request to GM API
	request.post(
		'http://gmapi.azurewebsites.net/getSecurityStatusService',
		{ json: { id: req.params.id, responseType: "JSON" } },
		function (error, response, body) {
			if(body.status == 200) {
				var doors = body.data.doors.values;
				var jsonResult = {
					doorsArray: []
				};
				for(var i=0; i< doors.length; i++){
					var jsonData = {};
					jsonData["location"] = doors[i].location.value;
					jsonData["locked"] = doors[i].locked.value;
					jsonResult.doorsArray.push(jsonData);
				}
				res.json(jsonResult.doorsArray)
			} else {
				res.status(404).send();
			}
		});
});
// SmartCar get request for fuel
app.get('/vehicles/:id/fuel', function(req,res){
	// send Post request to GM API
	request.post(
		'http://gmapi.azurewebsites.net/getEnergyService',
		{ json: { id: req.params.id, responseType: "JSON", } },
		function (error, response, body){
			if (body.status == 200) {
				var fuel= body.data.tankLevel.value;
				res.json({percent: fuel})
			} else {
				res.json({error: "Invalid request"})
			}
		});
});


// SmartCar get request for battery
app.get('/vehicles/:id/battery', function(req,res){
	// send Post request to GM API
	request.post(
		'http://gmapi.azurewebsites.net/getEnergyService',
		{ json: { id: req.params.id, responseType: "JSON", } },
		function (error, response, body){
			if (body.status == 200) {
				var battery= body.data.batteryLevel.value;
				res.json({percent: battery})
			} else {
				res.json({error: "Invalid request"})
			}
		});
});
// SmartCar post request to start/stop engine
app.post('/vehicles/:id/engine', function(req,res){
	// re-construct query parameters to fit GM API's params
	var action = req.body.command;
	var actionResult = "";
	if(action == "START"){
		actionResult = "START_VEHICLE";
	} else if(action == "STOP"){
		actionResult = "STOP_VEHICLE";
	} else {
		res.status(404).send();
		return;
	}
	// send Post request to GM API
	request.post(
		'http://gmapi.azurewebsites.net/actionEngineService',
		{ json: { id: req.params.id, command: actionResult, responseType: "JSON", } },
		function (error, response, body){
			if (body.status == 200) {
				var jsonResult = body.actionResult.status;
				var statusResult = "";
				if(jsonResult == "EXECUTED"){
					statusResult = "success";
				} else if(jsonResult == "FAILED"){
					statusResult = "error";
				}
				res.json({status: statusResult})
			} else {
				res.json({error: body.reason})
			}
	});
});

module.exports = app;