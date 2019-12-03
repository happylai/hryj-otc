<template>
  <div class="tab-container">
    <tip />

    <div
      class="filter-container"
      style="margin-bottom: 10px;"
    >

      <el-input v-model="fliterQuery.query" placeholder="用户名ID/姓名/手机号" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
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

      <el-date-picker class="filter-item" 
        v-model="fliterQuery.date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>

    </div>

    <el-table v-loading="loading" stripe :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        v-loading="loading"
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
          <el-button type="danger" disabled="scope.row.frozenDeal" size="small" @click="handleFreeze(scope.row.id)">交易冻结</el-button>
          <el-button type="primary" size="small" @click="goDetail(scope.row.id)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="meta.current" :limit.sync="meta.size" @pagination="paginationChange" />
    <el-dialog :visible.sync="dialogVisible" title="支付方式审核" width="40%">
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">支付方式：</el-col>
        <el-col :span="16">{{ auditData.payType|paymentStatus }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">账号：</el-col>
        <el-col :span="16">
          {{ auditData.account }}
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">昵称：</el-col>
        <el-col :span="16">
          {{ auditData.nickName||'-' }}
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">姓名：</el-col>
        <el-col :span="16">
          {{ auditData.realName||'-' }}
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR" />
        <el-col :span="16">
          <img v-lazy="auditData.qrCode" class="payTypeImage">
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAudit(true)">通过</el-button>
        <el-button type="info" @click="handleAudit(false)">不通过</el-button>
      </span>
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
import { users_web, pay_type_audit, pay_type_info, freeze_deal } from '@/api/usermanage'

export default {
  name: 'UserInstation',
  components: { pagination, tip },
  directives: { waves },

  data() {
    return {
      groupsConstName,
      userRolesConstName,
      adminRolesConstName,
      AccountStatus,
      PayType: [...PayType, { id: 5, label: '待审核' }],
      activeType: '0',
      UserType,
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
      auditData: {}
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

    paginationChange(e) {
      console.log('paginationChange', e)
      this.meta.size = e.limit
      this.meta.current = e.page
      this.getList()
    },
    getList(meta, data) {
      this.listLoading = true
      users_web(meta || this.meta, data).then(res => {
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
      this.$router.push({ path: `/role/${data.id}`, query: { userId: data.userId, type: 1 }})
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
      this.$router.push({ path: `/user/instation/${id}` })
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
</style>
