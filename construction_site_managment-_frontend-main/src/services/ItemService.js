import ApiService from "./ApiService";

export async function apipostItem(data) {
  return ApiService.fetchData({
    url: "/api/item/create",
    method: "post",
    data,
  });
}

export async function apiGetAllItem(data) {
  return ApiService.fetchData({
    url: "/api/item/get",
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
// export async function apiGetUserById(data) {
//     return ApiService.fetchData({
//         url: "/api/user/getById",
//         method: "post",
//         data,
//     });
// }

export async function apiUpdateItem(data) {
  return ApiService.fetchData({
    url: "/api/item/update ",
    method: "put",
    data,
  });
}
export async function apiDeleteItem(data) {
  return ApiService.fetchData({
    url: "/api/item/delete",
    method: "post",
    data,
  });
}
