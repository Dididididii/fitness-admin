import request from "@/utils/request";

/**
 * 会员签到
 * @param {*} data obj
 * @returns
 */
export const memberSignInAPI = (data) => {
  return request({
    url: "/clocking/signin",
    method: "post",
    data,
  });
};

/**
 * 获取签到列表
 * @param {*} params object
 * @returns
 */
export const getSignInListAPI = (params) => {
  return request({
    url: "/clocking/signin",
    params,
  });
};

/**
 * 获取员工打卡列表
 * @param {*} params
 * @returns
 */
export const getClockInListAPI = (params) => {
  return request({
    url: "/clocking/clockin",
    params,
  });
};

/**
 * 打卡上班
 * @param {*} clockingTime string
 * @returns
 */
export const addClockInAPI = (clockingTime) => {
  return request({
    url: "/clocking/clockin",
    method: "post",
    data: { clockingTime },
  });
};

/**
 * 打卡下班
 * @param {*} checkOutTime string
 * @returns
 */
export const clockOutAPI = (checkOutTime) => {
  return request({
    url: "/clocking/clockout",
    method: "put",
    data: { checkOutTime },
  });
};
