// API CONFIGURATIONS
// this is common configurations for API system
import exphbs from 'express-handlebars';

export default {
    // api default headers
    DEFAULT_TYPE:       'text/html',
    DEFAULT_HEADERS:    {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    },

    // handlebars config
    extname: '.hbs',
    defaultLayout: 'main',
    viewsPath: __DIR_APP + 'views',

    SETUP_FUNCTION:     function (app, next) {
        if (this.viewsPath) app.set('views', this.viewsPath);
        let hbs = exphbs.create(this);
        app.engine(this.extname, hbs.engine);
        app.set('view engine', this.extname);
        app.enable('view cache');
        next();
    }
};
