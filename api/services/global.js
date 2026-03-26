const jwt = require("jsonwebtoken");
const mm = require("../utilities/globalModule");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
var mime = require("mime");

exports.checkAuthorization = function (req, res, next) {
  try {
    var apikey = req.headers["apikey"];
    if (process.env.APIKEY == apikey) {
      next();
    } else {
      res.send({
        code: 401,
        message: "UnAutorizedddsss User.",
      });
    }
  } catch (error) {
    //console.log(error);
  }
};

exports.uploadAttachment = function (req, res) {
  fs.rename(
    req.files.Image.path,
    "uploads/Attachments/" + req.files.Image.name,
    (error, result) => {
      if (error) res.send(error);
      else
        res.send({
          code: 200,
          message: "uploaded",
        });
    }
  );
};

exports.checkToken = function (req, res, next) {
  try {
    if (req.headers["token"]) {
      jwt.verify(
        req.headers["token"],
        process.env.SECRET,
        (error, authD4333ata) => {
          if (error) {
            //console.log('error', error);
            res.send({
              code: 403,
              message: "Wrong Token.",
            });
          } else {
            //console.log('USER_ID:', authD4333ata.data.USER_ID);
            next();
          }
        }
      );
    } else {
      res.send({
        code: 403,
        message: "No Token Provided.",
      });
    }
  } catch (error) {
    //console.log(error);
  }
  // next();
};
// exports.checkToken = function (req, res, next) {
//   try {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(" ")[1];

//     if (token) {
//       jwt.verify(token, process.env.SECRET, (error, decodedData) => {
//         if (error) {
//           return res.status(403).json({
//             code: 403,
//             message: "Invalid or Expired Token.",
//           });
//         } else {
//           req.user = decodedData;
//           next();
//         }
//       });
//     } else {
//       return res.status(403).json({
//         code: 403,
//         message: "No Token Provided.",
//       });
//     }
//   } catch (err) {
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

exports.employeeProfile = function (req, res) {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldPath = files.Image.filepath;
      var newPath =
        path.join(__dirname, "../uploads/employeeProfile") +
        "/" +
        files.Image.originalFilename;
      var rawData = fs.readFileSync(oldPath);

      fs.writeFile(newPath, rawData, function (err) {
        if (!err) {
          console.log("uploaded successfully..");
          res.send({
            code: 200,
            message: "success",
          });
        } else {
          res.send({
            code: 400,
            message: "failed to upload..",
          });
        }
      });
    });
  } catch (err) {
    //console.log(err);
  }
};

exports.orgLogo = function (req, res) {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldPath = files.Image.filepath;
      var newPath =
        path.join(__dirname, "../uploads/orgLogo") +
        "/" +
        files.Image.originalFilename;
      var rawData = fs.readFileSync(oldPath);

      fs.writeFile(newPath, rawData, function (err) {
        if (!err) {
          //console.log('uploaded successfully..');
          res.send({
            code: 200,
            message: "success",
          });
        } else {
          res.send({
            code: 400,
            message: "failed to upload..",
          });
        }
      });
    });
  } catch (err) {
    //console.log(err);
  }
};

exports.uploadFiles = function (req, res) {
  var folderName = req.params["folderName"];
  var form = new formidable.IncomingForm();
  var pathName = path.join(__dirname, "../uploads/", folderName, "/");
  form.parse(req, function (err, fields, files) {
    var oldPath = files.Image.filepath;
    var newPath = pathName + files.Image.originalFilename;
    var rawData = fs.readFileSync(oldPath);
    fs.writeFile(newPath, rawData, function (err) {
      if (err) {
        //console.log(err);
        res.send({
          code: 400,
          message: "failed to upload ",
        });
      } else {
        res.send({
          code: 200,
          message: "uploaded",
        });
      }
    });
  });
};

exports.removeFile = function (req, res) {
  // var fileUrl = `/uploads/` + req.body.FILE_URL;
  var fileUrl = path.join(__dirname, "../uploads/" + req.body.FILE_URL);
  try {
    if (req.body.FILE_URL && req.body.FILE_URL != "") {
      fs.unlink(fileUrl, (err) => {
        if (err) {
          console.error(err);
          res.send({
            code: 400,
            message: "fail to delete file.",
          });
        } else {
          res.send({
            code: 200,
            message: "file delete successful.",
          });
        }
      });
    } else {
      res.send({
        code: 404,
        message: "fileUrl missing.",
      });
    }
  } catch (err) {
    //console.log(err);
  }
};
