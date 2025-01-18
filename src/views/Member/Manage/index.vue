<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">会员姓名：</span>
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">会员手机号码：</span>
      <el-input v-model="params.photo" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">卡类：</span>
      <el-select v-model="params.cards">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" class="search-btn" @click="searchMember">查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="$router.push({path:'/member/add',query:{type:'add'}})">添加会员</el-button>
      <el-button>批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="userList">
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="会员名称" prop="name" />
        <el-table-column label="联系方式" prop="photo" />
        <el-table-column label="会员卡" prop="cards">
          <template #default="scope">{{ cardsObj[scope.row.cards] }}</template>
        </el-table-column>
        <el-table-column label="支付金额(元)" prop="payNum" width="100">
          <template #default="scope">{{ scope.row.payNum ? scope.row.payNum :'0' }}</template>
        </el-table-column>
        <el-table-column label="支付方式" prop="paymentMethod" width="100">
          <template #default="scope">{{ paymentObj[scope.row.paymentMethod] }}</template>
        </el-table-column>
        <el-table-column label="课程(节)" prop="course" width="100">
          <template #default="scope">{{ scope.row.course ? scope.row.course :'0' }}</template>
        </el-table-column>
        <el-table-column label="专属私教" prop="coach" width="100">
          <template #default="scope">{{ scope.row.coach ? scope.row.coach :'无' }}</template>
        </el-table-column>
        <el-table-column label="有效日期" prop="startTime">
          <template #default="scope">{{ scope.row.startTime + '至' + scope.row.endTime }}</template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button size="mini" type="text">续费</el-button>
            <el-button size="mini" type="text" @click="seeMember(scope.row.id)">查看</el-button>
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination layout="total, prev, pager, next" :total="total" :page-size="params.pageSize" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { getMemberListAPI } from '@/api/member'

export default {
  name: 'Manage',
  data() {
    return {
      options: [
        {
          value: null,
          label: '全部'
        },
        {
          value: 'day',
          label: '天卡'
        },
        {
          value: 'week',
          label: '周卡'
        },
        {
          value: 'month',
          label: '月卡'
        },
        {
          value: 'season',
          label: '季卡'
        },
        {
          value: 'halfyear',
          label: '半年卡'
        },
        {
          value: 'year',
          label: '年卡'
        },
        {
          value: 'permanent',
          label: '永久卡'
        }
      ],
      params: {
        name: null,
        photo: null,
        cards: null,
        page: 1,
        pageSize: 2
      },
      userList: [],
      total: 0,
      paymentObj: {
        Alipay: '支付宝',
        WeChat: '微信',
        Cash: '线下支付 '
      },
      cardsObj: {
        day: '天卡',
        week: '周卡',
        month: '月卡',
        season: '季卡',
        halfYear: '半年卡',
        year: '年卡',
        permanent: '永久卡'
      }
    }
  },
  created() {
    this.getMemberList()
  },
  methods: {
    // 查看
    seeMember(id) {
      this.$router.push({
        path: `/member/add`,
        query: {
          id,
          type: 'see'
        }
      })
    },
    // 查询
    searchMember() {
      this.params.page = 1
      this.getMemberList()
    },
    // 修改自定义序号
    indexMethod(index) {
      return index + 1 + (this.params.page - 1) * this.params.pageSize
    },
    // 修改页数
    handleCurrentChange(val) {
      this.params.page = val
      this.getMemberList()
    },
    // 获取会员数据
    async getMemberList() {
      const res = await getMemberListAPI(this.params)
      this.userList = res.data.rows
      this.total = res.data.total
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
