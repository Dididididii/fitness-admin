import request from "@/utils/request";

/**
 * 获取会员列表
 * @param {*} params  obj
 * @returns
 */
export const getMemberListAPI = (params) => {
  return request({
    url: "/member",
    method: "get",
    params,
  });
};

export const addMemberAPI = (data) => {
  return request({
    url: "/member/add",
    method: "post",
    data,
  });
};
