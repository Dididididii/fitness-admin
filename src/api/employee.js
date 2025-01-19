import request from "@/utils/request";

/**
 *  获取员工列表
 * @param {*} params obj
 * @returns
 */
export const getEmployeeListAPI = (params) => {
  return request({
    url: "/employee",
    params,
  });
};

/**
 * 添加员工
 * @param {*} data object
 * @returns
 */
export const addEmployeeAPI = (data) => {
  return request({
    url: "/employee/add",
    method: "post",
    data,
  });
};

/**
 * 修改员工
 * @param {*} data obj
 * @returns
 */
export const updateEmployeeAPI = (data) => {
  return request({
    url: "/employee/edit",
    method: "put",
    data,
  });
};

/**
 * 删除员工
 * @param {*} id number
 * @returns
 */
export const delEmployeeAPI = (id) => {
  return request({
    url: `/employee/del?id=${id}`,
    method: "delete",
  });
};
