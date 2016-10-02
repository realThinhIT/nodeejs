var globalConfig = require('../../config/global');

var index = {};

index.homepage = function (req, res) {
    index.homepage2(req, res);
};

index.homepage2 = function (req, res) {
    res.json({
        'status': 1,
        'message': globalConfig.APP_NAME + ' running on port ' + globalConfig.SERVER_PORT,
    });
};

module.exports = index;
