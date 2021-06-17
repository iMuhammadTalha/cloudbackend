exports.validateField = function (req, res, next) {

    if ( req.body.humidity && req.body.no2 && req.body.co2 && req.body.temperature) {
        next();
    } else {
        next();
        // res.status(400).send('Required fields missed...');
    }

};