<template>
  <div class="card-container">
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="signinList">
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="会员名称" prop="name" />
        <el-table-column label="联系方式" prop="photo" />
        <el-table-column label="签到时间" prop="time" />
        <el-table-column label="会员卡" prop="cards">
          <template #default="scope">{{ cardsObj[scope.row.cards] }}</template>
        </el-table-column>
        <el-table-column label="私教课(节)" prop="course" />
        <el-table-column label="私教" prop="coach" />
        <el-table-column label="剩余有效天数(天)" prop="residue" />
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination layout="total, prev, pager, next" :total="total" :page-size="params.pageSize" @current-change="currentChange" />
    </div>
  </div>
</template>

<script>
import { getSignInListAPI } from '@/api/clock.js'

export default {
  data() {
    return {
      cardsObj: {
        day: '天卡',
        week: '周卡',
        month: '月卡',
        season: '季卡',
        halfYear: '半年卡',
        year: '年卡',
        permanent: '永久卡'
      },
      signinList: [],
      total: 0,
      params: {
        page: 1,
        pageSize: 5
      }
    }
  },
  created() {
    this.getSignInList()
  },
  methods: {
    // 切换分页
    currentChange(val) {
      this.params.page = val
      this.getSignInList()
    },
    // 获取会员签到列表
    async getSignInList() {
      const res = await getSignInListAPI(this.params)
      this.signinList = res.data.rows
      this.total = res.data.total
    },
    // 修改自定义序号
    indexMethod(index) {
      return index + 1 + (this.params.page - 1) * this.params.pageSize
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
