const moment = require('moment');
const services = require('./services');
const config = require('../../config');
const logger = config.logger.createLogger('Readings/controller');

exports.getAllReadings = function (req, res, next) {
    services.getAllReading(function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all Reading'});
        }

        res.locals.allReadings = rows;
        next();
    });
};

exports.getAllReadingsWithPagination = function (req, res, next) {
    services.getAllReadingWithPagination(req.params.page, req.params.pageSize, req.params.sortingName, req.params.sortingOrder, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all Reading'});
        }
        res.locals.allReadings = rows;
        next();
    });
};


exports.createReading = function (req, res, next) {

    const Reading = {
        humidity: req.body.humidity, 
        no2: req.body.no2, 
        co2: req.body.co2,
        temperature: req.body.temperature,
        created_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    };

    services.createReading(Reading, function (err, Reading) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in create Reading'});
        }
        if (Reading === 1) {
            res.status(200).send({msg: 'Reading Created'});
        } else {
            res.status(200).send({msg: 'Reading not Created'});
        }
        next();
    });

};


exports.getGraph = function (req, res, next) {
    res.locals.GraphData = {
        no2Avg: [0],
        co2Avg: [0],
        humitidyAvg: [0],
        temperatureAvg: [0],
        dates: []
    };
    
    let no2Avg = [];
    let co2Avg = [];
    let humitidyAvg = [];
    let temperatureAvg = [];
    let dates = [];


    services.get10lastdates(req.params.id, async function (err, last10dates) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all Reading'});
        }

        for(let i=last10dates.length-1; i>=0; i--){
            let dayAvg=await services.getAvgValuesdatesAsync(req.params.id, i);//, function (err, dayAvg) {

                no2Avg[i]=dayAvg.no2;
                co2Avg[i]=dayAvg.co2;
                humitidyAvg[i]=dayAvg.humidity;
                temperatureAvg[i]=dayAvg.temperature;
                dates[i]= moment(new Date()).subtract(i, "days").format('YYYY-MM-DD');  
        }
        

                res.locals.GraphData.no2Avg = no2Avg;
                res.locals.GraphData.co2Avg = co2Avg;
                res.locals.GraphData.humitidyAvg = humitidyAvg;
                res.locals.GraphData.temperatureAvg = temperatureAvg;
                res.locals.GraphData.dates = dates;
        
                res.locals.GraphData.AQIAvg = AQIAvg;
        
                next();
    });

};