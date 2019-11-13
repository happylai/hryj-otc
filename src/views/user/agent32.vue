<template>
  <div class="tab-container">
    <tip />

    <div
      class="filter-container"
      style="margin-bottom: 10px;"
    >

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
      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-plus" @click="()=>{regForm.parent = id;showAddUser=true}">
        添加代理商
      </el-button>
    </div>

    <tree-table :data="list" :columns="columns" border />>

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
    </tree-table></div>
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
    ]),
    tableListData2: {
      get() {
        return this.formatConversion([], this.list)
      }
    }
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
    async getList(meta, data) {
      this.listLoading = true
      const resData = await users_agent(meta || this.meta, data).then(res => {
        this.listLoading = false
        console.log('res', res)
        if (res.code === 0) {
          var resData = res.data.records
          resData.map((item, index) => {
            resData[index].haschildren = item.childNum > 0
            resData[index].children = []
            resData[index].index = index
          })

          if (data) {
            return resData
          }
          this.list = resData
          this.meta.current = res.data.current
          this.paginationMeta.total = res.data.total
          this.paginationMeta.pages = res.data.pages
        }
      })
      return resData
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
    /** *******************************
      ** Fn: toggleFoldingStatus
      ** Intro: 切换展开 还是折叠
      ** @params: params 当前点击行的数据
      ** Author: zyx
    *********************************/
    async toggleFoldingStatus(params) {
      console.log('data', params)
      if (params.childNum) {
        const resData = await this.loadchildren(params.userId)
        const formatData = this.tableListData
        formatData[params.index].children = resData
        this.tableListData = this.formatConversion([], formatData)
      }

      this.foldList.includes(params.__identity) ? this.foldList.splice(this.foldList.indexOf(params.__identity), 1) : this.foldList.push(params.__identity)
    },
    /** *******************************
      ** Fn: toggleDisplayTr
      ** Intro: 该方法会对每一行数据都做判断 如果foldList 列表中的元素 也存在与当前行的 __family列表中  则该行不展示
      ** @params:
      ** Author: zyx
    *********************************/
    toggleDisplayTr({ row, index }) {
      for (let i = 0; i < this.foldList.length; i++) {
        const item = this.foldList[i]
        // 如果foldList中元素存在于 row.__family中，则该行隐藏。  如果该行的自身标识等于隐藏元素，则代表该元素就是折叠点
        if (row.__family.includes(item) && row.__identity !== item) return 'display:none;'
      }
      return ''
    },
    /** *******************************
      ** Fn: toggleFoldingClass
      ** Intro: 如果子集长度为0，则不返回字体图标。
      ** Intro: 如果子集长度为不为0，根据foldList是否存在当前节点的标识返回相应的折叠或展开图标
      ** Intro: 关于class说明：permission_placeholder返回一个占位符，具体查看class
      ** @params: params 当前行的数据对象
      ** Author: zyx
    *********************************/
    toggleFoldingClass(params) {
      return params.childNum > 0 ? (this.openLeaveId.indexOf(params.userId) === -1 ? 'el-icon-arrow-right' : 'el-icon-arrow-down') : ''
    },
    /** *******************************
      ** Fn: formatConversion
      ** Intro: 将树形接口数据扁平化
      ** @params: parent 为当前累计的数组  也是最后返回的数组
      ** @params: children 为当前节点仍需继续扁平子节点的数据
      ** @params: index 默认等于0， 用于在递归中进行累计叠加 用于层级标识
      ** @params: family 装有当前包含元素自身的所有父级 身份标识
      ** @params: elderIdentity 父级的  唯一身份标识
      ** Author: zyx
    *********************************/
    formatConversion(parent, children, index = 0, family = [], elderIdentity = '0') {
      // children如果长度等于0，则代表已经到了最低层
      // let page = (this.startPage - 1) * 10
      if (children.length > 0) {
        children.map((x, i) => {
          // 设置 __level 标志位 用于展示区分层级
          Vue.set(x, '__level', index)
          // 设置 __family 为家族关系 为所有父级，包含本身在内
          Vue.set(x, '__family', [...family, elderIdentity + '_' + i])
          // 本身的唯一标识  可以理解为个人的身份证咯 一定唯一。
          Vue.set(x, '__identity', elderIdentity + '_' + i)
          parent.push(x)
          // 如果仍有子集，则进行递归
          if (x.children && x.children.length > 0) this.formatConversion(parent, x.children, index + 1, [...family, elderIdentity + '_' + i], elderIdentity + '_' + i)
        })
      } return parent
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
          const data = this.regForm
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
