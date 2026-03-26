const mm = require("../../utilities/globalModule");
const logger = require("../../utilities/logger");
const async = require("async");
var orderMaster = "order_master";
var viewOrderMaster = orderMaster;

function reqData(req) {
  var data = {
    CUSTOMER_ID: req.body.CUSTOMER_ID,
    ORDER_NO: req.body.ORDER_NO,
    ORDER_DATETIME: req.body.ORDER_DATETIME,
    ORDER_AMOUNT: req.body.ORDER_AMOUNT,
    ORDER_TYPE: req.body.ORDER_TYPE,
    ORDER_STATUS: req.body.ORDER_STATUS,
    CREATED_MODIFIED_DATE: req.body.CREATED_MODIFIED_DATE,
    SUB_TOTAL: req.body.SUB_TOTAL,
    PAYMENT_STATUS: req.body.PAYMENT_STATUS,
    CREATED_BY: req.body.CREATED_BY,
    ORDER_ENDTIME: req.body.ORDER_ENDTIME,
    FINE_AMOUNT: req.body.FINE_AMOUNT ? req.body.FINE_AMOUNT : 0,
    PAID_AMOUNT: req.body.PAID_AMOUNT,
    RETURN_DATETIME: req.body.RETURN_DATETIME,
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

  req.body.ORDER_TYPE && req.body.ORDER_TYPE != " "
    ? (filter += ` AND ORDER_TYPE = '${req.body.ORDER_TYPE}' `)
    : "";
  req.body.CUSTOMER_ID && req.body.CUSTOMER_ID.length > 0
    ? (filter += ` AND CUSTOMER_ID IN(${req.body.CUSTOMER_ID}) `)
    : "";
  req.body.FROM_DATE &&
  req.body.TO_DATE &&
  req.body.FROM_DATE != " " &&
  req.body.TO_DATE != " "
    ? ` AND date(ORDER_DATETIME) between '${req.body.FROM_DATE}' AND '${req.body.TO_DATE}' `
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
        viewOrderMaster +
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
            message: "Failed to get viewOrderMaster count.",
          });
        } else {
          //console.log(results1);
          mm.executeQuery(
            "select * from " + viewOrderMaster + " where 1 " + criteria,
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
                  message: "Failed to get viewOrderMaster information.",
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
      "INSERT INTO " + orderMaster + " SET ?",
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
            message: "Failed to save orderMaster information...",
          });
        } else {
          //console.log(results);
          res.send({
            code: 200,
            message: "orderMaster information saved successfully...",
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
        orderMaster +
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
            message: "Failed to update orderMaster information.",
          });
        } else {
          //console.log(results);
          res.send({
            code: 200,
            message: "orderMaster information updated successfully...",
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

exports.createOrder = (req, res) => {
  var data = reqData(req);
  var orderDetails =
    req.body.orderDetails && req.body.orderDetails.length > 0
      ? req.body.orderDetails
      : [];
  systemDate = mm.getSystemDate();
  data.ORDER_DATETIME = systemDate;
  data.CREATED_MODIFIED_DATE = systemDate;
  data.ORDER_STATUS = "P";
  data.PAYMENT_STATUS = "U";
  data.FINE_AMOUNT = 0;
  data.PAID_AMOUNT = 0;

  try {
    data.ORDER_NO =
      "ORD/" +
      systemDate.split(" ")[0].split("-")[0] +
      systemDate.split(" ")[0].split("-")[1] +
      systemDate.split(" ")[0].split("-")[2] +
      systemDate.split(" ")[1].split(":")[0] +
      systemDate.split(" ")[1].split(":")[1] +
      systemDate.split(" ")[1].split(":")[2];
    if (
      orderDetails.length > 0 &&
      data.CUSTOMER_ID &&
      data.CUSTOMER_ID != " " &&
      data.SUB_TOTAL &&
      data.ORDER_TYPE
    ) {
      var connection = mm.openConnection();
      mm.executeDML(
        "INSERT INTO " + orderMaster + " SET ?",
        data,
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
              message: "Failed to save orderMaster information...",
            });
          } else {
            var recordData = [];
            for (let i = 0; i < orderDetails.length; i++) {
              var rec = [
                results.insertId,
                orderDetails[i].ITEM_ID,
                orderDetails[i].QTY,
                systemDate,
                orderDetails[i].RATE,
              ];
              recordData.push(rec);
            }
            mm.executeDML(
              `insert into order_details(ORDER_ID, ITEM_ID, QTY, CREATED_MODIFIED_DATE, RATE) values ?`,
              [recordData],
              connection,
              (error, insertDetails) => {
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
                    message: "Failed to save orderDetails information...",
                  });
                } else {
                  async.eachSeries(
                    orderDetails,
                    function iteratorOverElems(itemData, callback) {
                      let ITEM_ID = itemData.ITEM_ID,
                        QTY = itemData.QTY;
                      mm.executeDML(
                        `update item_master set CURRENT_STOCK = (CURRENT_STOCK - ?) where ID = ?`,
                        [QTY, ITEM_ID],
                        connection,
                        (error, updateStock) => {
                          if (error) {
                            callback(error);
                          } else {
                            callback();
                          }
                        }
                      );
                    },
                    function subCb(error) {
                      if (error) {
                        //rollback
                        mm.rollbackConnection(connection);
                        res.send({
                          code: 400,
                          message: "Failed to update stock details...",
                        });
                      } else {
                        mm.commitConnection(connection);
                        res.send({
                          code: 200,
                          message:
                            "orderMaster information saved successfully...",
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
    } else {
      res.send({
        code: 404,
        message: "Parameter Missing",
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

exports.updateOrder = (req, res) => {
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
  var orderDetails =
    req.body.orderDetails && req.body.orderDetails.length > 0
      ? req.body.orderDetails
      : [];

  try {
    if (orderDetails.length > 0) {
      const connection = mm.openConnection();
      mm.executeDML(
        `UPDATE ` +
          orderMaster +
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
              message: "Failed to update orderMaster information.",
            });
          } else {
            mm.executeDML(
              `select ITEM_ID, QTY from order_details where ORDER_ID = ?`,
              [criteria.ID],
              connection,
              (error, getOldData) => {
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
                    message: "Failed to update orderMaster information.",
                  });
                } else {
                  if (getOldData.length > 0) {
                    async.eachSeries(
                      getOldData,
                      function iteratorOverElems(itemData, callback) {
                        let ITEM_ID = itemData.ITEM_ID,
                          QTY = itemData.QTY;
                        mm.executeDML(
                          `update item_master set CURRENT_STOCK = (CURRENT_STOCK + ?) where ID = ?`,
                          [QTY, ITEM_ID],
                          connection,
                          (error, updateStock) => {
                            if (error) {
                              callback(error);
                            } else {
                              callback();
                            }
                          }
                        );
                      },
                      function subCb(error) {
                        if (error) {
                          //rollback
                          mm.rollbackConnection(connection);
                          res.send({
                            code: 400,
                            message: "Failed to update stock details...",
                          });
                        } else {
                          let recordData = [];
                          for (let i = 0; i < orderDetails.length; i++) {
                            var rec = [
                              criteria.ID,
                              orderDetails[i].ITEM_ID,
                              orderDetails[i].QTY,
                              systemDate,
                              orderDetails[i].RATE,
                              orderDetails[i].RETURN_STATUS,
                            ];
                            recordData.push(rec);
                          }
                          mm.executeDML(
                            `delete from order_details where ORDER_ID = ${criteria.ID}; insert into order_details(ORDER_ID,ITEM_ID,QTY,CREATED_MODIFIED_DATE, RATE, RETURN_STATUS) values ?`,
                            [recordData],
                            connection,
                            (error, insertDetails) => {
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
                                  message:
                                    "Failed to save orderDetails information...",
                                });
                              } else {
                                async.eachSeries(
                                  orderDetails,
                                  function iteratorOverElems(
                                    itemData,
                                    callback
                                  ) {
                                    let ITEM_ID = itemData.ITEM_ID,
                                      QTY = itemData.QTY;
                                    mm.executeDML(
                                      `update item_master set CURRENT_STOCK = (CURRENT_STOCK - ?) where ID = ?`,
                                      [QTY, ITEM_ID],
                                      connection,
                                      (error, updateStock) => {
                                        if (error) {
                                          callback(error);
                                        } else {
                                          callback();
                                        }
                                      }
                                    );
                                  },
                                  function subCb(error) {
                                    if (error) {
                                      mm.rollbackConnection(connection);
                                      res.send({
                                        code: 400,
                                        message:
                                          "Failed to update stock details...",
                                      });
                                    } else {
                                      mm.commitConnection(connection);
                                      res.send({
                                        code: 200,
                                        message:
                                          "orderMaster information saved successfully...",
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
                  } else {
                    mm.commitConnection(connection);
                    res.send({
                      code: 200,
                      message: "orderMaster information saved successfully...",
                    });
                  }
                }
              }
            );
          }
        }
      );
    } else {
      res.send({
        code: 404,
        message: "Parameter Missing..",
      });
    }
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

exports.returnOrder = (req, res) => {
  var data = reqData(req);
  var criteria = {
    ID: req.body.ID,
  };
  var systemDate = mm.getSystemDate();
  var setData = "";
  var recordData = [];
  data.RETURN_DATETIME = systemDate;
  data.ORDER_STATUS = "C";
  data.FINE_AMOUNT && data.FINE_AMOUNT != "" && data.FINE_AMOUNT != " "
    ? data.FINE_AMOUNT
    : 0;
  Object.keys(data).forEach((key) => {
    data[key] != null ? (setData += `${key}= ? , `) : true;
    data[key] != null ? recordData.push(data[key]) : true;
  });
  var orderDetails =
    req.body.orderDetails && req.body.orderDetails.length > 0
      ? req.body.orderDetails
      : [];

  try {
    if (orderDetails.length > 0) {
      const connection = mm.openConnection();
      mm.executeDML(
        `UPDATE ` +
          orderMaster +
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
              message: "Failed to update orderMaster information.",
            });
          } else {
            async.eachSeries(
              orderDetails,
              function iteratorOverElems(itemData, callback) {
                let ITEM_ID = itemData.ITEM_ID,
                  ID = itemData.ID,
                  RECEIVED_QTY = itemData.RECEIVED_QTY;
                mm.executeDML(
                  `update item_master set CURRENT_STOCK = (CURRENT_STOCK + ?) where ID = ?`,
                  [RECEIVED_QTY, ITEM_ID],
                  connection,
                  (error, updateStock) => {
                    if (error) {
                      callback(error);
                    } else {
                      mm.executeDML(
                        `update order_details set RECEIVED_QTY =  ? where ID = ?`,
                        [RECEIVED_QTY, ID],
                        connection,
                        (error, updateStock) => {
                          if (error) {
                            callback(error);
                          } else {
                            callback();
                          }
                        }
                      );
                    }
                  }
                );
              },
              function subCb(error) {
                if (error) {
                  //rollback
                  mm.rollbackConnection(connection);
                  res.send({
                    code: 400,
                    message: "Failed to update stock details...",
                  });
                } else {
                  let recordData = [];
                  var ORDER_STATUS = "C";
                  for (let i = 0; i < orderDetails.length; i++) {
                    var rec = [
                      criteria.ID,
                      orderDetails[i].ITEM_ID,
                      orderDetails[i].QTY,
                      orderDetails[i].RECEIVED_QTY,
                      systemDate,
                      orderDetails[i].RATE,
                      orderDetails[i].QTY > orderDetails[i].RECEIVED_QTY
                        ? "PR"
                        : "R",
                    ];
                    recordData.push(rec);
                    if (orderDetails[i].QTY > orderDetails[i].RECEIVED_QTY) {
                      ORDER_STATUS = "PR";
                    }
                  }
                  mm.executeDML(
                    `update order_master set ORDER_STATUS = ? where ID = ?`,
                    [ORDER_STATUS, criteria.ID],
                    connection,
                    (error, updateOrder) => {
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
                          message:
                            "Failed to update order status information...",
                        });
                      } else {
                        mm.executeDML(
                          `delete from order_details where ORDER_ID = ?; insert into order_details(ORDER_ID, ITEM_ID, QTY, RECEIVED_QTY, CREATED_MODIFIED_DATE, RATE, RETURN_STATUS) values ?`,
                          [criteria.ID, recordData],
                          connection,
                          (error, insertDetails) => {
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
                                message:
                                  "Failed to save orderDetails information...",
                              });
                            } else {
                              async.eachSeries(
                                orderDetails,
                                function iteratorOverElems(itemData, callback) {
                                  let ITEM_ID = itemData.ITEM_ID,
                                    QTY = itemData.QTY;
                                  mm.executeDML(
                                    `update item_master set CURRENT_STOCK = (CURRENT_STOCK - ?) where ID = ?`,
                                    [QTY, ITEM_ID],
                                    connection,
                                    (error, updateStock) => {
                                      if (error) {
                                        callback(error);
                                      } else {
                                        callback();
                                      }
                                    }
                                  );
                                },
                                function subCb(error) {
                                  if (error) {
                                    mm.rollbackConnection(connection);
                                    res.send({
                                      code: 400,
                                      message:
                                        "Failed to update stock details...",
                                    });
                                  } else {
                                    mm.commitConnection(connection);
                                    res.send({
                                      code: 200,
                                      message:
                                        "orderMaster information saved successfully...",
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
            );
          }
        }
      );
    } else {
      res.send({
        code: 404,
        message: "Parameter Missing..",
      });
    }
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
