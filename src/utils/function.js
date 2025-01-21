// 修改自定义序号
function indexMethod(index) {
  return index + 1 + (this.params.page - 1) * this.params.pageSize;
}

export default { indexMethod };
