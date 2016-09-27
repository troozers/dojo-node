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

Config.prototype.db = function() {
    var dsn = 'mongodb://';

    // add authentication details if defined
    if (appConfig.dbuser !== '') {
        dsn = dsn + appConfig.dbuser + ':' + appConfig.dbpass + '@';
    }

    // add host and database details
    dsn = dsn + appConfig.dbhost + '/' + appConfig.dbname;

    return dsn;
};

module.exports = Config;
