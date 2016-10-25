var request, location, moment, tools, config;
request   = require('request');
moment    = require('moment-timezone');
location  = require('../models/location');
tools     = require('../tools');
config    = require('../configure-me');

// Open up the configuration system
cfg = new config('config.json');

module.exports = {
    index: function(req, res) {
        var data = {};
        var myURL = [];
        var myPath;
        var day, epoch;

        if (tools.validDay(req.params.day)) {
            day = tools.capitalise(req.params.day);
        } else {
            epoch = (new Date).getTime();
            day = moment(epoch).tz('Europe/London').format('dddd');
        }

        request({
            method: 'GET',
            uri: 'http://localhost:8080/api/v1/classes'
        }, function(error, response, body) {
            if (error) { throw error; }

            data = JSON.parse(body);
            res.render('home', {data: data, day: day, cfg: cfg.all() });
        });
    }
};
