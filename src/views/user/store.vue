<template>
  <div class="tab-container">
    <div class="container-tip"><i class="el-icon-warning color-primary" s /> 处理异常订单正确姿势：1.查看订单详情；2.核实收付款是否完成；3.核查交易提成是否收取；4.核查系统补贴、返利是否发放。
      <div>
        <el-link type="info" :underline="false">温馨提示：若遇其他非上述情况请及时联系管理员：</el-link>
        <el-link type="primary">Towards <i class="el-icon-chat-dot-round" /></el-link>
      </div>
    </div>

    <div class="filter-container" style="margin-bottom: 10px;">

      <el-input v-model="fliterQuery.query" placeholder="用户名ID/姓名/手机号" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="fliterQuery.active" placeholder="账号状态" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in AccountStatus" :key="item.id" :label="item.label" :value="item.name" />
      </el-select>
      <el-date-picker
        v-model="fliterQuery.date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>

      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-plus" @click="dialogVisible=true">
        添加
      </el-button>

    </div>

    <el-table v-loading="loading" stripe :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column

        align="center"
        label="用户ID"
        width="180px"
        element-loading-text="请给我点时间！"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.uuid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.mobileContact }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{ scope.row.emailContact }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="所属代理商">
        <template slot-scope="scope">
          <span>{{ scope.row.parentAgent||'无' }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="交易额">
        <template slot-scope="scope">
          <span>{{ scope.row.amount||'-' }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="账号状态" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.active?'正常':'冻结' }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="注册时间" minwidth="300">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="操作" width="110">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="goDetail(scope.row.id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="meta.current" :limit.sync="meta.size" @pagination="paginationChange" />
    <el-dialog :visible.sync="dialogVisible" title="添加用户">
      <el-form ref="regForm" :model="regForm" :rules="loginRules" class="login-form" label-width="80px" auto-complete="on" label-position="right">
        <el-form-item label="邮箱" class="addUserItem" prop="emailContact">
          <el-input ref="emailContact" v-model="regForm.emailContact" autocomplete="off" placeholder="请输入邮箱" name="emailContact" type="text" tabindex="1" auto-complete="on" />
        </el-form-item>
        <el-form-item label="密码" class="addUserItem" prop="password">
          <el-input ref="password" v-model="regForm.password" autocomplete="off" show-password :type="passwordType" placeholder="请输入密码" name="password" tabindex="2" auto-complete="on" />
        </el-form-item>
        <el-form-item label="" class="addUserItem">
          <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handlAdd">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import tabPane from './components/TabPane'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import tip from '@/components/Tip'
import { groupsConstName, userRolesConstName, adminRolesConstName } from '@/utils'

import waves from '@/directive/waves' // waves directive
import { Groups, UserType, KycLevel, emptySelect, PayType, AccountStatus } from '@/utils/enumeration'
import { users_b, user_b_save } from '@/api/usermanage'
import { validateUsername, validateEamil, validatePassword } from '@/utils/validate'

export default {
  name: 'Tab',
  components: { pagination, tip },
  directives: { waves },
  data() {
    const validateConfirm = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请重复密码'))
      } else if (value.length < 6) {
        callback(new Error('密码必须大于6位数'))
      } else if (this.regForm.password !== value) {
        callback(new Error('密码不一致'))
      } else {
        callback()
      }
    }
    return {
      groupsConstName,
      userRolesConstName,
      adminRolesConstName,
      AccountStatus,
      PayType,
      activeType: '0',
      UserType,
      KycLevel,
      Groups: [emptySelect, ...Groups],
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        emailContact: [{ required: true, trigger: 'blur', validator: validateEamil }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirm: [{ required: true, trigger: 'blur', validator: validateConfirm }]
      },
      fliterQuery: {
        page: 1,
        size: 20,
        date: null,
        query: undefined,
        payType: undefined,
        groupId: undefined,
        kycLevel: undefined
      },
      meta: {
        current: 1,
        size: 10
      },
      dialogVisible: false,
      loading: false,
      list: [],
      paginationMeta: {
        total: 10,
        pages: 1
      },
      regForm: {
        emailContact: undefined,
        password: undefined,
        active: true
      }
    }
  },

  computed: {
    ...mapState({
      allList: state => state.order.allList,
      allListMeta: state => state.order.allMeta
    }),
    ...mapGetters([
      'groupsConst',
      'userRolesConst',
      'adminRolesConst'
    ])
  },

  mounted() {
    this.getList()
  },
  methods: {

    paginationChange(e) {
      console.log('paginationChange', e)
      this.meta.size = e.limit
      this.meta.current = e.page
      this.getList()
    },
    getList(meta, data) {
      this.listLoading = true
      users_b(meta || this.meta, data).then(res => {
        console.log('res', res)
        if (res.code === 0) {
          this.list = res.data.records
          this.meta.current = res.data.current
          this.paginationMeta.total = res.data.total
          this.paginationMeta.pages = res.data.pages
        }
      })
    },
    handleFilter() {
      const fliterQuery = this.fliterQuery
      console.log('fliterQuery', this.fliterQuery)
      const data = {
        active: fliterQuery.active,
        query: fliterQuery.query
      }
      if (fliterQuery.date) {
        data.start = this.$moment(fliterQuery.date[0]).format('YYYY-MM-DD HH:mm:ss')
        // data.start = '2019-10-16 12:11:11'
        data.end = this.$moment(fliterQuery.date[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      const meta = this.meta
      meta.current = 1
      this.getList(meta, data)
    },
    goDetail(id) {
      this.$router.push({ path: `/user/store/${id}` })
    },
    handlAdd() {
      console.log('click')
      this.$refs.regForm.validate(valid => {
        console.log('valid', valid)
        if (valid) {
          this.loading = true
          const data = this.regForm
          user_b_save(data).then(res => {
            this.loading = false

            if (res.code === 0) {
              this.dialogVisible = false
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.dialogVisible = false
              this.getList()
              this.regForm = {
                emailContact: undefined,
                password: undefined,
                active: true
              }
            } else {
              this.$message.error(res.message || '操作失败')
            }
          }).catch(err => {
            this.loading = false
            this.$message.error(err || '操作失败')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
</style>
