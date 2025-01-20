<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">员工姓名：</span>
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">手机号码：</span>
      <el-input v-model="params.photo" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">状态：</span>
      <el-select v-model="params.employeeClass">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" class="search-btn" @click="searchManage">查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="dialogVisible = true">添加员工</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="employeeList">
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="员工名称" prop="name" />
        <el-table-column label="联系方式" prop="photo" />
        <el-table-column label="身份证号码" prop="identificationCard" />
        <el-table-column label="登录账号" prop="login" />
        <el-table-column label="工种" prop="employeeClass">
          <template #default="scope">{{ classList[scope.row.employeeClass] }}</template>
        </el-table-column>
        <el-table-column label="员工业绩" prop="performance" />
        <el-table-column label="入职时间" prop="entryTime" />
        <el-table-column label="离职时间" prop="endTime" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button size="mini" type="text" @click="editEmployee(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="delEmployee(scope.row.id)">删除</el-button>
            <el-button size="mini" type="text" @click="resetPassword(scope.row.id)">重置密码</el-button>
            <el-button size="mini" type="text" @click="openChangePass(scope.row.id)">修改密码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination layout="total, prev, pager, next" :total="total" :page-size="params.pageSize" @current-change="currentChange" />
    </div>
    <!-- 添加员工 -->
    <el-dialog :title="addForm.id ? '编辑员工':'添加员工'" width="580px" :visible.sync="dialogVisible" @close="resetForm">
      <!-- 表单接口 -->
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addFormRules">
          <el-form-item label="员工名称" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="联系方式" prop="photo">
            <el-input v-model="addForm.photo" />
          </el-form-item>
          <el-form-item label="身份证号码" prop="identificationCard">
            <el-input v-model="addForm.identificationCard" />
          </el-form-item>
          <el-form-item label="登录账号" prop="login">
            <el-input v-model="addForm.login" />
            <!-- <br /> -->
          </el-form-item>
          <span style="color:red;">* 登录密码默认为123456</span>
          <el-form-item label="员工分类" prop="employeeClass" style="margin-top: 20px;">
            <el-select v-model="addForm.employeeClass">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="入职时间" prop="entryTime">
            <el-date-picker v-model="addForm.entryTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="离职时间" prop="endTime">
            <el-date-picker v-model="addForm.endTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="绩效" prop="performance">
            <el-input v-model="addForm.performance" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="resetForm">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>
    <!-- 修改密码 -->
    <el-dialog title="修改密码" :visible.sync="outerVisible" width="30%" center>
      <el-form ref="changeForm" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" type="password" autocomplete="off" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input v-model="ruleForm.checkPassword" type="password" autocomplete="off" show-password />
        </el-form-item>
        <el-form-item>
          <span>
            <el-button @click="resetChangeForm">取 消</el-button>
            <el-button type="primary" @click="submitChange">确 定</el-button>
          </span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { resetPasswordAPI, changPasswordAPI } from '@/api/user'
import { getEmployeeListAPI, addEmployeeAPI, updateEmployeeAPI, delEmployeeAPI } from '@/api/employee'

export default {
  data() {
    return {
      ruleForm: {
        id: '',
        password: '',
        checkPassword: ''
      },
      rules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' },
          { validator: this.validatePass, trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' },
          { validator: this.validatePass2, trigger: 'blur' }
        ]
      },
      outerVisible: false,
      addForm: {
        name: '',
        photo: '',
        identificationCard: '',
        employeeClass: '',
        entryTime: '',
        endTime: '',
        performance: '0',
        login: ''
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入员工名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        photo: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '手机号码格式不对' }
        ],
        employeeClass: [{ required: true, message: '请选择员工分类', trigger: 'change' }],
        entryTime: [{ type: 'string', required: true, message: '请选择入职日期', trigger: 'change' }],
        identificationCard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
        login: [{ required: true, message: '请输入登录账号', trigger: 'blur' }]
      },
      dialogVisible: false,
      options: [
        {
          value: null,
          label: '全部'
        },
        {
          value: 'temporarily',
          label: '临时员工'
        },
        {
          value: 'formal',
          label: '正式员工'
        },
        {
          value: 'dimission',
          label: '离职员工'
        },
        {
          value: 'coach',
          label: '教练'
        }
      ],
      employeeList: [],
      total: 0,
      params: {
        page: 1,
        pageSize: 2,
        name: null,
        photo: null,
        employeeClass: null
      },
      classList: {
        temporarily: '临时',
        formal: '正式',
        dimission: '离职',
        coach: '教练'
      }
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    // 确认修改
    submitChange() {
      this.$refs.changeForm.validate(async valid => {
        if (!valid) return
        // 校验通过
        const obj = this.ruleForm
        delete obj.checkPassword
        await changPasswordAPI(obj)
        this.$message.success('修改成功.')
        this.resetChangeForm()
      })
    },
    resetChangeForm() {
      this.$refs.changeForm.resetFields()
      this.outerVisible = false
    },
    // 打卡修改密码弹窗
    openChangePass(id) {
      this.outerVisible = true
      this.ruleForm.id = id
    },
    // 密码校验
    validatePass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPassword !== '') {
          this.$refs.changeForm.validateField('checkPassword')
        }
        callback()
      }
    },
    // 确认密码校验
    validatePass2(rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    },
    // 重置密码
    resetPassword(id) {
      this.$confirm('此操作将重置该员工登录密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await resetPasswordAPI(id)
        this.$message({
          type: 'success',
          message: '密码重置成功!'
        })
      })
    },
    // 删除
    delEmployee(id) {
      this.$confirm('此操作将删除该员工, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delEmployeeAPI(id)
        this.getEmployeeList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    // 编辑
    editEmployee(row) {
      // 填充到编辑窗口
      this.addForm = row
      this.dialogVisible = true
    },
    // 关闭弹窗
    resetForm() {
      this.$refs.addForm.resetFields()
      this.addForm = {
        name: '',
        photo: '',
        identificationCard: '',
        employeeClass: '',
        entryTime: '',
        endTime: '',
        performance: '0'
      }
      this.dialogVisible = false
      this.getEmployeeList()
    },
    // 添加员工
    submitForm() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return
        // 校验通过 添加员工
        if (this.addForm.id) {
          // 编辑
          await updateEmployeeAPI(this.addForm)
          this.$message.success('编辑成功')
        } else {
          // 添加
          await addEmployeeAPI(this.addForm)
          this.$message.success('添加成功')
        }
        this.resetForm()
      })
    },
    // 查询员工
    searchManage() {
      this.params.page = 1
      this.getEmployeeList()
    },
    // 修改自定义序号
    indexMethod(index) {
      return index + 1 + (this.params.page - 1) * this.params.pageSize
    },
    // 点击下一页
    currentChange(val) {
      this.params.page = val
      this.getEmployeeList()
    },
    // 获取员工列表
    async getEmployeeList() {
      const res = await getEmployeeListAPI(this.params)
      this.employeeList = res.data.rows
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
