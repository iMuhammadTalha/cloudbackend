const {getAllReadings, getAllReadingsWithPagination, createReading, getARecentReading, getGraph} = require('./controller');
// const {validateField} = require('../Readings/validations');
// const {isTokenExpired,paginationValidation} = require('../../lib/validation');

const router = require('express').Router();
                                
router.get('/get-all-readings', getAllReadings, function (req, res) {
    res.send(res.locals.allReadings);
});
                                                                        
router.get('/get-all-readings/:page/:pageSize/:sortingName/:sortingOrder',  getAllReadingsWithPagination, function (req, res) {
    res.send(res.locals.allReadings);
});



router.post('/create-reading', createReading, function (req, res) {
    res.send(res.locals.Msg);
});

router.get('/get-a-recent-reading', getARecentReading, function (req, res) {
    res.send(res.locals.aReading);
});

router.get('/get-graph', getGraph, function (req, res) {
    res.send(res.locals.AQIGraphData);
});

module.exports = router;