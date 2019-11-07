<template>
  <div class="tab-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-title">基础信息</span>
        <el-button style="float: right; " :disabled="modals.auditStatus!==0" type="primary" size="small" @click="clickAduit">审核</el-button>
      </div>
      <div class="text item">
        <el-row :gutter="10" class="card-row">
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5"><div>用户ID：{{ modals.uuid }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5"><div>用户名：{{ modals.nickName }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4"><div>当前角色：{{ userRolesConstName(modals.currentRoleId,userRolesConst) }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5"><div>
            当前状态：<el-link v-if="modals.active" type="success" :underline="false">正常</el-link>
            <el-link v-if="!modals.active" type="danger" :underline="false">冻结</el-link></div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5"><div>认证方式：{{ modals.authType|authTypeName }}</div></el-col>
        </el-row>
        <el-row :gutter="10" class="card-row">
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5"><div>真实姓名：{{ modals.realName }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5"><div>手机号：{{ modals.mobileContact }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4"><div>身份证：{{ modals.idNumber }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5"><div>邮箱：{{ modals.emailContact }}</div></el-col>
        </el-row>
        <el-row :gutter="10" class="card-row">
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5"><div>返佣比：{{ modals.rebate }}%</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5"><div>申诉数：{{ modals.appealNum }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4"><div>被申诉数：{{ modals.appealedNum }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5"><div>收付款方式：{{ modals.payTypes|payTypeNames }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5"><div>所在分组： {{ groupsConstName(modals.pricingGroupId,groupsConst) }}</div></el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="box-card marginT20">
      <div slot="header" class="clearfix">
        <span class="card-title">用户资产（当前用户资产/冻结资产/保证金）</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">审核</el-button> -->
      </div>
      <div class="text item">
        <el-row :gutter="10">
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6">
            <div class="card-item borderR">
              <div class="cart-i-t">可用资产 </div>
              <div class="cart-i-v">{{ modals.balance }}</div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6">
            <div class="card-item borderR">
              <div class="cart-i-t">冻结资产(不可用) </div>
              <div class="cart-i-v">{{ modals.frozenBalance }}</div>
            </div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6">
            <div class="card-item borderR">
              <div class="cart-i-t">保证金(不可用) </div>
              <div class="cart-i-v">{{ modals.deposit }}</div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6">
            <div class="card-item ">
              <div class="cart-i-t">激活金 <el-link :underline="false" type="success">(已退还)</el-link> </div>
              <div class="cart-i-v">{{ modals.activeBalance }}</div>
            </div>
          </el-col>
        </el-row>

      </div>
    </el-card>

    <h2>交易明细</h2>
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-button v-if="false" v-waves class="filter-item" type="primary" icon="el-icon-add" @click="handleFilter">
        新增
      </el-button>
      <el-input v-model="fliterQuery.query" placeholder="订单ID/姓名/手机号" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="fliterQuery.payType" placeholder="支付方式" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in PayType" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-select v-model="fliterQuery.groupId" placeholder="交易类型" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in CounterParty" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-select v-model="fliterQuery.status" placeholder="订单状态" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in OrderStatus" :key="item.id" :label="item.label" :value="item.name" />
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

    </div>
    <el-table :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        v-loading="loading"
        align="center"
        label="订单ID"
        width="65"
        element-loading-text="请给我点时间！"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.orderId }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="交易人">
        <template slot-scope="scope">
          <span>{{ scope.row.dealer }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="成交额">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>

      <el-table-column width="170px" align="center" label="支付类型">
        <template slot-scope="scope">
          <span>{{ scope.row.payType|payTypeName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" label="奖励">
        <template slot-scope="scope">
          <span>{{ scope.row.award }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手续费" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.fee }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="交易时间" minwidth="300">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单状态" minwidth="300">
        <template slot-scope="scope">
          <span>{{ scope.row.status|orderStatus }}</span>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="paginationMeta.pages" :limit.sync="meta.size" @pagination="paginationChange" />
    <el-dialog :visible.sync="dialogVisible" title="基础信息审核">
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">用户ID：</el-col>
        <el-col :span="16">{{ editData.uuid }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">用户名：</el-col>
        <el-col :span="16">{{ editData.nickName }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">真实姓名：</el-col>
        <el-col :span="16">{{ editData.realName }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">认证状态：：</el-col>
        <el-col :span="16">{{ editData.authType|authTypeName }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">手机号：</el-col>
        <el-col :span="16">
          {{ editData.mobileContact }}
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">身份证号：</el-col>
        <el-col :span="8">{{ editData.idNumber }}</el-col>
        <el-col :span="4">
          <img v-if="editData.identityImageFront" class="idImage" :src="editData.identityImageFront" alt="身份证正面">
        </el-col>
        <el-col :span="4">
          <img v-if="editData.identityImageBack" class="idImage" :src="editData.identityImageBack" alt="身份证反面">
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">登陆邮箱：</el-col>
        <el-col :span="16">{{ editData.emailContact }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">登陆密码：</el-col>
        <el-col :span="16">{{ editData.email }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">返佣比:</el-col>
        <el-col :span="16">{{ editData.rebate }}</el-col>
      </el-row>
      <el-row v-if="type===1" :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">角色升级：</el-col>
        <el-col :span="16">
          <el-link type="success" :underline="false">{{ userRolesConstName(editData.applyRoleId,userRolesConst) }}</el-link>

          <el-link type="danger" :underline="false">当前登录角色：{{ userRolesConstName(editData.currentRoleId,userRolesConst) }}</el-link>
        </el-col>
      </el-row>
      <el-row v-else-if="type===2" :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">用户角色：</el-col>
        <el-col :span="16">
          <el-link type="success" :underline="false">超级</el-link>

          <el-link type="danger" :underline="false">当前登录角色：{{ userRolesConstName(editData.currentRoleId,userRolesConst) }}</el-link>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">所在分组：</el-col>
        <el-col :span="16">
          <el-select v-model="editData.newPricingGroupId" placeholder="选择分组">
            <el-option v-for="(item,inedex) in groupsConst" :key="inedex+'auth'" :label="item.groupName" :value="item.id" />
          </el-select>
          <el-link type="danger" :underline="false">当前分组：{{ groupsConstName(modals.pricingGroupId,groupsConst) }}</el-link>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">账号状态：</el-col>
        <el-col :span="16">{{ editData.active?'正常':'冻结' }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">收付款方式：</el-col>
        <el-col :span="16">{{ editData.payTypes|payTypeNames }}</el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click=" handleAudit(1) ">通过</el-button>
        <el-button @click="handleAudit(2)">不通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import update from './update'
import surrender from './surrender'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import { groupsConstName, userRolesConstName, adminRolesConstName } from '@/utils'
import waves from '@/directive/waves' // waves directive
import { Groups, UserType, Authents, emptySelect, OrderStatus, CounterParty, PayType } from '@/utils/enumeration'
import { role_apply_list, role_apply_detail, role_apply_audit } from '@/api/usermanage'
import { order_details } from '@/api/order'

export default {
  name: 'Tab',
  components: { update, surrender, pagination },
  directives: { waves },
  data() {
    return {
      groupsConstName,
      userRolesConstName,
      adminRolesConstName,
      UserType,
      PayType,
      OrderStatus,
      CounterParty,
      Authents: [{ id: '',
        mame: '',
        label: '请选择'
      }, ...Authents],
      Groups: [emptySelect, ...Groups],
      fliterQuery: {
        page: 1,
        size: 20,
        date: null,
        query: undefined,
        authent: undefined,
        groupId: undefined,
        status: undefined
      },
      type: undefined,
      meta: {
        current: 1,
        size: 10
      },

      loading: false,
      list: [],
      paginationMeta: {
        total: 10,
        pages: 1
      },
      id: undefined,
      dialogVisible: false,
      modals: {},
      editData: {},
      newData: {}

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
    const userId = this.$route.query.userId
    this.userId = userId
    this.type = this.$route.query.type
    this.detail(this.id)
    this.getList(null, { userId: userId })
  },
  methods: {

    detail(id) {
      this.listLoading = true
      role_apply_detail({ applyId: id || this.id }).then(res => {
        if (res.code === 0) {
          this.modals = res.data
        }
        console.log('res')
      })
    },

    paginationChange(e) {
      console.log('paginationChange', e)
      this.meta.size = e.limit
      this.meta.current = e.page
      this.getList()
    },
    handleFilter() {
      const fliterQuery = this.fliterQuery
      console.log('fliterQuery', this.fliterQuery)
      const data = {
        payType: fliterQuery.payType,
        query: fliterQuery.query,
        status: fliterQuery.status,
        userId: this.userId
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
    getList(meta, data) {
      order_details(meta || this.meta, data || { userId: this.userId }).then(res => {
        if (res.code === 0) {
          this.list = res.data.records
          this.meta.current = res.data.current
          this.paginationMeta.total = res.data.total
          this.paginationMeta.pages = res.data.pages
        }
      })
    },
    clickAduit() {
      this.dialogVisible = true
      this.editData = this.modals
    },
    handleAudit(status) {
      const data = {
        adminId: this.adminId,
        applyId: this.id,
        groupId: this.newPricingGroupId ? this.editData.newPricingGroupId : this.editData.pricingGroupId,
        reason: undefined,
        status: status,
        userId: this.userId
      }
      if (status === 2) {
        this.$prompt('请输入拒绝理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          data.reason = value
          this.audit(data)
        }).catch(() => {

        })
      } else {
        this.audit(data)
      }
    },
    audit(data) {
      role_apply_audit(data).then(res => {
        if (res.code === 0) {
          this.dialogVisible = false
          this.detail(this.id)
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        } else {
          this.$message.error('操作失败')
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
.filter-item{
  margin-top:5px
}
.card-title{
  font-weight: bold;
  font-size: 16px
}
.card-row{
  margin: 40px 0;
}
.marginT20{
  margin-top: 20px
}
.card-item{
  height: 100px;
  margin: 0 20px;
}
.borderR{
  border-right: 1px solid #ccc;

}
.cart-i-t{
  font-size: 14px
}
.cart-i-v{
  height: 60px;
  line-height: 60px;
  font-weight: bold;
  font-size: 24px;
  text-align: center;
  text-indent: -30px;
}
.userRow {
  min-height: 20px;
  margin: 10px 0;
}
</style>
