import ApiService from "./ApiService";





export async function apipostUser(data) {
    return ApiService.fetchData({
        url: "/api/user/create",
        method: "post",
        data,
    });
}

export async function apiGetAllUser(data) {
    return ApiService.fetchData({
        url: "/api/user/get",
        method: "post",
        data,
    });
}

export async function apiGetUserById(data) {
    return ApiService.fetchData({
        url: "/api/user/getById",
        method: "post",
        data,
    });
}

export async function apiUpdateUser(data) {
    return ApiService.fetchData({
        url: "/api/user/update",
        method: "put",
        data,
    });
}

export async function apiDeleteUser(data) {
    return ApiService.fetchData({
        url: "/api/user/delete",
        method: "delete",
        data,
    });
}
