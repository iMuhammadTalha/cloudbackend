const pool = require('../../config/db/db');
const config = require('../../config');
const logger = config.logger.createLogger('Reading/services');

exports.getAllReading = function (result) {
    const sqlQuery = 'SELECT * FROM "Reading" ORDER BY created_time DESC';
    try {
        pool.query(sqlQuery, [], (err, res) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            } else {
                result(null, res.rows);
            }
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.getALatestReading = function (result) {
    const sqlQuery = `SELECT * FROM "Reading" ORDER BY created_time DESC LIMIT 1`;
    try {
        pool.query(sqlQuery, [], (err, res) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            } else {
                result(null, res.rows);
            }
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.getAllReadingWithPagination = function (page, pageSize, sortingName, sortingOrder, result) {
    let sortingQuery = ' ORDER BY created_time DESC ';
    if (sortingOrder === 'Undefined' || sortingName === 'Undefined' || sortingOrder === 'undefined' || sortingName === 'undefined') {
        sortingQuery = ' ORDER BY created_time DESC ';
    } else {
        sortingQuery = 'ORDER BY ' + sortingName + ' ' + sortingOrder;
    }
    const sqlQuery = `SELECT id, humidity, no2, co2, temperature, to_char(created_time , 'YYYY-MM-DD HH24:MI') AS created_time FROM "Reading" ${sortingQuery} LIMIT ${pageSize} OFFSET ${page * pageSize} `;
    const sqlCountQuery = `SELECT COUNT(*) as count FROM "Reading" `;

    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }
            client.query(sqlQuery, (err, res) => {
                if (err) {
                    logger.error('Error: ', err.stack);
                    result(err, null);
                } else {
                    client.query(sqlCountQuery, (err, countResponse) => {
                        release();
                        if (err) {
                            logger.error('Error: ', err.stack);
                            result(err, null);
                        } else {
                            let pages = Math.floor(countResponse.rows[0].count / pageSize);
                            if (countResponse.rows[0].count % pageSize > 0) {
                                pages += 1;
                            }
                            const dataToSend = {
                                totalPages: pages,
                                totalCount: countResponse.rows[0].count,
                                records: res.rows
                            };
                            result(null, dataToSend);
                        }
                    });
                }
            });
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.getAllReadingsWithPagination = function (page, pageSize, sortingName, sortingOrder, result) {
    let sortingQuery = ' ORDER BY created_time DESC ';
    if (sortingOrder === 'Undefined' || sortingName === 'Undefined' || sortingOrder === 'undefined' || sortingName === 'undefined') {
        sortingQuery = ' ORDER BY created_time DESC ';
    } else {
        sortingQuery = 'ORDER BY ' + sortingName + ' ' + sortingOrder;
    }
    const sqlQuery = `SELECT id, humidity, no2, co2, temperature, to_char(created_time , 'YYYY-MM-DD HH24:MI') AS created_time FROM "Reading" ${sortingQuery} LIMIT ${pageSize} OFFSET ${page * pageSize} `;
    const sqlCountQuery = `SELECT COUNT(*) as count FROM "Reading" `;

    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }
            client.query(sqlQuery, (err, res) => {
                if (err) {
                    logger.error('Error: ', err.stack);
                    result(err, null);
                } else {
                    client.query(sqlCountQuery, (err, countResponse) => {
                        release();
                        if (err) {
                            logger.error('Error: ', err.stack);
                            result(err, null);
                        } else {
                            let pages = Math.floor(countResponse.rows[0].count / pageSize);
                            if (countResponse.rows[0].count % pageSize > 0) {
                                pages += 1;
                            }
                            const dataToSend = {
                                totalPages: pages,
                                totalCount: countResponse.rows[0].count,
                                records: res.rows
                            };
                            result(null, dataToSend);
                        }
                    });
                }
            });
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.getAllReading = function getAllReading(result) {
    const sqlQuery = `SELECT * FROM Reading  ORDER BY created_time DESC`;
    try {
        pool.query(sqlQuery, [], (err, res) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            } else {
                result(null, res.rows);
            }
        });
    } catch (error) {
        logger.error(error);
    }
};
exports.createReading = function createReading(Reading, result) {
    try {
        const sqlQuery = `INSERT INTO "Reading"(created_time, humidity, latitude, longitude, no2, co2, temperature) VALUES ( '${Reading.created_date}', '${Reading.humidity}', '${Reading.no2}', '${Reading.co2}', '${Reading.temperature}') RETURNING id`;

        pool.query(sqlQuery, [], (err, res) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            } else {
                result(null, res.rowCount);
            }
        });
    } catch (error) {
        logger.error('ERROR', error);
    }
};


exports.get10lastdates = function(id, result) {
    try {
        const sqlQuery = `SELECT
            DISTINCT created_time::date AS created_time  
            FROM public."Reading" 
            WHERE created_time > current_date - interval '10' day AND node_id=${id} ORDER BY created_time DESC`;

        pool.query(sqlQuery, [], (err, res) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            } else {
                result(null, res.rows);
            }
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.getAvgValuesdates = function(id, day, result) {
    try {
        const sqlQuery = `SELECT ROUND(AVG(humidity), 2) AS humidity, ROUND(AVG(no2), 2) AS no2, ROUND(AVG(co2), 2) AS co2, ROUND(AVG(temperature), 2) AS temperature
            FROM public."Reading" 
            WHERE created_time::date = current_date - interval '${day}' day AND node_id= '${id}' `;

        pool.query(sqlQuery, [], (err, res) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            } else {
                result(null, res.rows);
            }
        });
    } catch (error) {
        logger.error(error);
    }
};


exports.getAvgValuesdatesAsync = function(id, day) {
    return new Promise((resolve, reject) => {
        const sqlQuery = `SELECT ROUND(AVG(humidity), 2) AS humidity, ROUND(AVG(no2), 2) AS no2, ROUND(AVG(co2), 2) AS co2, ROUND(AVG(temperature), 2) AS temperature
                
            FROM public."Reading" 
            WHERE created_time::date = current_date - interval '${day}' day AND node_id= '${id}' `;
            
        pool.query(sqlQuery, [], function (err, res) {
            if(!err) {
                // logger.error(res.rows);
                resolve(res.rows[0])
            } else {
                logger.error(err)
                reject(err)
            }
        });
    })
};