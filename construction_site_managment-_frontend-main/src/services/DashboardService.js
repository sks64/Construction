import ApiService from "./ApiService";

export async function apiGetAllDashboardCount(data) {
  return ApiService.fetchData({
    url: "/api/reports/getDashboardSummaryReport",
    method: "post",
    data,
  });
}
export async function apigetOrderDatewiseReport(data) {
  return ApiService.fetchData({
    url: "/api/reports/getOrderDatewiseReport",
    method: "post",
    data,
  });
}
export async function apigettopsellingitems(data) {
  return ApiService.fetchData({
    url: "/api/reports/topFiveSalingitem",
    method: "post",
    data,
  });
}
export async function apigettopfivecustomers(data) {
  return ApiService.fetchData({
    url: "/api/reports/topFiveCustomers",
    method: "post",
    data,
  });
}
export async function apigetDashboardSaleReport(data) {
  return ApiService.fetchData({
    url: "/api/reports/getDashboardSaleReport",
    method: "post",
    data,
  });
}
