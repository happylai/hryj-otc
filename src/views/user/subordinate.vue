<template>
  <div>
    <h2 class="marginT40">下级列表</h2>
    <div
      class="filter-container"
      style="margin-bottom: 10px;"
    >

      <el-input v-model="fliterQuery.query" placeholder="用户名ID/姓名/手机号/邮箱" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="fliterQuery.roleId" placeholder="选择角色" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in userRolesConst" :key="item.id" :label="item.zhName" :value="item.id" />
      </el-select>
      <el-select v-model="fliterQuery.kycLevel" placeholder="认证状态" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in kycLevel" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>

      <el-select v-model="fliterQuery.payType" placeholder="收付款方式" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in PayType" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-select v-model="fliterQuery.groupId" placeholder="所在分组" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in groupsConst" :key="item.id" :label="item.groupName" :value="item.id" />
      </el-select>
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
        align="center"
        label="用户ID"
        width="180"
        element-loading-text="请给我点时间！"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.uuid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="可用余额">
        <template slot-scope="scope">
          <span>{{ scope.row.balance }}</span>
        </template>
      </el-table-column>

      <el-table-column width="90px" align="center" label="成交数量">
        <template slot-scope="scope">
          <span>{{ scope.row.balance }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="胜诉比">
        <template slot-scope="scope">
          <span>{{ scope.row.appealWin }}/{{ scope.row.appealTotal }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="完成订单数" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.orders }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="当前角色" width="140">
        <template slot-scope="scope">
          <span>{{ userRolesConstName(scope.row.roleId,userRolesConst) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="认证状态" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.kycLevel?'已认证':'未认证' }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="收付款方式" width="130">
        <template slot-scope="scope">
          <el-link v-if="scope.row.needAudit" type="danger" @click="clickGoAudit(scope.row.id)">去审核>>></el-link>
          <span v-else>{{ scope.row.payTypes|payTypeNames }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="所在分组" width="95">
        <template slot-scope="scope">
          <span>{{ groupsConstName(scope.row.pricingGroupId,groupsConst) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="注册时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="账号状态" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.active?'正常':'冻结' }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="goDetail(scope.row.id)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="meta.current" :limit.sync="meta.size" @pagination="paginationChange" />

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
import { user_web_children, agent_save, pay_type_audit, pay_type_info, freeze_deal } from '@/api/usermanage'
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
      kycLevel: [{
        label: '未认证',
        id: 0
      }, {
        label: '已认证',
        id: 1
      }],
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
      foldList: [], // 该数组中的值 都会在列表中进行隐藏  死亡名单
      id: undefined
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
    this.id = this.$route.params.id
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
      const responeData = await user_web_children(meta || this.meta, data || { parentId: this.id }).then(res => {
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

    goDetail(id) {
      this.$router.push({ path: `/user/instation/${id}` })
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
