<template>
  <div class="add-card">
    <header class="add-header">
      <el-page-header :content="showTitle" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">会员信息</div>
        <div class="form">
          <el-form ref="addForm" label-width="100px" :model="addForm" :rules="$route.query.type ==='see'?{}:rules">
            <el-form-item label="会员姓名" prop="name">
              <el-input v-if="$route.query.type !=='see'" v-model="addForm.name" />
              <span v-else>{{ addForm.name }}</span>
            </el-form-item>
            <el-form-item label="联系方式" prop="photo">
              <el-input v-if="$route.query.type !=='see'" v-model="addForm.photo" />
              <span v-else>{{ addForm.photo }}</span>
            </el-form-item>
            <el-form-item label="身份证号码" prop="identityCard">
              <el-input v-if="$route.query.type !=='see'" v-model="addForm.identityCard" />
              <span v-else>{{ addForm.identityCard }}</span>
            </el-form-item>
            <el-form-item label="健身卡" prop="cards">
              <el-select v-if="$route.query.type !=='see'" v-model="addForm.cards">
                <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
              <span v-else>{{ cardsObj[addForm.cards] }}</span>
            </el-form-item>
            <el-form-item label="会员课" prop="course">
              <el-input v-if="$route.query.type !=='see'" v-model="addForm.course" type="number" min="0" max="50" />
              <span v-else>{{ addForm.course }}</span>
            </el-form-item>
            <el-form-item label="专属私教" prop="coach">
              <el-input v-if="$route.query.type !=='see'" v-model="addForm.coach" />
              <span v-else>{{ addForm.coach? addForm.coach :'无' }}</span>
            </el-form-item>
            <el-form-item label="支付金额" prop="payNum">
              <el-input v-if="$route.query.type !=='see'" v-model="addForm.payNum" />
              <span v-else>{{ addForm.payNum }}</span>
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentMethod">
              <el-select v-if="$route.query.type !=='see'" v-model="addForm.paymentMethod">
                <el-option v-for="item in payOptions" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
              <span v-else>{{ paymentObj[addForm.paymentMethod] }}</span>
            </el-form-item>
            <el-form-item label="有效日期" prop="timeDate">
              <el-date-picker
                v-if="$route.query.type !=='see'"
                v-model="addForm.timeDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              />
              <span v-else>{{ addForm.startTime +'至'+ addForm.endTime }}</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer v-if="$route.query.type !=='see'" class="add-footer">
      <div class="btn-container">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { addMemberAPI, getMemberAPI } from '@/api/member'

export default {
  name: 'AddMember',
  data() {
    return {
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
      options: [
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
      addForm: {
        name: '',
        photo: '',
        cards: '',
        timeDate: '',
        paymentMethod: '',
        identityCard: '',
        course: 0,
        coach: '',
        payNum: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入会员名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        photo: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '手机号码格式不对' }
        ],
        cards: [{ required: true, message: '请选择会员卡', trigger: 'change' }],
        timeDate: [{ type: 'array', required: true, message: '请选择有效日期', trigger: 'change' }],
        paymentMethod: [{ required: true, message: '请选择支付方式', trigger: 'change' }],
        identityCard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
        payNum: [
          { required: true, message: '请输入支付金额 ', trigger: 'blur' },
          { pattern: /^\d+(\.\d{1,2})?$/, message: '支付金额格式不对' }
        ]
      }
    }
  },
  computed: {
    showTitle() {
      const obj = {
        see: '查看会员',
        edit: '编辑会员',
        add: '添加会员'
      }
      return obj[this.$route.query.type]
    }
  },
  created() {
    if (this.$route.query.type !== 'add') {
      this.getMember()
    }
  },
  methods: {
    // 获取会员详情
    async getMember() {
      const res = await getMemberAPI(this.$route.query.id)
      //   console.log(res)
      this.addForm = {
        ...res.data,
        timeDate: [res.data.startTime, res.data.endTime]
      }
    },
    submitForm() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return
        //   通过校验
        // console.log(this.addForm)
        const data = this.addForm
        data.startTime = this.addForm.timeDate[0]
        data.endTime = this.addForm.timeDate[1]
        delete data.timeDate

        await addMemberAPI(data)
        this.$message.success('添加成功.')
        this.$refs.addForm.resetFields()
        this.$router.back()
      })
    },
    resetForm() {
      this.$refs.addForm.resetFields()
    }
  }
}
</script>

  <style scoped lang="scss">
.add-card {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 64px;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }
      .arrow {
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;

      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }

      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;

        .el-form {
          display: flex;
          flex-wrap: wrap;

          .el-form-item {
            width: 50%;
          }
        }
      }
    }
    .preview {
      img {
        width: 100px;
      }
    }
  }

  .add-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
  }
}
</style>
