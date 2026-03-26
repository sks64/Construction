const mm = require("../../utilities/globalModule");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const logger = require("../../utilities/logger");

var userMaster = "user_master";
var viewUserMaster = userMaster;

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

//         body('NAME', ' parameter missing').exists(), body('EMPLOYEE_CODE', ' parameter missing').exists(), body('EMAIL_ID', ' parameter missing').exists(), body('MOBILE_NUMBER', ' parameter missing').exists(), body('GENDER', ' parameter missing').exists(), body('BIRTH_DATE', ' parameter missing').exists(), body('ADDRESS1', ' parameter missing').exists(), body('ADDRESS2').optional(), body('CITY', ' parameter missing').exists(), body('PINCODE').isInt(), body('PROFILE_PHOTO').optional(), body('DESIGNATION_ID').isInt(), body('BRANCH_ID').isInt(), body('DEPARTMENT_ID').isInt(), body('REPORTING_HEAD_ID').isInt(), body('TEMPORARY_HEAD_ID').isInt().optional(), body('PASSWORD', ' parameter missing').exists(), body('SEQUENCE_NO').isInt(), body('CLOUD_ID').optional(), body('W_CLOUD_ID').optional(), body('DEVICE_ID').optional(), body('W_DEVICE_ID').optional(), body('JOINING_DATE', ' parameter missing').exists(), body('ID').optional(),
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
  var SEARCH_FILTER = req.body.SEARCH_FILTER;
  SEARCH_FILTER && SEARCH_FILTER != " "
    ? (filter += ` AND (NAME LIKE '%${SEARCH_FILTER}%' OR NAME LIKE '%${SEARCH_FILTER}%' OR MOBILE_NO LIKE '%${SEARCH_FILTER}%' OR EMAIL_ID LIKE '%${SEARCH_FILTER}%') `)
    : "";

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
    data.PASSWORD = md5(data.PASSWORD);
    mm.executeQueryData(
      "select ID from " + userMaster + " where MOBILE_NO = ? or EMAIL_ID = ?;",
      [data.MOBILE_NO, data.EMAIL_ID],
      (error, resultsGet) => {
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
          if (resultsGet.length > 0) {
            res.send({
              code: 304,
              message: "Mobile no already present..",
            });
          } else {
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
                  res.send({
                    code: 200,
                    message: "userMaster information saved successfully...",
                  });
                }
              }
            );
          }
        }
      }
    );
  } catch (error) {
    logger.error(
      req.url,
      req.method,
      JSON.stringify(error),
      req.baseUrl + req.url
    );
    //console.log(error)
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
  data.PASSWORD = null;
  // (data.STATUS == 1 ? 1 : 0)
  Object.keys(data).forEach((key) => {
    data[key] != null ? (setData += `${key}= ? , `) : true;
    data[key] != null ? recordData.push(data[key]) : true;
  });
  var roleData = req.body.roleData ? req.body.roleData : [];
  try {
    mm.executeQueryData(
      "select ID from " +
        userMaster +
        " where (MOBILE_NO = ? or EMAIL_ID = ? ) and ID <> ?;",
      [data.MOBILE_NO, data.EMAIL_ID, criteria.ID],
      (error, resultsGet) => {
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
          if (resultsGet.length > 0) {
            res.send({
              code: 304,
              message: "Mobile no already present..",
            });
          } else {
            var connection = mm.openConnection();
            mm.executeDML(
              `UPDATE ` +
                userMaster +
                ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `,
              recordData,
              connection,
              (error, results) => {
                if (error) {
                  //console.log(error);
                  mm.rollbackConnection(connection);
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
                  mm.commitConnection(connection);
                  res.send({
                    code: 200,
                    message: "EmployeeMaster information saved successfully...",
                  });
                }
              }
            );
          }
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

function generateToken(userId, res, resultsUser, req) {
  var data = {
    EMP_ID: userId,
  };
  var expiresIn = "3h";
  try {
    jwt.sign({ data }, process.env.SECRET, { expiresIn }, (error, token) => {
      if (error) {
        //console.log("token error", error);
        logger.error(
          req.url,
          req.method,
          JSON.stringify(error),
          req.baseUrl + req.url
        );
      } else {
        //console.log(data);
        res.send({
          code: 200,
          message: "Logged in successfully...",
          data: [
            {
              token: token,
              UserData: resultsUser,
            },
          ],
        });
      }
    });
  } catch (error) {
    console.log(error);
    // logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
  }
}

exports.createEmployee = (req, res) => {
  var data = reqData(req);
  var roleData = req.body.roleData ? req.body.roleData : [3];
  // roleData = [3]
  try {
    data.PASSWORD = md5("12345678");

    if (roleData.length > 0) {
      mm.executeQueryData(
        "select ID from " +
          employeeMaster +
          " where MOBILE_NO = ? or EMAIL_ID = ?;",
        [data.MOBILE_NO, data.EMAIL_ID],
        (error, resultsGet) => {
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
              message: "Failed to save employeeMaster information...",
            });
          } else {
            if (resultsGet.length > 0) {
              res.send({
                code: 304,
                message: "Mobile no already present..",
              });
            } else {
              const connection = mm.openConnection();
              mm.executeDML(
                `select count(ID) as cnt from employee_master`,
                "",
                connection,
                (error, getCount) => {
                  if (error) {
                    //console.log(error);
                    logger.error(
                      req.url,
                      req.method,
                      JSON.stringify(error),
                      req.baseUrl + req.url
                    );
                    mm.rollbackConnection(connection);
                    res.send({
                      code: 400,
                      message: "Failed to get employeeMaster information...",
                    });
                  } else {
                    data.EMPLOYEE_CODE = "E_" + (getCount[0].cnt + 1);
                    mm.executeDML(
                      "INSERT INTO " + employeeMaster + " SET ?",
                      data,
                      connection,
                      (error, results) => {
                        if (error) {
                          //console.log(error);
                          logger.error(
                            req.url,
                            req.method,
                            JSON.stringify(error),
                            req.baseUrl + req.url
                          );
                          mm.rollbackConnection(connection);
                          res.send({
                            code: 400,
                            message:
                              "Failed to save employeeMaster information...",
                          });
                        } else {
                          var recordData = [];
                          for (let i = 0; i < roleData.length; i++) {
                            var rec = [results.insertId, roleData[i], 1];
                            recordData.push(rec);
                          }
                          mm.executeQueryData(
                            `insert into employee_role_mapping(EMP_ID, ROLE_ID, STATUS) values ?`,
                            [recordData],
                            (error, insertEmpRoles) => {
                              if (error) {
                                //console.log(error);
                                logger.error(
                                  req.url,
                                  req.method,
                                  JSON.stringify(error),
                                  req.baseUrl + req.url
                                );
                                mm.rollbackConnection(connection);
                                res.send({
                                  code: 400,
                                  message:
                                    "Failed to save employee_role_mapping information...",
                                });
                              } else {
                                mm.commitConnection(connection);
                                res.send({
                                  code: 200,
                                  message:
                                    "EmployeeMaster information saved successfully...",
                                });
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        }
      );
    } else {
      res.send({
        code: 404,
        message: "Parameter missing",
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
        `SELECT * FROM user_master  WHERE  (MOBILE_NO = ? or EMAIL_ID = ?) and PASSWORD = ? and STATUS = 1 `,
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
              var userDetails = [
                {
                  USER_ID: results1[0].ID,
                  NAME: results1[0].NAME,
                  EMAIL_ID: results1[0].EMAIL_ID,
                  MOBILE_NO: results1[0].MOBILE_NO,
                },
              ];
              generateToken(results1[0].ID, res, userDetails);
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

exports.changePassword = (req, res) => {
  var oldPassword = md5(req.body.OLD_PASSWORD),
    newPassword = md5(req.body.NEW_PASSWORD),
    empId = req.body.EMP_ID;
  try {
    if (
      oldPassword &&
      oldPassword != " " &&
      newPassword &&
      newPassword != " " &&
      empId &&
      empId != " "
    ) {
      mm.executeQueryData(
        "select ID from " + userMaster + " where ID = ? AND PASSWORD = ?;",
        [empId, oldPassword],
        (error, resultsGet) => {
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
            if (resultsGet.length <= 0) {
              res.send({
                code: 304,
                message: "Incorrect password..",
              });
            } else {
              mm.executeQueryData(
                "update " + userMaster + " SET PASSWORD = ? where ID = ?",
                [newPassword, empId],
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
                    res.send({
                      code: 200,
                      message: "userMaster information saved successfully...",
                    });
                  }
                }
              );
            }
          }
        }
      );
    } else {
      res.send({
        code: 404,
        message: "Parameter missing",
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

exports.logoutWebsite = (req, res) => {
  var empId = req.body.EMP_ID;
  try {
    if (empId && empId != " ") {
      mm.executeQueryData(
        "update employee_master set LAST_LOGOUT_DATE = ? where ID = ?;",
        [mm.getSystemDate(), empId],
        (error, resultsGet) => {
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
              message: "Failed to save update logout information...",
            });
          } else {
            res.send({
              code: 200,
              message: "success..",
            });
          }
        }
      );
    } else {
      res.send({
        code: 404,
        message: "Parameter missing",
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

exports.logout = (req, res) => {
  var empId = req.body.EMP_ID;
  try {
    if (empId && empId != " ") {
      mm.executeQueryData(
        "update employee_master set LAST_LOGOUT_DATE = ?, CLOUD_ID = null where ID = ?;",
        [mm.getSystemDate(), empId],
        (error, resultsGet) => {
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
              message: "Failed to save update logout information...",
            });
          } else {
            res.send({
              code: 200,
              message: "success..",
            });
          }
        }
      );
    } else {
      res.send({
        code: 404,
        message: "Parameter missing",
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

exports.createUser = (req, res) => {
  var data = reqData(req);
  // var roleData = req.body.roleData ? req.body.roleData : [];
  try {
    data.PASSWORD = md5("12345678");
    mm.executeQueryData(
      "select ID from " + userMaster + " where MOBILE_NO = ? or EMAIL_ID = ?;",
      [data.MOBILE_NO, data.EMAIL_ID],
      (error, resultsGet) => {
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
          if (resultsGet.length > 0) {
            res.send({
              code: 304,
              message: "Mobile no already present..",
            });
          } else {
            const connection = mm.openConnection();
            mm.executeDML(
              "INSERT INTO " + userMaster + " SET ?",
              data,
              connection,
              (error, results) => {
                if (error) {
                  //console.log(error);
                  logger.error(
                    req.url,
                    req.method,
                    JSON.stringify(error),
                    req.baseUrl + req.url
                  );
                  mm.rollbackConnection(connection);
                  res.send({
                    code: 400,
                    message: "Failed to save userMaster information...",
                  });
                } else {
                  mm.commitConnection(connection);
                  res.send({
                    code: 200,
                    message: "userMaster information saved successfully...",
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

exports.login = (req, res) => {
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
        `SELECT * FROM user_master  WHERE  (MOBILE_NO = ? or EMAIL_ID = ?) and PASSWORD = ? and STATUS = 1 `,
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
              var userDetails = [
                {
                  USER_ID: results1[0].ID,
                  NAME: results1[0].NAME,
                  EMAIL_ID: results1[0].EMAIL_ID,
                  MOBILE_NO: results1[0].MOBILE_NO,
                },
              ];
              generateTokenForMobile(results1[0].ID, res, userDetails);
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

function generateTokenForMobile(userId, res, resultsUser, req) {
  var data = {
    EMP_ID: userId,
  };
  // var expiresIn = '3h'
  try {
    jwt.sign({ data }, process.env.SECRET, (error, token) => {
      if (error) {
        //console.log("token error", error);
        logger.error(
          req.url,
          req.method,
          JSON.stringify(error),
          req.baseUrl + req.url
        );
      } else {
        //console.log(data);
        res.send({
          code: 200,
          message: "Logged in successfully...",
          data: [
            {
              token: token,
              UserData: resultsUser,
            },
          ],
        });
      }
    });
  } catch (error) {
    console.log(error);
    // logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
  }
}
