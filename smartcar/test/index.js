'use strict';

var test = require('tape');
var request = require('supertest');
var app = require('../server');

test('Correct vehicle information returned', function (t) {
  request(app)
    .get('/vehicles/1234')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
      t.error(err, 'No error');
      t.same(res.body.color, "Metallic Silver", 'Color as expected');
      t.end();
    });
});

test('Incorrect vehicle paramater', function (t) {
  request(app)
    .get('/vehicles/badinput')
    .expect(404)
    .end(function (err, res) {
      t.error(err, 'error');
      //t.same(res.body, expectedUsers, 'Users as expected');
      t.end();
    });
});

test('Correct vehicle door information returned', function (t) {
  request(app)
    .get('/vehicles/1234/doors')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
      t.error(err, 'No error');
      t.end();
    });
});

test('Incorrect vehicle id entered', function (t) {
  request(app)
    .get('/vehicles/12/doors')
    .expect(404)
    .end(function (err, res) {
      t.error(err, 'error');
      t.end();
    });
});

test('Correct vehicle fuel returned', function (t) {
  request(app)
    .get('/vehicles/1234/fuel')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
      t.error(err, 'No error');
      t.end();
    });
});

test('Correct vehicle battery returned', function (t) {
  request(app)
    .get('/vehicles/1234/battery')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
      t.error(err, 'No error');
      t.end();
    });
});

test('Correct engine input', function (t) {
  request(app)
    .post('/vehicles/1234/engine')
    .send({
      'command':'STOP'
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
      t.same(res.status, 200, '200 response code expected')
      t.end();
    });
});
test('Correct engine input', function (t) {
  request(app)
    .post('/vehicles/1234/engine')
    .send({
      'command':'START'
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
      t.same(res.status, 200, '200 response code expected')
      t.end();
    });
});

test('Incorrect engine input', function (t) {
  request(app)
    .post('/vehicles/1234/engine')
    .send({
      'command':'STRT'
    })
    .expect(404)
    .end(function (err, res) {
      t.error(err, 'No error');
      t.same(res.status, 404, '404 response code expected')
      t.end();
    });
});