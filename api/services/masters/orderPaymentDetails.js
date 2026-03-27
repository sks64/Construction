const mm = require('../../utilities/globalModule');
const { validationResult, body } = require('express-validator');
const logger = require('../../utilities/logger')

var orderPaymentDetails = "order_payment_details";
var viewOrderPaymentDetails = "view_" + orderPaymentDetails;

function reqData(req) {

    var data = {

        ORDER_ID: req.body.ORDER_ID,
        AMOUNT: req.body.AMOUNT,
        PAYMENT_DATETIME: req.body.PAYMENT_DATETIME,
        REMARK: req.body.REMARK,
        CUSTOMER_ID: req.body.CUSTOMER_ID,
        PAYMENT_COLLECTED_BY: req.body.PAYMENT_COLLECTED_BY,
        STATUS: req.body.STATUS ? 1 : 0

    }
    return data;
}

// exports.validate = function () {
//     return [
//         body('NAME', ' parameter missing').exists(),
//         body('ADDRESS_LINE_1', ' parameter missing').exists(),
//         body('ADDRESS_LINE_2', ' parameter missing').optional(),
//         body('CITY', ' parameter missing').exists(),
//         body('TEHSIL', ' parameter missing').exists(),
//         body('DISTRICT', ' parameter missing').exists(),
//         body('STATE_ID', ' parameter missing').exists(),
//         body('COUNTRY', ' parameter missing').exists(),
//         body('PINCODE', ' parameter missing').exists(),
//         body('LONGITUTE', ' parameter missing').exists(),
//         body('LATITUTE', ' parameter missing').exists(),
//         body('ADMIN_NAME', ' parameter missing').exists(),
//         body('EMAIL_ID', ' parameter missing').exists(),
//         body('MOBILE_NUMBER', ' parameter missing').exists(),
//         body('PASSWORD', ' parameter missing').exists(),
//         body('ID').optional(),
//     ]
// }

exports.get = (req, res) => {

    var pageIndex = req.body.pageIndex ? req.body.pageIndex : '';
    var pageSize = req.body.pageSize ? req.body.pageSize : '';
    var start = 0;
    var end = 0;

    //console.log(pageIndex + " " + pageSize)
    if (pageIndex != '' && pageSize != '') {
        start = (pageIndex - 1) * pageSize;
        end = pageSize;
        //console.log(start + " " + end);
    }

    let sortKey = req.body.sortKey ? req.body.sortKey : 'ID';
    let sortValue = req.body.sortValue ? req.body.sortValue : 'DESC';
    let filter = req.body.filter ? req.body.filter : '';
    let criteria = '';
    console.log(req.body);
    // (req.body.SEARCH_FILTER && req.body.SEARCH_FILTER != ' ' ? filter += ` AND(NAME LIKE '%${req.body.SEARCH_FILTER}%' OR ADDRESS LIKE '%${req.body.SEARCH_FILTER}%' OR ORGANISATION_NAME LIKE '%${req.body.SEARCH_FILTER}%')` : filter += '');
    (req.body.ORDER_ID && (req.body.ORDER_ID).length > 0 ? filter += ` AND ORDER_ID IN(${req.body.ORDER_ID})` : '');
    (req.body.CUSTOMER_ID && (req.body.CUSTOMER_ID).length > 0 ? filter += ` AND CUSTOMER_ID IN(${req.body.CUSTOMER_ID})` : '');

    if (pageIndex === '' && pageSize === '')
        criteria = filter + " order by " + sortKey + " " + sortValue;
    else
        criteria = filter + " order by " + sortKey + " " + sortValue + " LIMIT " + start + "," + end;

    let countCriteria = filter;
    try {
        mm.executeQuery('select count(*) as cnt from ' + viewOrderPaymentDetails + ' where 1 ' + countCriteria, (error, results1) => {
            if (error) {
                //console.log(error);
                logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
                res.send({
                    "code": 400,
                    "message": "Failed to get viewOrderPaymentDetails count.",
                });
            }
            else {
                //console.log(results1);
                mm.executeQuery('select * from ' + viewOrderPaymentDetails + ' where 1 ' + criteria, (error, results) => {
                    if (error) {
                        //console.log(error);
                        logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
                        res.send({
                            "code": 400,
                            "message": "Failed to get viewOrderPaymentDetails information."
                        });
                    }
                    else {
                        var size = results1[0].cnt / pageSize;
                        var roundSize = Math.round(results1[0].cnt / pageSize);
                        (size - roundSize > 0 ? roundSize = roundSize + 1 : roundSize = roundSize + 0);

                        res.send({
                            "code": 200,
                            "message": "success",
                            "pages": (pageIndex && pageSize ? roundSize : 1),
                            "count": results1[0].cnt,
                            "data": results
                        });
                    }
                });
            }
        });
    } catch (error) {
        //console.log(error);
        logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
    }
}

