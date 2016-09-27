/**
 * ./models/locations.js
 *
 * @author       - andy stewart (andy@troozers.com)
 * @description  - mongodb data schema for the 'locations' collection within the database
 *
 */
var mongoose, Schema, locationSchema;
mongoose = require('mongoose');
Schema   = mongoose.Schema;


locationSchema = new Schema({
    name: { type: String },
    address: {
        building:   String,
        street:     String,
        town:       String,
        postcode:   String,
        loc:  {
            "type":      { type: String, required: true, default: "Point" },
            coordinates: []
        }
    },
    classes: [{
        id:         Number,
        day:        String,
        start:      String,
        finish:     String,
        note:       String
    }],
    results: [{
        id:         Number,
        date:       Date,
        students:   Number,
        stock:      Number
    }]
});
locationSchema.index({ "address.loc": "2dsphere" });

module.exports = mongoose.model('location', locationSchema);
