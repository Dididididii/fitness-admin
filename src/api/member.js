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

/**
 * 获取会员详情
 * @param {*} id  number
 * @returns
 */
export const getMemberAPI = (id) => {
  return request(`/member?id=${id}`);
};

/**
 * 修改会员详情
 * @param {*} data  obj
 * @returns
 */
export const updtaMemberAPI = (data) => {
  return request({
    url: "/member/edit",
    method: "put",
    data,
  });
};

/**
 * 删除/批量删除会员
 * @param {*} id array or number
 * @returns
 */
export const delMemberAPI = (id) => {
  return request({
    url: "/member/del",
    method: "delete",
    data: { id },
  });
};

export const renewMemberAPI = (data) => {
  return request({
    url: "/member/renew",
    method: "put",
    data,
  });
};
