import axios from "axios";
// import appConfig from '../configs/app.config'
// import { TOKEN_TYPE, REQUEST_HEADER_AUTH_KEY } from '../constants/api.constant'
// import { PERSIST_STORE_NAME } from '../constants/app.constant'
// import { onSignOutSuccess } from '../store/auth/sessionSlice'

const unauthorizedCode = [401];

const BaseService = axios.create({
  timeout: 60000,
  //baseURL: "https://construction.brothers.net.in",
  baseURL: "http://localhost:1124",
  //baseURL: "https://construction-pwv2.onrender.com",
  // baseURL: "https://08ab-2401-4900-1c2d-210c-d571-8f77-2bdb-2aea.ngrok-free.app",
});

BaseService.interceptors.request.use(
  (config) => {
    const rawPersistData = localStorage.getItem("token");
    // ////console.log("rawPersistData", rawPersistData);

    // ////console.log("persistData", rawPersistData);

    let accessToken = rawPersistData ? rawPersistData : null;

    // ////console.log(accessToken);
    // if (accessToken) {
    config.headers["token"] = `${accessToken}`;
    // }
    config.headers["apikey"] = "hGt3@168Gds54nKh9LnopFvbhT7InhF5uX5Bi";
    config.headers["Content-Type"] = "application/json";

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

BaseService.interceptors.response.use(
  (response) => {
    if (response.data.code === 403) {
      localStorage.removeItem("UserData");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    ////console.log(response.data);
    return response;
  },
  (error) => {
    const { response } = error;

    // if (response && unauthorizedCode.includes(response.status)) {
    //   store.dispatch(onSignOutSuccess());
    // }

    return Promise.reject(error);
  }
);

export default BaseService;
