var express, api;
express = require('express');

api     = express.Router();

/**
 * Just a test
 */
api.get('/', function(req, res) {
    res.send('API v1 up and running');
});

module.exports = api;
