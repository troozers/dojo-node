/**
 * ./models/user.js
 *
 * @author       - andy stewart (andy@troozers.com)
 * @description  - mongodb data schema for the 'user' collection
 *
 */
var mongoose, Schema, locationSchema;
mongoose = require('mongoose');
Schema   = mongoose.Schema;


userSchema = new Schema({
    name:     { type: String, required: true },
    email:    { type: String, required: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('user', userSchema);

