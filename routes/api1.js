var express, mongoose, bodyParser, location, api, tools, dayOfWeek, config, cfg;
express    = require('express');
mongoose   = require('mongoose');
bodyParser = require('body-parser');
location   = require('../models/location');
tools      = require('../tools.js');
config     = require('../configure-me');

// Open configuration object
cfg = new config('./config.json');

// Define the day of the weeks and the sort order we want to view them in
dayOfWeek = { 'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3, 'Friday': 4, 'Saturday': 5, 'Sunday': 6 };

api = express.Router();

// Connect to the database
mongoose.connect(cfg.db());

// Utilise bodyparser to access the URL parameters
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());

// middleware to use for all requests
api.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});


api.route('/locations')
// Get a list of all locations
    .get(function(req, res) {
        location.find({}, { name:1, address:1 }, {}, function(err, locations) {
            if (err) { res.send(err); }

            res.json(locations);
        });
    });


api.route('/classes')
// Get a list of all classes, sorted by day
    .get(function(req, res) {
        location.aggregate(
            { $project: { "name": 1, "region": 1, "address": 1, "classes": 1 } },
            { $unwind: "$classes" },
            { $sort: { "classes.day":1, "classes.start": 1, "name": 1} },
            function(err, classes) {
                if (err) { res.send(err); }

                classes.sort(function(a, b) {
                    return dayOfWeek[a.classes['day']] - dayOfWeek[b.classes['day']];
                });

                res.json(classes);
            }
        );
    });


api.route('/classes/closest/:lon/:lat')
// Get a list of all classes sorted by proximity to a location (as the crow flies)

    .get(function(req, res) {
        if ( tools.validCoords(req.params.lon, req.params.lat ) ) {
            var lon, lat;
            lon = parseFloat(req.params.lon);
            lat = parseFloat(req.params.lat);

            location.aggregate(
                {
                    $geoNear: {
                        near: {type: "Point", coordinates: [lon, lat]},
                        distanceField: "distance",
                        distanceMultiplier: 0.000621371,
                        spherical: true
                    }
                },
                {$project: {name: 1, address: 1, classes: 1, distance: 1}},
                function (err, classes) {
                    if (err) {
                        res.send(err);
                    }

                    res.json(classes);
                }
            );
        } else {
            res.status(400).send({ message: 'Error: bad longitude or latitude specified.' });
        }
    });


api.route('/classes/distances/:lon/:lat')
// Get the distance to todays classes from your current location
    .get(function(req, res) {
        if ( tools.validCoords(req.params.lon, req.params.lat ) ) {
            var lon, lat;
            lon = parseFloat(req.params.lon);
            lat = parseFloat(req.params.lat);
        } else {
            res.status(400).send({ message: 'Error: bad longitude or latitude specified.' });
        }
    });


api.route('/classes/:id')
// Get the details for a specific class
    .get(function(req, res) {
        location.find({ _id: req.params.id }, { results: 0 }, {}, function(err, aclass) {
            if (err) { res.send(err); }

            res.json(aclass);
        });
    });


api.route('/classes/day/:day')
// Get a list of classes ran on a particular day
    .get(function(req, res) {
        location.aggregate(
            { $project: { "name": 1, "address": 1, "classes": 1 } },
            { $match: { "classes.day": tools.capitalise(req.params.day) } },
            { $unwind: "$classes" },
            { $match: {"classes.day": tools.capitalise(req.params.day) } },
            { $sort: {"classes.start": 1, name: 1} },
            function(err, classes) {
                if (err) { res.send(err); }

                res.json(classes);
            }
        );
    });


module.exports = api;
