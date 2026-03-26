import { useEffect, useState } from "react";

import axios from "axios";
import BaseService from "../../../services/BaseService";

const phot_url = BaseService.defaults.baseURL;

const UploadImage = async (file, endpoint, label) => {
  // setGobalLabel(label);

  ////console.log("file", file);

  // Generate the formatted date and time string
  const now = new Date();
  const formattedDate = `${String(now.getFullYear()).slice(-2)}${String(
    now.getMonth() + 1
  ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(
    now.getHours()
  ).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(
    now.getSeconds()
  ).padStart(2, "0")}${String(Math.floor(now.getMilliseconds() / 10)).padStart(
    2,
    "0"
  )}`;

  // Get the file extension from the original file
  const fileExtension = file.name.split(".").pop();

  // Combine the formatted date and time string with the file extension
  const newFilename = `${formattedDate}.${fileExtension}`;

  // Create FormData and append the new filename
  const formData = new FormData();
  formData.append("Image", file, newFilename);

  const config = {
    headers: {
      apikey: "hjh4653dsiivy457468asdfe",
      token: localStorage.getItem("user"),
    },
  };

  try {
    const response = await axios.post(
      `${phot_url}/upload/employeeProfile`,
      formData,
      config
    );

    if (response.status === 200) {
      if (response.data.code === 200) {
        ////console.log('Successful img upload..');
        return newFilename; // Return the new filename here
      } else {
        ////console.log('error img upload..');
        return false;
      }
    } else {
      ////console.log('error img upload..');
      return false;
    }
  } catch (error) {
    ////console.log('error img upload..');
    return false;
  }
};

export default UploadImage;
