import request from "@/utils/request";

// 登录函数
/**
 * @description: 登录函数
 * @param {*} data { mobile,password}
 * @return {*} promise
 */
export function loginAPI(data) {
  return request({
    url: "/login",
    method: "POST",
    data,
  });
}
