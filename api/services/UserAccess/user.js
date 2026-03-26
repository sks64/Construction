const mm = require("../../utilities/globalModule");
const { validationResult, body } = require("express-validator");
const logger = require("../../utilities/logger");

var userMaster = "user_master";
var viewUserMaster = "view_" + userMaster;

function reqData(req) {
  var data = {
    NAME: req.body.NAME,
    MOBILE_NO: req.body.MOBILE_NO,
    EMAIL_ID: req.body.EMAIL_ID,
    STATUS: req.body.STATUS ? 1 : 0,
    ADDRESS: req.body.ADDRESS,
    PASSWORD: req.body.PASSWORD,
    CREATED_MODIFIED_DATE: req.body.CREATED_MODIFIED_DATE,
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
        viewUserMaster +
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
            message: "Failed to get viewUserMaster count.",
          });
        } else {
          //console.log(results1);
          mm.executeQuery(
            "select * from " + viewUserMaster + " where 1 " + criteria,
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
                  message: "Failed to get viewUserMaster information.",
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
      "INSERT INTO " + userMaster + " SET ?",
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
            message: "Failed to save userMaster information...",
          });
        } else {
          //console.log(results);
          res.send({
            code: 200,
            message: "userMaster information saved successfully...",
          });
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
        userMaster +
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
            message: "Failed to update userMaster information.",
          });
        } else {
          //console.log(results);
          res.send({
            code: 200,
            message: "userMaster information updated successfully...",
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

exports.websitelogin = (req, res) => {
  var systemDate = mm.getSystemDate(),
    username = req.body.username,
    password = md5(req.body.password);
  try {
    if (
      username &&
      username != " " &&
      username != undefined &&
      password &&
      password != " " &&
      password != undefined
    ) {
      mm.executeQueryData(
        `SELECT * FROM employee_master  WHERE  (MOBILE_NO = ? or EMAIL_ID = ?) and PASSWORD = ? and STATUS = 1 AND IS_ADMIN = 1`,
        [username, username, password],
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
              message: "Failed to get record...",
            });
          } else {
            if (results1.length > 0) {
              mm.executeQueryData(
                `update employee_master set LAST_LOGIN_DATE = ? where ID = ?;`,
                [systemDate, results1[0].ID],
                (error, updateLoginTime) => {
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
                      message: "Failed to update time...",
                    });
                  } else {
                    mm.executeQueryData(
                      `SELECT ROLE_ID, ROLE_NAME FROM view_employee_role_mapping where EMP_ID = ?`,
                      [results1[0].ID],
                      (error, resultRole) => {
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
                            message: "Failed to get record",
                          });
                        } else {
                          var userDetails = [
                            {
                              EMP_ID: results1[0].ID,
                              ROLE_ID: results1[0].ROLE_ID,
                              ROLE_NAME: results1[0].ROLE_NAME,
                              NAME:
                                results1[0].FIRST_NAME +
                                " " +
                                results1[0].LAST_NAME,
                              EMAIL_ID: results1[0].EMAIL_ID,
                              MOBILE_NO: results1[0].MOBILE_NO,
                              LAST_LOGIN_DATE: results1[0].LAST_LOGIN_DATE,
                              ROLE_DETAILS: resultRole,
                            },
                          ];
                          generateToken(results1[0].ID, res, userDetails);
                        }
                      }
                    );
                  }
                }
              );
            } else {
              res.send({
                code: 304,
                message: "Incorrect username or password...",
              });
            }
          }
        }
      );
    } else {
      res.send({
        code: 404,
        message: "username or password parameter missing...",
      });
    }
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
