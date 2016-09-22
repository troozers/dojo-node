var express, exphbs, hbs, apiVersion1, home, timetable, app, port, config;
express     = require('express');
exphbs      = require('express-handlebars');
apiVersion1 = require('./routes/api1.js');
home        = require('./controllers/home');
timetable   = require('./controllers/timetable');
config      = require('./configure-me');

// Open up the configuration system
cfg = new config('config.json');

//port = process.env.PORT || 8080;

app = express();

hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        json: function(context) {
            return JSON.stringify(context);
        },

        geopos: function(context) {
            return context.loc.coordinates[1] + ',' + context.loc.coordinates[0];
        }
    }
});
//app.engine('.hbs', exphbs({extname: '.hbs', defaultLayout: 'main'} ));
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

app.use(cfg.path() + '/public', express.static(__dirname + '/public'));

// Render the homepage
app.get(cfg.path(), home.index);
app.get(cfg.path() + '/:day', home.index);

// Render the sales page
app.get(cfg.path + '/my/timetable', timetable.index);

// Routing for API
app.use('/api/v1', apiVersion1);

app.listen(cfg.port(), function() {
    console.log('Server listening on port: ' + cfg.port());
});