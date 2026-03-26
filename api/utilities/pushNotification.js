const admin = require('./firebase');
const mm = require('../utilities/globalModule');
// const logger = require('../../utilities/logger')

exports.sendNotification = function (titleData, bodyData, senderId, receiverId) {

    mm.executeQueryData(`select CLOUD_ID from employee_master where ID = ? AND CLOUD_ID is not null;`, [receiverId], (error, selectCloudId) => {
        if (error) {
            console.log(error);
        }
        else {
            if (selectCloudId.length > 0 && selectCloudId[0].CLOUD_ID && selectCloudId[0].CLOUD_ID != ' ') {
                const registrationToken = selectCloudId[0].CLOUD_ID;

                const message = {
                    notification: {
                        title: titleData,
                        body: bodyData,
                    },
                    token: registrationToken,
                };

                admin.messaging().send(message).then((response) => {
                    console.log('Successfully sent message:', response);
                }).catch((error) => {
                    console.log('Error sending message:', error);
                });
            }
            else {
                console.log("cloud Id not found");
            }
        }
    })
}