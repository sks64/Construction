import ApiService from "./ApiService";

export async function apiLogin(data) {
    return ApiService.fetchData({
        url: "/user/websitelogin",
        method: "post",
        data,
        headers: {
            "Content-Type": "application/json",
        },
    });
}

export async function apiLogout(data) {
    return ApiService.fetchData({
        url: "/api/user/logoutWebsite",
        method: "post",
        data,
        headers: {
            "Content-Type": "application/json",
        },
    });
}

