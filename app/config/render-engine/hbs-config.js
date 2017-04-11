// API CONFIGURATIONS
// this is common configurations for API system
import exphbs       from 'express-handlebars';

export default {
    // api default headers
    DEFAULT_TYPE:       'text/html',
    DEFAULT_HEADERS:    {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    },
    SETUP_FUNCTION:     function (app, next) {
        let hbsConfig = require(__DIR_APP + 'config/handlebars').default;
        if (hbsConfig.viewsPath) app.set('views', hbsConfig.viewsPath);
        let hbs = exphbs.create(hbsConfig);
        app.engine('.hbs', hbs.engine);
        app.set('view engine', '.hbs');
        app.enable('view cache');
        next();
    }
};
