var request, location, tools;
request   = require('request');
location  = require('../models/location');
tools     = require('../tools');


module.exports = {
    index: function(req, res) {
        var data = [];

        request({
            method: 'GET',
            uri: 'http://localhost:8080/api/v1/classes'
        }, function(error, response, body) {
            if (error) { throw error; }

            data = JSON.parse(body);
            res.render('timetable', {data: data});
        });
    }
};

