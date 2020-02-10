<template>
  <div class="tab-container">
    <tip />

    <div
      class="filter-container"
      style="margin-bottom: 10px;"
    >

      <el-input v-model="fliterQuery.query" placeholder="用户ID/姓名/手机号/邮箱" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="fliterQuery.active" placeholder="账号状态" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in AccountStatus" :key="item.id" :label="item.label" :value="item.name" />
      </el-select>

      <el-date-picker
        v-model="fliterQuery.date"
        class="filter-item"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-plus" @click="()=>{regForm.parent = id;showAddUser=true}">
        添加代理商
      </el-button>
    </div>

    <el-table
      :data="list"
      style="width: 100%"
      row-key="userId"
      border
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >

      <el-table-column
        v-loading="loading"
        align="center"
        label="用户ID"
        width="180"
        element-loading-text="请给我点时间！"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>

      <el-table-column width="90px" align="center" label="交易总额">
        <template slot-scope="scope">
          <span>{{ scope.row.totalAmount }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="下级用户">
        <template slot-scope="scope">
          <span>{{ scope.row.childNum }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.mobileContact }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="邮箱" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.emailContact }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="注册时间" min-width="240">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="账号状态" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.active?'正常':'冻结' }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleAddAgent(scope.row.userId)">添加下级代理商</el-button>
          <el-button type="primary" size="small" @click="goDetail(scope.row.userId)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="meta.current" :limit.sync="meta.size" @pagination="paginationChange" />
    <el-dialog :visible.sync="showAddUser" title="添加代理商">
      <el-form ref="regForm" :model="regForm" :rules="loginRules" class="login-form" label-width="140px" auto-complete="on" label-position="right">
        <el-form-item label="邮箱" class="addUserItem" prop="emailContact">
          <el-input ref="emailContact" v-model="regForm.emailContact" autocomplete="off" placeholder="请输入邮箱" name="email" type="text" tabindex="1" auto-complete="off" />
        </el-form-item>
        <el-form-item label="密码" class="addUserItem" prop="password">
          <el-input ref="password" v-model="regForm.password" autocomplete="off" show-password :type="passwordType" placeholder="请输入密码" name="password" tabindex="2" auto-complete="off" />
        </el-form-item>
        <el-form-item label="代理奖励比例" class="addUserItem" prop="rebate">
          <el-input ref="rebate" v-model="regForm.rebate" autocomplete="off" type="text" placeholder="请输入代理奖励比例%" name="rebate" tabindex="2" auto-complete="off" />
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
import { Groups, UserType, emptySelect, PayType, AccountStatus } from '@/utils/enumeration'
import { users_agent, agent_save, pay_type_audit, pay_type_info, freeze_deal } from '@/api/usermanage'
import { validateUsername, validateEamil, validatePassword, validateRebate } from '@/utils/validate'
import Vue from 'vue'
export default {
  name: 'UserInstation',
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
      PayType: [...PayType, { id: 5, label: '待审核' }],
      activeType: '0',
      UserType,
      openLeaveId: [],
      Groups: [emptySelect, ...Groups],
      fliterQuery: {
        page: 1,
        size: 20,
        date: null,
        query: undefined,
        payType: undefined,
        groupId: undefined,
        kycLevel: undefined
      },
      loginRules: {
        emailContact: [{ required: true, trigger: 'blur', validator: validateEamil }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        rebate: [{ required: true, trigger: 'blur', validator: validateRebate }]
      },
      regForm: {
        active: true,
        emailContact: '',
        password: ''
      },
      meta: {
        current: 1,
        size: 10
      },
      dialogVisible: false,
      loading: false,
      list: [],

      tableData1: [{
        id: 1,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        id: 2,
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        id: 3,
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        hasChildren: true
      }, {
        id: 4,
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],

      paginationMeta: {
        total: 10,
        pages: 1
      },
      auditData: {},
      listLoading: true,
      passwordType: 'password',
      showAddUser: false,
      tableListData: [],
      foldList: [] // 该数组中的值 都会在列表中进行隐藏  死亡名单

    }
  },

  computed: {
    ...mapState({
      adminId: state => state.user.principal.adminId
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
    async load(tree, treeNode, resolve) {
      console.log('tree', tree)
      const data = await this.getList({ current: 1, size: 100 }, { parentId: tree.userId })
      console.log('loaddata', data)
      resolve(data)
    },
    paginationChange(e) {
      console.log('paginationChange', e)
      this.meta.size = e.limit
      this.meta.current = e.page
      this.getList()
    },
    async getList(meta, data) {
      this.listLoading = true
      const responeData = await users_agent(meta || this.meta, data).then(res => {
        this.listLoading = false
        console.log('res', res)
        if (res.code === 0) {
          var resData = res.data.records
          resData.map((item, index) => {
            resData[index].hasChildren = item.childNum > 0
            // resData[index].children = []
            resData[index].index = index
          })
          if (data) {
            return resData
          }
          this.list = resData
          this.meta.current = res.data.current
          this.paginationMeta.total = res.data.total
          this.paginationMeta.pages = res.data.pages
          return resData
        }
      })
      return responeData
    },
    handleFilter() {
      const fliterQuery = this.fliterQuery
      console.log('fliterQuery', this.fliterQuery)
      const data = {
        active: fliterQuery.active,
        kycLevel: fliterQuery.kycLevel,
        groupId: fliterQuery.groupId,
        payType: fliterQuery.payType,
        query: fliterQuery.query,
        roleId: fliterQuery.roleId
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
    toDetail(data) {
      console.log('to detail')
      this.$router.push({ path: `/user/agent/${data.id}` })
    },
    clickGoAudit(id) {
      this.dialogVisible = true
      this.getPay_type_info(id)
    },
    getPay_type_info(id) {
      pay_type_info({ userId: id }).then(res => {
        if (res.code === 0) {
          this.auditData = res.data
        }
      })
    },
    auditPayType(data) {
      pay_type_audit(data).then(res => {
        this.loading = false
        this.dialogVisible = false
        if (res.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.getList()
        } else {
          this.$message.error(res.message || '操作失败')
        }
      }).catch(err => {
        console.log('err', err)
        this.$message.error(err || '操作失败')
        this.loading = false
      })
    },
    handleAudit(isPass) {
      const data = {
        adminId: this.adminId,
        audit: isPass,
        reason: undefined,
        id: this.auditData.id,
        userId: this.auditData.userId
      }
      if (isPass) {
        this.auditPayType(data)
      } else {
        this.$prompt('请输入拒绝理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          data.reason = value
          this.auditPayType(data)
        })
      }
    },
    goDetail(id) {
      this.$router.push({ path: `/user/agent/${id}` })
    },
    handleFreeze(id) {
      this.$confirm('是否冻结用户交易?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        freeze_deal({ userId: id }).then(res => {
          if (res.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getList()
          } else {
            this.$message.error(res.message || '操作失败')
          }
        })
      })
    },
    async loadchildren(id) {
      const data = {
        parentId: id
      }
      const meta = {
        current: 1,
        size: 100
      }
      const resData = await this.getList(meta, data)
      console.log('childrenData', resData)
      return (resData)
    },

    handleAddAgent(id) {
      this.regForm.parent = id
      this.showAddUser = true
    },
    handlAdd() {
      console.log('click')
      this.$refs.regForm.validate(valid => {
        console.log('valid', valid)
        if (valid) {
          this.loading = true
          const data = { ...this.regForm }
          console.log('reg from data', data)

          agent_save(data).then(res => {
            this.loading = false

            if (res.code === 0) {
              this.showAddUser = false
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.getAdmins()
              this.regForm = {
                username: '',
                email: '',
                password: '',
                reapatPassword: ''
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
.payTypeImage{
  width: 100px;
  height: 100px;
  background-color: #dedede
}
.permission_toggleFold{
  vertical-align: middle;
  padding-right: 5px;
  font-size: 16px;
  cursor: pointer
}

</style>
