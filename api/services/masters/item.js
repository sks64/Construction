const mm = require("../../utilities/globalModule");
const logger = require("../../utilities/logger");

var itemMaster = "item_master";
var viewItemMaster = itemMaster;

function reqData(req) {
  var data = {
    NAME: req.body.NAME,
    CURRENT_STOCK: req.body.CURRENT_STOCK,
    STATUS: req.body.STATUS ? 1 : 0,
    CREATED_MODIFIED_DATE: req.body.CREATED_MODIFIED_DATE,
    CATEGORY_ID: req.body.CATEGORY_ID,
    SALE_RATE: req.body.SALE_RATE,
    RENT_RATE: req.body.RENT_RATE,
    GST_PERCENT: req.body.GST_PERCENT,
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
  var SEARCH_FILTER = req.body.SEARCH_FILTER;
  req.body.CATEGORY_ID && req.body.CATEGORY_ID.length > 0
    ? (filter += ` AND CATEGORY_ID IN(${req.body.CATEGORY_ID})`)
    : "";
  req.body.SEARCH_FILTER && req.body.SEARCH_FILTER != " "
    ? (filter += ` AND (NAME LIKE '%${SEARCH_FILTER}%' OR CATEGORY_NAME LIKE '%${SEARCH_FILTER}%')`)
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
        viewItemMaster +
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
            message: "Failed to get viewItemMaster count.",
          });
        } else {
          //console.log(results1);
          mm.executeQuery(
            "select * from " + viewItemMaster + " where 1 " + criteria,
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
                  message: "Failed to get viewItemMaster information.",
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
    data.CREATED_MODIFIED_DATE = mm.getSystemDate();
    mm.executeQueryData(
      "INSERT INTO " + itemMaster + " SET ?",
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
            message: "Failed to save itemMaster information: " + error.sqlMessage,
            error: error
          });
        } else {
          //console.log(results);
          res.send({
            code: 200,
            message: "itemMaster information saved successfully...",
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
        itemMaster +
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
            message: "Failed to update itemMaster information: " + (error.sqlMessage || error.message),
          });
        } else {
          //console.log(results);
          res.send({
            code: 200,
            message: "itemMaster information updated successfully...",
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
