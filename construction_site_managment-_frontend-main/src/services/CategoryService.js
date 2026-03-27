import ApiService from "./ApiService";
export async function apipostCategory(data) {
    return ApiService.fetchData({
        url: "/api/category/create",
        method: "post",
        data,
    });
}

export async function apiGetAllCategory(data) {
    return ApiService.fetchData({
        url: "/api/category/get",
        method: "post",
        data,
    });
}


export async function apiUpdateCategory(data) {
    return ApiService.fetchData({
        url: "/api/category/update",
        method: "put",
        data,
    });
}


export async function apiDeleteCategory(data) {
    return ApiService.fetchData({
        url: "/api/category/delete",
        method: "post",
        data,
    });
}

