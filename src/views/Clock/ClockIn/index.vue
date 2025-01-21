<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div v-if="superShow" class="search-container">
      <span class="search-label">员工姓名：</span>
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" />
      <el-button type="primary" class="search-btn">查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="clockIn">打卡上班</el-button>
      <el-button @click="clockOut">签退下班</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="clockInList">
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="员工姓名" prop="name" />
        <el-table-column label="上班时间" prop="clockingTime" />
        <el-table-column label="下班时间" prop="checkOutTime" />
        <el-table-column label="状态" prop="status">
          <template #default="scope">{{ clockStatus[scope.row.status] }}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination layout="total, prev, pager, next" :total="total" :page-size="params.pageSize" @current-change="currentChange" />
    </div>
  </div>
</template>

<script>
import { getClockInListAPI, addClockInAPI, clockOutAPI } from '@/api/clock'
import moment from 'moment'

export default {
  data() {
    return {
      superShow: false,
      addForm: {
        name: '',
        floors: '',
        area: '',
        propertyFeePrice: ''
      },
      addFormRules: {},
      dialogVisible: false,
      clockStatus: ['正常', '迟到', '早退', '迟到早退 '],
      clockInList: [],
      params: {
        page: 1,
        pageSize: 2,
        name: null
      },
      total: 0
    }
  },
  created() {
    this.getClockInList()
  },
  methods: {
    // 签退
    async clockOut() {
      const formattedTime = moment().format('YYYY-MM-DD HH:mm:ss')
      await clockOutAPI(formattedTime)
      this.$message.success('签退成功')
      this.getClockInList()
    },
    // 修改自定义序号
    indexMethod(index) {
      return index + 1 + (this.params.page - 1) * this.params.pageSize
    },
    // 点击分页
    currentChange(val) {
      this.params.page = val
      this.getClockInList()
    },
    // 打卡上班
    async clockIn() {
      // clockingTime格式是yyyy-MM-dd HH:mm:ss
      // await addClockInAPI()
      const formattedTime = moment().format('YYYY-MM-DD HH:mm:ss')
      await addClockInAPI(formattedTime)
      this.$message.success('打卡成功')
      this.getClockInList()
      // console.log(formattedTime)
    },
    // 获取打卡列表
    async getClockInList() {
      const res = await getClockInListAPI(this.params)
      this.clockInList = res.data.rows
      this.total = res.data.total
      this.superShow = res.data.super
    }
  }
}
</script>

  <style lang="scss" scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
  padding-bottom: 20px;
  .search-main {
    width: 220px;
    margin-right: 10px;
  }
  .search-btn {
    margin-left: 20px;
  }
}
.create-container {
  margin: 10px 0px;
}
.page-container {
  padding: 4px 0px;
  text-align: right;
}
.form-container {
  padding: 0px 80px;
}
</style>
