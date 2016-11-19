'use strict';

const express = require('express'),
      kraken  = require('kraken-js'),
      path    = require('path'),
      app     = express(),
      PORT    = process.env.PORT || 8000,
      TIMEOUT = 30000,
      APP_DIR = path.join(__dirname, '../public/');
app.use('/static', express.static(APP_DIR + '/templates'));
app.use('/static', express.static(APP_DIR + '/.deploy'));
app.get('/app', function (req, res, next) {
    res.render(APP_DIR + 'templates/index.ejs');
});
app.use('/', kraken({}));

app.listen(PORT, () => console.log('[LIFECYCLE]: listening on port %d', PORT));

process.on('SIGTERM', function () {
    console.log('[LIFECYCLE]: got SIGTERM, waiting for connections to close');
    server.close(process.exit);

    setTimeout(() => {
        console.log('[LIFECYCLE]: timed out waiting for connections to close');
        process.exit();
    }, TIMEOUT);
});
