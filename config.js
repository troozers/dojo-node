/**
 * Class to configure this application
 */

// Constructor
function Config() {
    this.path = '/timetable';
}

Config.prototype.getPath = function() {
    return this.path;
};

module.exports = config;