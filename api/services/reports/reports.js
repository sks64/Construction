const mm = require('../../utilities/globalModule');
const logger = require('../../utilities/logger')

exports.getOverDueOrders = (req, res) => {

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
    (req.body.CUSTOMER_ID && (req.body.CUSTOMER_ID).length > 0 ? filter += ` AND ID IN(${req.body.CUSTOMER_ID})` : '');

    if (pageIndex === '' && pageSize === '')
        criteria = filter + " order by " + sortKey + " " + sortValue;
    else
        criteria = filter + " order by " + sortKey + " " + sortValue + " LIMIT " + start + "," + end;

    let countCriteria = filter;
    try {
        mm.executeQuery('select count(ID) as cnt from customer_master where 1 ' + countCriteria, (error, results1) => {
            if (error) {
                //console.log(error);
                logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
                res.send({
                    "code": 400,
                    "message": "Failed to get viewCustomerMaster count.",
                });
            }
            else {
                //console.log(results1);
                mm.executeQuery('SELECT c.ID, c.NAME, c.MOBILE_NO, (select count(ID) from order_master where ORDER_ENDTIME < CURRENT_DATE AND CUSTOMER_ID = c.ID )as TOTAL_DUE_ORDERS FROM `customer_master` c where 1 ' + criteria, (error, results) => {
                    if (error) {
                        //console.log(error);
                        logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
                        res.send({
                            "code": 400,
                            "message": "Failed to get viewCustomerMaster information."
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

exports.getOrderPaymentSummary = (req, res) => {

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
    let filter2 = '';
    let filter3 = '';

    (req.body.CUSTOMER_ID && (req.body.CUSTOMER_ID).length > 0 ? filter += ` AND ID IN(${req.body.CUSTOMER_ID})` : '');
    (req.body.FROM_DATE && req.body.FROM_DATE != ' ' && req.body.TO_DATE && req.body.TO_DATE != ' ' ? filter2 += ` AND date(ORDER_DATETIME) between '${req.body.FROM_DATE}' AND '${req.body.TO_DATE}' ` : '');
    (req.body.FROM_DATE && req.body.FROM_DATE != ' ' && req.body.TO_DATE && req.body.TO_DATE != ' ' ? filter3 += ` AND date(PAYMENT_DATETIME) between '${req.body.FROM_DATE}' AND '${req.body.TO_DATE}' ` : '');
    (req.body.CUSTOMER_ID && (req.body.CUSTOMER_ID).length > 0 ? filter += ` AND ID IN(${req.body.CUSTOMER_ID})` : '');

    if (pageIndex === '' && pageSize === '')
        criteria = filter + " order by " + sortKey + " " + sortValue;
    else
        criteria = filter + " order by " + sortKey + " " + sortValue + " LIMIT " + start + "," + end;

    let countCriteria = filter;
    try {
        mm.executeQuery('select count(ID) as cnt from customer_master where 1 ' + countCriteria, (error, results1) => {
            if (error) {
                //console.log(error);
                logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
                res.send({
                    "code": 400,
                    "message": "Failed to get viewCustomerMaster count.",
                });
            }
            else {
                //console.log(results1);
                mm.executeQuery(`SELECT c.ID, NAME,  (select IFNULL(sum(AMOUNT),0) from order_payment_details where 1 AND CUSTOMER_ID = c.ID AND STATUS = 1 ${filter3}) as TOTAL_PAID, (select IFNULL(sum(SUB_TOTAL),0) from order_master where 1 AND CUSTOMER_ID = c.ID ${filter2}) as ORDER_AMOUNT FROM customer_master c where 1 ` + criteria, (error, results) => {
                    if (error) {
                        //console.log(error);
                        logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url);
                        res.send({
                            "code": 400,
                            "message": "Failed to get payment information."
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

exports.getDashboardSummaryReport = (req, res) => {

    try {
        mm.executeQuery('select count(ID) as cnt from customer_master where status = 1 ', (error, customerCount) => {
            if (error) {
                //console.log(error);
                logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
                res.send({
                    "code": 400,
                    "message": "Failed to get viewCustomerMaster count.",
                });
            }
            else {
                //console.log(results1);
                mm.executeQuery('SELECT count(ID) as cnt from order_master ', (error, totalOrders) => {
                    if (error) {
                        //console.log(error);
                        logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
                        res.send({
                            "code": 400,
                            "message": "Failed to get order count."
                        });
                    }
                    else {
                        mm.executeQuery('SELECT count(ID) as cnt from item_master where STATUS = 1 ', (error, totalItems) => {
                            if (error) {
                                //console.log(error);
                                logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
                                res.send({
                                    "code": 400,
                                    "message": "Failed to get item count."
                                });
                            }
                            else {
                                mm.executeQuery('SELECT count(ID) as cnt from user_master where STATUS = 1 ', (error, totalUsers) => {
                                    if (error) {
                                        //console.log(error);
                                        logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
                                        res.send({
                                            "code": 400,
                                            "message": "Failed to get User Count."
                                        });
                                    }
                                    else {
                                        res.send({
                                            "code": 200,
                                            "message": "success",
                                            "totalCustomers": customerCount,
                                            "totalOrders": totalOrders,
                                            "totalItems": totalItems,
                                            "totalUsers": totalUsers
                                        });
                                    }
                                });
                            }
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

exports.getOrderDatewiseReport = (req, res) => {

    let systemDate = mm.getSystemDate();
    let FROM_DATE = req.body.FROM_DATE ? req.body.FROM_DATE : systemDate.split('-')[0] + systemDate.split('-')[1] + "01",
        TO_DATE = req.body.TO_DATE ? req.body.TO_DATE : systemDate.split(' ')[0];

    try {
        if (FROM_DATE && FROM_DATE != ' ' && TO_DATE && TO_DATE != ' ') {
            let query = `SELECT DATE_ADD(?, INTERVAL n.num DAY) AS intermediate_date,
  (SELECT count(ID) from order_master where date(ORDER_DATETIME) = DATE_ADD(?, INTERVAL n.num DAY) ) as TOTAL_ORDERS  
		    FROM (
        SELECT (t0.n + t1.n * 10 + t2.n * 100) AS num
        FROM (SELECT 0 AS n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t0
        CROSS JOIN (SELECT 0 AS n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t1
        CROSS JOIN (SELECT 0 AS n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t2
    ) AS n 
    WHERE DATE_ADD(?, INTERVAL n.num DAY) <= ? ORDER BY intermediate_date `

            mm.executeQueryData(query, [FROM_DATE, FROM_DATE, FROM_DATE, TO_DATE], (error, results) => {
                if (error) {
                    console.log(error);
                    logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
                    res.send({
                        "code": 400,
                        "message": "Failed to get barchart information."
                    });
                }
                else {
                    res.send({
                        "code": 200,
                        "message": "success",
                        "data": results
                    });
                }
            });
        }
        else {
            res.send({
                "code": 404,
                "message": "parameter missing."
            })
        }
    } catch (error) {
        logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
        console.log(error);
    }
}

exports.getDashboardSaleReport = (req, res) => {

    let systemDate = mm.getSystemDate(),
        month = systemDate.split('-')[1],
        year = systemDate.split('-')[0];
    try {
        let query = `select IFNULL(sum(AMOUNT),0) as SALE_AMOUNT from order_payment_details where month(PAYMENT_DATETIME) = ? AND year(PAYMENT_DATETIME) = ? AND STATUS = ?`;

        let query2 = `select IFNULL(sum(AMOUNT),0) as SALE_AMOUNT from order_payment_details where 1 AND year(PAYMENT_DATETIME) = ? AND STATUS = ?`;

        let query3 = `select IFNULL(sum(AMOUNT),0) as SALE_AMOUNT from order_payment_details where 1 AND date(PAYMENT_DATETIME) = CURRENT_DATE AND STATUS = ?`;

        mm.executeQueryData(query, [month, year, 1], (error, currentMonthSale) => {
            if (error) {
                console.log(error);
                logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
                res.send({
                    "code": 400,
                    "message": "Failed to get currentMonthSale information."
                });
            }
            else {
                mm.executeQueryData(query2, [year, 1], (error, currentYearSale) => {
                    if (error) {
                        console.log(error);
                        logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
                        res.send({
                            "code": 400,
                            "message": "Failed to get currentYearSale information."
                        });
                    }
                    else {
                        mm.executeQueryData(query3, [1], (error, todaysSale) => {
                            if (error) {
                                console.log(error);
                                logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
                                res.send({
                                    "code": 400,
                                    "message": "Failed to get todaysSale information."
                                });
                            }
                            else {
                                res.send({
                                    "code": 200,
                                    "message": "success",
                                    "currentMonthSale": currentMonthSale,
                                    "currentYearSale": currentYearSale,
                                    "todaysSale": todaysSale
                                });
                            }
                        });
                    }
                });
            }
        });
    } catch (error) {
        logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
        console.log(error);
    }
}

exports.topFiveSalingItem = (req, res) => {

    try {
        let query = `select NAME, (select IFNULL(sum(QTY),0) from order_details where ITEM_ID = item_master.ID) as TOTAL_SALE FROM item_master ORDER BY TOTAL_SALE DESC LIMIT 5`;

        mm.executeQuery(query, (error, topFiveItems) => {
            if (error) {
                // console.log(error);
                logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
                res.send({
                    "code": 400,
                    "message": "Failed to get currentMonthSale information."
                });
            }
            else {
                res.send({
                    "code": 200,
                    "message": "Success.",
                    "data": topFiveItems
                });
            }
        });
    } catch (error) {
        logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
        console.log(error);
    }
}

exports.topFiveCustomers = (req, res) => {

    try {
        let query = `select NAME, (select IFNULL(sum(PAID_AMOUNT),0) FROM order_master where CUSTOMER_ID = customer_master.ID AND STATUS = 1) as TOTAL_AMOUNT FROM customer_master ORDER BY TOTAL_AMOUNT DESC LIMIT 5`;

        mm.executeQuery(query, (error, topFiveCustomers) => {
            if (error) {
                console.log(error);
                logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
                res.send({
                    "code": 400,
                    "message": "Failed to get currentMonthSale information."
                });
            }
            else {
                res.send({
                    "code": 200,
                    "message": "Success.",
                    "data": topFiveCustomers
                });
            }
        });
    } catch (error) {
        logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
        console.log(error);
    }
}