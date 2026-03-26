import ApiService from "./ApiService";

export async function apiGetOverDueOrders(data) {
  return ApiService.fetchData({
    url: "/api/reports/getOverDueOrders",
    method: "post",
    data,
  });
}

export async function apiGetCustomer() {
  return ApiService.fetchData({
    url: "/api/customer/get",
    method: "post",
  });
}

export async function apiGetOrderPaymentSummary() {
  return ApiService.fetchData({
    url: "/api/reports/getOrderPaymentSummary",
    method: "post",
  });
}
