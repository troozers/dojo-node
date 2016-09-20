var request, location, moment, tools;
request   = require('request');
moment    = require('moment-timezone');
location  = require('../models/location');
tools     = require('../tools');


module.exports = {
    index: function(req, res) {
        var data = [];
        var day, epoch;

        if (tools.validDay(req.params.day)) {
            day = tools.capitalise(req.params.day);
        } else {
            epoch = (new Date).getTime();
            day = moment(epoch).tz('Europe/London').format('dddd');
        }

        request({
            method: 'GET',
            uri: 'http://localhost:8080/api/v1/classes/day/'+day
        }, function(error, response, body) {
            if (error) { throw error; }

            data = JSON.parse(body);
            res.render('home', {data: data, day: day});
        });
    }
};
