// Private variables
var fs = require('fs');
var appConfig = {};

function Config(file) {
    appConfig = JSON.parse( fs.readFileSync(file) );
}


Config.prototype.url = function() {
    return appConfig.url;
};


Config.prototype.fullURL = function() {
    return appConfig.url + appConfig.path;
};


Config.prototype.path = function() {
    return appConfig.path;
};


Config.prototype.port = function() {
    return appConfig.node_port;
};

Config.prototype.all = function() {
    return appConfig;
};

module.exports = Config;
