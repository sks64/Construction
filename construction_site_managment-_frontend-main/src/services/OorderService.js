import ApiService from "./ApiService";

export async function apiGetAllOrder(data) {
  return ApiService.fetchData({
    url: "/api/order/get",
    method: "post",
    data,
  });
}

export async function apiPostOrder(data) {
  return ApiService.fetchData({
    url: "/api/order/updateOrder",
    method: "post",
    data,
  });
}

export async function apiPutOrder(data) {
  return ApiService.fetchData({
    url: "/api/order/update",
    method: "put",
    data,
  });
}

export async function apiGetAllOrderDetails(data) {
  return ApiService.fetchData({
    url: "/api/orderDetails/get",
    method: "post",
    data,
  });
}

export async function apiGetDistributor(data) {
  return ApiService.fetchData({
    url: "/api/distributor/get",
    method: "post",
    data,
  });
}

export async function apiGetItemData(data) {
  return ApiService.fetchData({
    url: "/api/item/getItemData",
    method: "post",
    data,
  });
}

export async function apiDispatchOrder(data) {
  return ApiService.fetchData({
    url: "/api/order/dispatchOrder",
    method: "post",
    data,
  });
}
