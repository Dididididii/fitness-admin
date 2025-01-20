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

/**
 * 重置密码
 * @param {*} id number
 * @returns
 */
export function resetPasswordAPI(id) {
  return request({
    url: "/reset",
    method: "PUT",
    data: { id },
  });
}

/**
 * 修改密码
 * @param {*} data obj
 * @returns
 */
export function changPasswordAPI(data) {
  return request({
    url: "/change",
    method: "PUT",
    data,
  });
}
