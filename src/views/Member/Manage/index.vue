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
      <el-button @click="selectDel">批量删除</el-button>
      <el-button type="success" @click="exportToExcel">导出execl</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="userList" @selection-change="selectionChange">
        <el-table-column type="selection" width="55" />
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
            <el-button size="mini" type="text" @click="signIn(scope.row)">签到</el-button>
            <el-button size="mini" type="text" @click="renewCards(scope.row)">续费</el-button>
            <el-button size="mini" type="text" @click="seeMember(scope.row.id)">查看</el-button>
            <el-button size="mini" type="text" @click="editMember(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="delMember(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="page-container">
      <el-pagination layout="total, prev, pager, next" :total="total" :page-size="params.pageSize" @current-change="handleCurrentChange" />
    </div>
    <!-- 续费弹出窗 -->
    <el-dialog title="续费会员卡" :visible.sync="dialogFormVisible" width="30%" center>
      <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="续费时间" prop="timeDate">
          <el-date-picker
            v-model="ruleForm.timeDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="支付金额" prop="payNum">
          <el-input v-model="ruleForm.payNum" />
        </el-form-item>
        <el-form-item label="支付方式" prop="paymentMethod">
          <el-select v-model="ruleForm.paymentMethod">
            <el-option v-for="item in payOptions" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitRenew">提交</el-button>
          <el-button @click="resetRenew">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getMemberListAPI, delMemberAPI, renewMemberAPI, getAllMembersList } from '@/api/member'
import { memberSignInAPI } from '@/api/clock'
import { utils, writeFileXLSX } from 'xlsx'

export default {
  name: 'Manage',
  data() {
    return {
      // 续费 表单
      ruleForm: {
        timeDate: '',
        payNum: '',
        paymentMethod: ''
      },
      dialogFormVisible: false,
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
      },
      selectList: [],
      payOptions: [
        {
          value: 'Alipay',
          label: '支付宝'
        },
        {
          value: 'WeChat',
          label: '微信'
        },
        {
          value: 'Cash',
          label: '线下支付'
        }
      ],
      rules: {
        timeDate: [{ required: true, type: 'array', message: '请选择续费时间', trigger: 'change' }],
        payNum: [
          { required: true, type: 'string', message: '请填写支付金额', trigger: 'blur' },
          { pattern: /^\d+(\.\d{1,2})?$/, message: '支付金额格式不对' }
        ],
        paymentMethod: [{ required: true, message: '请选择支付方式', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getMemberList()
  },
  methods: {
    // 计算两个时间之间的时间差 多少天时分秒
    daysRemaining(startTime, endTime) {
      const endDate = endTime
      const startDate = startTime

      const diff = endDate - startDate
      // console.log(diff)

      return diff > 0 ? Math.floor(diff / (1000 * 60 * 60 * 24)) : 0
    },
    // 时间戳转换
    format(dataString) {
      // dataString是整数，否则要parseInt转换
      var time = new Date(dataString)
      var year = time.getFullYear()
      var month = time.getMonth() + 1
      var day = time.getDate()
      var hour = time.getHours()
      var minute = time.getMinutes()
      var second = time.getSeconds()
      return (
        year +
        '-' +
        (month < 10 ? '0' + month : month) +
        '-' +
        (day < 10 ? '0' + day : day) +
        ' ' +
        (hour < 10 ? '0' + hour : hour) +
        ':' +
        (minute < 10 ? '0' + minute : minute) +
        ':' +
        (second < 10 ? '0' + second : second)
      )
    },
    // 签到
    signIn(row) {
      const data = row
      data.time = this.format(new Date().getTime())
      const startTime = new Date(data.startTime).getTime()
      const endTime = new Date(data.endTime).getTime()
      const time = this.daysRemaining(startTime, endTime)
      data.residue = `${time > 10 ? time : '0' + time}`
      delete data.startTime
      delete data.endTime
      delete data.identityCard
      delete data.payNum
      delete data.paymentMethod
      this.$confirm('此会员是否已到店内?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await memberSignInAPI(data)
        this.$message({
          type: 'success',
          message: '签到成功!'
        })
      })
    },
    // 导出execl
    async exportToExcel() {
      // 获取要导出的业务数据
      const res = await getAllMembersList()
      // 表头英文字段key
      const tableHeaderKeys = ['name', 'photo', 'cards', 'payNum', 'paymentMethod', 'course', 'coach', 'timeDate']
      // 表头中文字段value
      const tableHeaderValues = ['会员名称', '联系号码', '会员卡', '支付金额(元)', '支付方式', '会员课', '专属私教', '有效日期']
      // 以excel表格的顺序调整后端数据
      const sheetData = res.data.map(item => {
        const obj = {}
        tableHeaderKeys.forEach(key => {
          if (key === 'timeDate') {
            item[key] = `${item.startTime}至${item.endTime}`
            obj[key] = item[key]
          }
          if (key === 'cards') {
            item[key] = this.cardsObj[item[key]]
            obj[key] = item[key]
          }
          if (key === 'paymentMethod') {
            item[key] = this.paymentObj[item[key]]
            obj[key] = item[key]
          }
          obj[key] = item[key]
        })
        return obj
      })
      // 创建一个工作表
      const worksheet = utils.json_to_sheet(sheetData)
      // 创建一个新的工作簿
      const workbook = utils.book_new()
      // 把工作表添加到工作簿
      utils.book_append_sheet(workbook, worksheet, 'Data')
      // 改写表头
      utils.sheet_add_aoa(worksheet, [tableHeaderValues], { origin: 'A1' })
      writeFileXLSX(workbook, 'memberInfo.xlsx')
    },
    // 重置续费
    resetRenew() {
      this.ruleForm = { timeDate: '', payNum: '', paymentMethod: '' }
      this.$refs.ruleForm.resetFields()
    },
    // 提交续费
    submitRenew() {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return
        // 通过校验
        const obj = {
          ...this.ruleForm,
          startTime: this.ruleForm.timeDate[0],
          endTime: this.ruleForm.timeDate[1]
        }
        delete obj.timeDate
        await renewMemberAPI(obj)
        this.$message.success('续费成功.')
        this.dialogFormVisible = false
        this.getMemberList()
      })
    },
    // 续费
    renewCards(row) {
      this.dialogFormVisible = true
      this.ruleForm = {
        id: row.id,
        timeDate: [row.startTime, row.endTime],
        payNum: row.payNum,
        paymentMethod: row.paymentMethod
      }
    },
    // 批量删除
    selectDel() {
      if (this.selection.length === 0) {
        this.$message.error('请先选择需要删除的会员')
        return
      }
      this.$confirm('确认删除所选会员吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delMemberAPI(this.selection)
        this.$message.success('删除成功')
        this.getMemberList()
      })
    },
    // 选择
    selectionChange(selection) {
      this.selection = selection.map(obj => obj.id)
    },
    // 删除
    async delMember(id) {
      this.$confirm('确认删除所选会员吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delMemberAPI(id)
        this.$message.success('删除成功')
        this.getMemberList()
      })
    },
    // 编辑
    editMember(id) {
      this.$router.push({
        path: `/member/add`,
        query: {
          id,
          type: 'edit'
        }
      })
    },
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
