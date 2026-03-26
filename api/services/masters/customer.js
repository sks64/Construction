const mm = require("../../utilities/globalModule");
const logger = require("../../utilities/logger");

var customerMaster = "customer_master";
var viewCustomerMaster = customerMaster;
// var viewCustomerMaster = "view_" + customerMaster;

function reqData(req) {
  var data = {
    NAME: req.body.NAME,
    MOBILE_NO: req.body.MOBILE_NO,
    ADDRESS: req.body.ADDRESS,
    STATUS: req.body.STATUS ? 1 : 0,
    ADHAR_CARD: req.body.ADHAR_CARD,
    PAN_CARD: req.body.PAN_CARD,
    CREATED_MODIFIED_DATE: req.body.CREATED_MODIFIED_DATE,
    REFERENCE_BY: req.body.REFERENCE_BY,
  };
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
  var pageIndex = req.body.pageIndex ? req.body.pageIndex : "";
  var pageSize = req.body.pageSize ? req.body.pageSize : "";
  var start = 0;
  var end = 0;

  //console.log(pageIndex + " " + pageSize)
  if (pageIndex != "" && pageSize != "") {
    start = (pageIndex - 1) * pageSize;
    end = pageSize;
    //console.log(start + " " + end);
  }

  let sortKey = req.body.sortKey ? req.body.sortKey : "ID";
  let sortValue = req.body.sortValue ? req.body.sortValue : "DESC";
  let filter = req.body.filter ? req.body.filter : "";
  let criteria = "";

  if (pageIndex === "" && pageSize === "")
    criteria = filter + " order by " + sortKey + " " + sortValue;
  else
    criteria =
      filter +
      " order by " +
      sortKey +
      " " +
      sortValue +
      " LIMIT " +
      start +
      "," +
      end;

  let countCriteria = filter;
  try {
    mm.executeQuery(
      "select count(*) as cnt from " +
        viewCustomerMaster +
        " where 1 " +
        countCriteria,
      (error, results1) => {
        if (error) {
          //console.log(error);
          logger.error(
            req.url,
            req.method,
            JSON.stringify(error),
            req.baseUrl + req.url
          );
          res.send({
            code: 400,
            message: "Failed to get viewCustomerMaster count.",
          });
        } else {
          //console.log(results1);
          mm.executeQuery(
            "select * from " + viewCustomerMaster + " where 1 " + criteria,
            (error, results) => {
              if (error) {
                //console.log(error);
                logger.error(
                  req.url,
                  req.method,
                  JSON.stringify(error),
                  req.baseUrl + req.url
                );
                res.send({
                  code: 400,
                  message: "Failed to get viewCustomerMaster information.",
                });
              } else {
                var size = results1[0].cnt / pageSize;
                var roundSize = Math.round(results1[0].cnt / pageSize);
                size - roundSize > 0
                  ? (roundSize = roundSize + 1)
                  : (roundSize = roundSize + 0);

                res.send({
                  code: 200,
                  message: "success",
                  pages: pageIndex && pageSize ? roundSize : 1,
                  count: results1[0].cnt,
                  data: results,
                });
              }
            }
          );
        }
      }
    );
  } catch (error) {
    //console.log(error);
    logger.error(
      req.url,
      req.method,
      JSON.stringify(error),
      req.baseUrl + req.url
    );
  }
};

exports.create = (req, res) => {
  var data = reqData(req);

  try {
    mm.executeQueryData(
      `select ID from customer_master where (MOBILE_NO = ?)`,
      [data.MOBILE_NO],
      (error, results1) => {
        if (error) {
          //console.log(error);
          logger.error(
            req.url,
            req.method,
            JSON.stringify(error),
            req.baseUrl + req.url
          );
          res.send({
            code: 400,
            message: "Failed to save customerMaster information...",
          });
        } else {
          if (results1.length > 0) {
            res.send({
              code: 304,
              message: "Already exist",
            });
          } else {
            mm.executeQueryData(
              "INSERT INTO " + customerMaster + " SET ?",
              data,
              (error, results) => {
                if (error) {
                  //console.log(error);
                  logger.error(
                    req.url,
                    req.method,
                    JSON.stringify(error),
                    req.baseUrl + req.url
                  );
                  res.send({
                    code: 400,
                    message: "Failed to save customerMaster information...",
                  });
                } else {
                  //console.log(results);
                  res.send({
                    code: 200,
                    message: "customerMaster information saved successfully...",
                  });
                }
              }
            );
          }
        }
      }
    );
  } catch (error) {
    //console.log(error)
    logger.error(
      req.url,
      req.method,
      JSON.stringify(error),
      req.baseUrl + req.url
    );
  }
};

