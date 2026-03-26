import ApiService from "./ApiService";

export async function apipostCustomer(data) {
  return ApiService.fetchData({
    url: "/api/customer/create",
    method: "post",
    data,
  });
}

export async function apiGetAllCustomer(data) {
  return ApiService.fetchData({
    url: "/api/customer/get",
    method: "post",
    data,
  });
}

export async function apiGetCustomerById(data) {
  return ApiService.fetchData({
    url: "/api/customer/getById",
    method: "post",
    data,
  });
}
export async function apiGetAllOrder(data) {
  // //console.log("params", data);
  return ApiService.fetchData({
    url: "/api/order/get",
    method: "post",
    data,
  });
}
export async function apiGetPaymentDetails(data) {
  // //console.log("params", data);
  return ApiService.fetchData({
    url: "/api/orderPaymentDetails/get",
    method: "post",
    data,
  });
}

export async function apiGetAddPaymentDetails(data) {
  // //console.log("params", data);
  return ApiService.fetchData({
    url: "/api/orderPaymentDetails/makePayment",
    method: "post",
    data,
  });
}
export async function apiputCustomer(data) {
  return ApiService.fetchData({
    url: "/api/customer/update",
    method: "put",
    data,
  });
}

export async function apiDeleteCustomer(data) {
  return ApiService.fetchData({
    url: "/api/customer/delete",
    method: "delete",
    data,
  });
}