exports.create = (req, res) => {

    var data = reqData(req);

    try {
        mm.executeQueryData('INSERT INTO ' + orderPaymentDetails + ' SET ?', data, (error, results) => {
            if (error) {
                //console.log(error);
                logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
                res.send({
                    "code": 400,
                    "message": "Failed to save orderPaymentDetails information: " + (error.sqlMessage || error.message)
                });
            }
            else {
                //console.log(results);
                res.send({
                    "code": 200,
                    "message": "orderPaymentDetails information saved successfully...",
                });
            }
        });
    } catch (error) {
        //console.log(error)
        logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
    }
}

exports.update = (req, res) => {

    var data = reqData(req);
    var criteria = {
        ID: req.body.ID,
    };
    var systemDate = mm.getSystemDate();
    var setData = "";
    var recordData = [];
    Object.keys(data).forEach(key => {
        data[key] != null ? setData += `${key}= ? , ` : true;
        data[key] != null ? recordData.push(data[key]) : true;
    });

    try {
        mm.executeQueryData(`UPDATE ` + orderPaymentDetails + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, (error, results) => {
            if (error) {
                //console.log(error);
                logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
                res.send({
                    "code": 400,
                    "message": "Failed to update orderPaymentDetails information."
                });
            }
            else {
                //console.log(results);
                res.send({
                    "code": 200,
                    "message": "orderPaymentDetails information updated successfully...",
                });
            }
        });
    } catch (error) {
        //console.log(error);
        logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
    }
}

exports.makePayment = (req, res) => {

    var data = reqData(req);
    let systemDate = mm.getSystemDate();
    data.PAYMENT_DATETIME = systemDate;
    data.STATUS = 1;

    try {
        if (data.AMOUNT > 0) {
            if (data.ORDER_ID && data.ORDER_ID != ' ' && data.AMOUNT && data.AMOUNT != ' ' && data.CUSTOMER_ID && data.CUSTOMER_ID != ' ' && data.PAYMENT_COLLECTED_BY && data.PAYMENT_COLLECTED_BY != ' ') {
                const connection = mm.openConnection();
                mm.executeDML('INSERT INTO ' + orderPaymentDetails + ' SET ?', data, connection, (error, results) => {
                    if (error) {
                        //console.log(error);
                        mm.rollbackConnection(connection)
                        logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
                        res.send({
                            "code": 400,
                            "message": "Failed to save orderPaymentDetails information: " + (error.sqlMessage || error.message)
                        });
                    }
                    else {
                        mm.executeDML(`select SUB_TOTAL, PAID_AMOUNT from order_master where ID = ?`, [data.ORDER_ID], connection, (error, getOrderData) => {
                            if (error) {
                                mm.rollbackConnection(connection)
                                logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
                                res.send({
                                    "code": 400,
                                    "message": "Failed to get order information..."
                                });
                            }
                            else {
                                if (getOrderData.length > 0) {
                                    let subTotal = getOrderData[0].SUB_TOTAL;
                                    let paidAmount = getOrderData[0].PAID_AMOUNT;
                                    let remainingAmount = parseFloat(subTotal) - parseFloat(paidAmount);
                                    let PAID_AMOUNT = parseFloat(paidAmount) + parseFloat(data.AMOUNT);
                                    if (remainingAmount >= data.AMOUNT) {
                                        let paymentStatus = '';
                                        (subTotal == PAID_AMOUNT ? paymentStatus = 'P' : paymentStatus = "PP");
                                        mm.executeDML(`update order_master set PAID_AMOUNT = ?,PAYMENT_STATUS = ? where ID = ? `, [PAID_AMOUNT, paymentStatus, data.ORDER_ID], connection, (error, updateOrder) => {
                                            if (error) {
                                                mm.rollbackConnection(connection)
                                                logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
                                                res.send({
                                                    "code": 400,
                                                    "message": "Failed to get order information..."
                                                });
                                            }
                                            else {
                                                mm.commitConnection(connection)
                                                res.send({
                                                    "code": 200,
                                                    "message": "success..",
                                                });
                                            }
                                        })
                                    }
                                    else {
                                        mm.rollbackConnection(connection)
                                        res.send({
                                            "code": 305,
                                            "message": "Amount is not acceptable..",
                                        });
                                    }
                                }
                                else {
                                    mm.rollbackConnection(connection)
                                    res.send({
                                        "code": 304,
                                        "message": "Order not found..",
                                    });
                                }
                            }
                        })
                    }
                });
            }
            else {
                res.send({
                    "code": 404,
                    "message": "Parameter Missing."
                })
            }
        }
        else {
            res.send({
                "code": 305,
                "message": "Amount is not acceptable..",
            });
        }


    } catch (error) {
        //console.log(error)
        logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
    }
}