exports.update = (req, res) => {
  var data = reqData(req);
  var criteria = {
    ID: req.body.ID,
  };
  var systemDate = mm.getSystemDate();
  var setData = "";
  var recordData = [];
  Object.keys(data).forEach((key) => {
    data[key] != null ? (setData += `${key}= ? , `) : true;
    data[key] != null ? recordData.push(data[key]) : true;
  });

  try {
    mm.executeQueryData(
      `UPDATE ` +
        customerMaster +
        ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `,
      recordData,
      (error, results) => {
        if (error) {
          //console.log(error);
          logger.error(
            req.url,
            req.method,
            JSON.stringify(error),
            req.baseUrl + req.url
          );
          res.send({
            code: 400,
            message: "Failed to update customerMaster information.",
          });
        } else {
          //console.log(results);
          res.send({
            code: 200,
            message: "customerMaster information updated successfully...",
          });
        }
      }
    );
  } catch (error) {
    //console.log(error);
    logger.error(
      req.url,
      req.method,
      JSON.stringify(error),
      req.baseUrl + req.url
    );
  }
};

exports.getCustomers = (req, res) => {
  var pageIndex = req.body.pageIndex ? req.body.pageIndex : "";
  var pageSize = req.body.pageSize ? req.body.pageSize : "";
  var start = 0;
  var end = 0;

  //console.log(pageIndex + " " + pageSize)
  if (pageIndex != "" && pageSize != "") {
    start = (pageIndex - 1) * pageSize;
    end = pageSize;
    //console.log(start + " " + end);
  }

  let sortKey = req.body.sortKey ? req.body.sortKey : "ID";
  let sortValue = req.body.sortValue ? req.body.sortValue : "DESC";
  let filter = req.body.filter ? req.body.filter : "";
  let criteria = "";
  filter += ` AND STATUS = 1 `;

  if (pageIndex === "" && pageSize === "")
    criteria = filter + " order by " + sortKey + " " + sortValue;
  else
    criteria =
      filter +
      " order by " +
      sortKey +
      " " +
      sortValue +
      " LIMIT " +
      start +
      "," +
      end;

  let countCriteria = filter;
  try {
    mm.executeQuery(
      "select count(*) as cnt from " +
        viewCustomerMaster +
        " where 1 " +
        countCriteria,
      (error, results1) => {
        if (error) {
          //console.log(error);
          logger.error(
            req.url,
            req.method,
            JSON.stringify(error),
            req.baseUrl + req.url
          );
          res.send({
            code: 400,
            message: "Failed to get viewCustomerMaster count.",
          });
        } else {
          //console.log(results1);
          mm.executeQuery(
            "select ID, NAME from " +
              viewCustomerMaster +
              " where 1 " +
              criteria,
            (error, results) => {
              if (error) {
                //console.log(error);
                logger.error(
                  req.url,
                  req.method,
                  JSON.stringify(error),
                  req.baseUrl + req.url
                );
                res.send({
                  code: 400,
                  message: "Failed to get viewCustomerMaster information.",
                });
              } else {
                var size = results1[0].cnt / pageSize;
                var roundSize = Math.round(results1[0].cnt / pageSize);
                size - roundSize > 0
                  ? (roundSize = roundSize + 1)
                  : (roundSize = roundSize + 0);

                res.send({
                  code: 200,
                  message: "success",
                  pages: pageIndex && pageSize ? roundSize : 1,
                  count: results1[0].cnt,
                  data: results,
                });
              }
            }
          );
        }
      }
    );
  } catch (error) {
    //console.log(error);
    logger.error(
      req.url,
      req.method,
      JSON.stringify(error),
      req.baseUrl + req.url
    );
  }
};
