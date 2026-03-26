import ApiService from "./ApiService";

export async function apiGetAllOrder(data) {
  // //console.log("params", data);
  return ApiService.fetchData({
    url: "/api/order/get",
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
export async function apiGetPaymentDetails(data) {
  // //console.log("params", data);
  return ApiService.fetchData({
    url: "/api/orderPaymentDetails/get",
    method: "post",
    data,
  });
}

export async function apipostOrder(data) {
  return ApiService.fetchData({
    url: "/api/order/createOrder",
    method: "post",
    data,
  });
}

export async function apiputOrder(data) {
  return ApiService.fetchData({
    url: "/api/order/updateOrder",
    method: "post",
    data,
  });
}
export async function apiOrderReturn(data) {
  return ApiService.fetchData({
    url: "/api/order/returnOrder",
    method: "post",
    data,
  });
}

export async function apigetGstType(data) {
  return ApiService.fetchData({
    url: "/api/gstType/get",
    method: "post",
    data,
  });
}

export async function apiGetItem(data) {
  return ApiService.fetchData({
    url: "/api/item/get",
    method: "post",
    data,
  });
}

export async function apiGetCustomer(data) {
  return ApiService.fetchData({
    url: "/api/customer/getCustomers",
    method: "post",
    data,
  });
}
export async function apiGetAllOrderdetails(data) {
  return ApiService.fetchData({
    url: "/api/orderDetails/get",
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
