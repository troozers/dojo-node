var express, apiVersion1, app;
express     = require('express');
apiVersion1 = require('./api1.js');

app = express();

app.use('/api/v1', apiVersion1);
app.listen(3000, function() {
    console.log('App started on port 3000');
});