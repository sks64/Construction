const mm = require('../../utilities/globalModule');
const logger = require('../../utilities/logger')
var formMaster = "form_master";
var viewFormMaster = "view_" + formMaster;

function reqData(req) {
    var data = {
        NAME: req.body.NAME,
        PARENT_ID: req.body.PARENT_ID,
        LINK: req.body.LINK,
        ICON: req.body.ICON,
        CLIENT_ID: req.body.CLIENT_ID
    }
    return data;
}

// exports.validate = function () {
//     return [
//         body('NAME', ' parameter missing').exists(),
//         body('PARENT_ID').isInt(),
//         body('LINK', ' parameter missing').exists(),
//         body('ICON').optional(),
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

    if (pageIndex === '' && pageSize === '')
        criteria = filter + " order by " + sortKey + " " + sortValue;
    else
        criteria = filter + " order by " + sortKey + " " + sortValue + " LIMIT " + start + "," + end;

    let countCriteria = filter;

    var deviceid = req.headers['deviceid'];
    try {
        mm.executeQuery('select count(*) as cnt from ' + viewFormMaster + ' where 1 ' + countCriteria, (error, results1) => {
            if (error) {
                //console.log(error);
                res.send({
                    "code": 400,
                    "message": "Failed to get forms count...",
                });
            }
            else {
                //console.log(results1);
                mm.executeQuery('select * from ' + viewFormMaster + ' where 1 ' + criteria, (error, results) => {
                    if (error) {
                        //console.log(error);
                        res.send({
                            "code": 400,
                            "message": "Failed to get form information..."
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
        //logger.error('APIK:' + req.headers['apikey'] +' '+supportKey+ ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), req.headers['supportkey']);
        // logger.error(supportKey + ' ' + req.method + " " + req.url + ' ' + JSON.stringify(error), applicationkey, supportKey, deviceid);
        //console.log(error);
    }
}

exports.create = (req, res) => {

    var data = reqData(req);
    try {
        mm.executeQueryData('INSERT INTO ' + formMaster + ' SET ?', data, (error, results) => {
            if (error) {
                //console.log(error);
                logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
                res.send({
                    "code": 400,
                    "message": "Failed to save form information..."
                });
            }
            else {
                //console.log(results);
                logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
                res.send({
                    "code": 200,
                    "message": "Form information saved successfully...",
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
        mm.executeQueryData(`UPDATE ` + formMaster + ` SET ${setData} CREATED_MODIFIED_DATE = '${systemDate}' where ID = ${criteria.ID} `, recordData, (error, results) => {
            if (error) {
                //console.log(error);
                logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
                res.send({
                    "code": 400,
                    "message": "Failed to update form information..."
                });
            }
            else {
                //console.log(results);
                res.send({
                    "code": 200,
                    "message": "Form information updated successfully...",
                });
            }
        });
    } catch (error) {
        //console.log(error);
        logger.error(req.url, req.method, JSON.stringify(error), req.baseUrl + req.url)
    }
}

exports.getForms = (req, res) => {

    try {
        var ROLE_ID = req.body.ROLE_ID;
        //var filter = req.body.filter ? (' AND ' + req.body.filter) : ''

        if (ROLE_ID) {

            var query = `SET SESSION group_concat_max_len = 4294967290;SELECT replace(REPLACE(( CONCAT('[',GROUP_CONCAT(JSON_OBJECT('level',1,'title',m.FORM_NAME,'icon',m.ICON,'link',m.LINK,'SEQ_NO',m.SEQ_NO,'children',( IFNULL((SELECT replace(REPLACE(( CONCAT('[',GROUP_CONCAT(JSON_OBJECT('level',2,'title',FORM_NAME,'icon',ICON,'link',link,'SEQ_NO',SEQ_NO)),']')),'"[','['),']"',']') FROM view_role_details WHERE PARENT_ID = m.FORM_ID AND ROLE_ID = m.ROLE_ID  and IS_ALLOWED=1 AND SHOW_IN_MENU = 1 order by SEQ_NO ASC),'[]') )
            )),']')),'"[','['),']"',']') AS data FROM view_role_details m WHERE PARENT_ID = 0 AND ROLE_ID = ${ROLE_ID} AND IS_ALLOWED = 1 AND SHOW_IN_MENU = 1 order by SEQ_NO ASC`

            // var query = `SET SESSION group_concat_max_len = 4294967290;
            // select replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'ROLE_ID',ROLE_ID,'FORM_ID',FORM_ID,'IS_ALLOWED',IS_ALLOWED,'SEQ_NO',SEQ_NO,'PARENT_ID',PARENT_ID,'CLIENT_ID',CLIENT_ID,'FORM_NAME',FORM_NAME,'ICON',ICON,'LINK',LINK,'subforms',(IFNULL((SELECT replace(REPLACE(CONCAT('[',GROUP_CONCAT(JSON_OBJECT('ID',ID,'ROLE_ID',ROLE_ID,'FORM_ID',FORM_ID,'IS_ALLOWED',IS_ALLOWED,'SEQ_NO',SEQ_NO,'PARENT_ID',PARENT_ID,'CLIENT_ID',CLIENT_ID,'FORM_NAME',FORM_NAME,'ICON',ICON,'LINK',LINK)),']'),'"[','['),']"',']') FROM view_role_details WHERE ROLE_ID = m.ROLE_ID and  IS_ALLOWED = 1 AND PARENT_ID = m.FORM_ID   order by SEQ_NO asc),'[]'))
            // )),']'),'"[','['),']"',']') as data FROM
            // view_role_details m Where ROLE_ID = ${ROLE_ID} AND IS_ALLOWED = 1 AND PARENT_ID = 0 order by SEQ_NO asc`

            mm.executeQuery(query, (error, results) => {
                if (error) {
                    //console.log(error);
                    res.send({
                        "code": 400,
                        "message": "Failed to get Record."
                    });
                }
                else {
                    if (results.length > 0) {
                        ////console.log(results);
                        var json = results[1][0].data
                        if (json) {
                            json = json.replace(/\\/g, '');
                            json = JSON.parse(json);
                        }
                        ////console.log("res : ", json);
                        res.send({
                            "code": 200,
                            "message": "SUCCESS",
                            "data": json
                        });
                    }
                    else {
                        res.send({

                            "code": 400,
                            "message": "No Data",

                        });
                    }
                }
            });
        }
        else {
            res.send({
                "code": 400,
                "message": "Parameter missing - ROLE_ID "
            });
            return
        }
    } catch (error) {
        //console.log(error);
    }
}