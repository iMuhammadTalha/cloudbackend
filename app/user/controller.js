const moment = require('moment');
const services = require('../user/services');
const config = require('../../config/index.js');
const logger = config.logger.createLogger('user/controller');

exports.getAllUsers = function (req, res, next) {
    services.getAllUsers(function (err, rows) {
        if (err) {
            logger.error('err :', err);
            return res.status(400).send({msg: 'Error in get all users'});
        }

        res.status(200).send(rows);
    });
};

