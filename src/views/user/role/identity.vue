<template>
  <div class="tab-container">
    <el-card v-loading="detailLoading" class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-title">基础信息</span>
        <!-- <el-button style="float: right; " type="primary" size="small" @click="clickAduit">编辑</el-button> -->
        <el-button style="float: right; " type="primary" size="small" @click="dialogVisible=true">审核</el-button>
      </div>
      <div class="text item">
        <el-row :gutter="10" class="card-row">
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5"><div>用户ID：{{ modals.uuid }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5"><div>用户名：{{ modals.nickName }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4"><div>当前角色：{{ userRolesConstName(modals.roleId,userRolesConst) }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5"><div>
            当前状态： <span>{{ modals.active?'正常':'冻结' }}</span></div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5"><div /></el-col>
        </el-row>
        <el-row :gutter="10" class="card-row">
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5"><div>真实姓名：{{ modals.realName }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5"><div>手机号：{{ modals.mobileContact }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="7" :xl="7"><div class="card-info-text">身份证号：{{ modals.idNumber }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="7" :xl="7"><div class="card-info-text">邮箱：{{ modals.emailContact }}</div></el-col>
        </el-row>
        <el-row :gutter="10" class="card-row">
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="4"><div>收付款方式：{{ modals.payTypes|payTypeNames }}</div></el-col>
          <!-- <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5"><div >所在分组：{{ modals.pricingGroupId|groupName }}</div></el-col> -->
        </el-row>
        <el-row :gutter="10" class="card-row">
          <el-col :span="12"><div>身份证照片：
            <img v-if="modals.identityImageFront" v-lazy="modals.identityImageFront" :preview="'idcard'" class="idImage" alt="身份证正面" @click="dialogVisible=false">
            <img v-if="modals.identityImageBack" v-lazy="modals.identityImageBack" :preview="'idcard'" class="idImage" alt="身份证反面" @click="dialogVisible=false">
            <img v-if="modals.identityImageHand" v-lazy="modals.identityImageHand" :preview="'idcard'" class="idImage" alt="手持身份证" @click="dialogVisible=false">

          </div></el-col>

        </el-row>
      </div>
    </el-card>

    <el-card class="box-card marginT40">
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
              <div class="cart-i-t">激活金 <span>{{ modals.isBack?'(已退还)':'(未退还)' }} </span> </div>
              <div class="cart-i-v">{{ modals.activeBalance }}</div>
            </div>
          </el-col>
        </el-row>

      </div>
    </el-card>

    <div class="section-title-container marginT40">
      <span class="section-title">交易明细</span><span class="container-tip">  已经完成订单：总数<el-link type="primary">{{ modals.totalOrders }} </el-link>  | toB售币订单：<el-link type="primary">{{ modals.toBOrders }} </el-link></span>

    </div>
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-button v-if="false" v-waves class="filter-item" type="primary" icon="el-icon-add" @click="handleFilter">
        新增
      </el-button>
      <el-input v-model="fliterQuery.query" placeholder="订单ID/交易人" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="fliterQuery.payType" placeholder="支付方式" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in PayType" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-select v-model="fliterQuery.groupId" placeholder="交易类型" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in CounterParty" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-select v-model="fliterQuery.status" placeholder="订单状态" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in OrderStatus" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>

      <el-date-picker
        v-model="fliterQuery.date"
        class="filter-item"
        type="daterange"
        name="datepicker"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>

    </div>
    <el-table stripe :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        v-loading="loading"
        align="center"
        label="订单ID"
        min-width="180"
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

      <el-table-column width="80px" align="center" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.dealType|advType }}</span>
        </template>
      </el-table-column>

      <el-table-column width="170px" align="center" label="支付方式">
        <template slot-scope="scope">
          <span>{{ scope.row.payType|payTypeName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="奖励">
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
          <el-link :underline="false" :type="scope.row.status|orderStatusTagName">{{ scope.row.status|orderStatus }}</el-link>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="meta.current" :limit.sync="meta.size" @pagination="paginationChange" />

    <el-dialog v-loading="orderLoading" :visible.sync="dialogVisible" title="提示">
      <div>是否通过该用户身份审核？</div>
      <el-row :gutter="20" class="userRow">
        <el-col :span="24"><el-input v-model="reason" placeholder="通过/不通过原因" /></el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click=" handleAudit(1) ">通过</el-button>
        <el-button @click="handleAudit(2)">不通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import { groupsConstName, userRolesConstName, adminRolesConstName } from '@/utils'
import waves from '@/directive/waves' // waves directive
import { Groups, UserType, Authents, emptySelect, OrderStatus, CounterParty, PayType } from '@/utils/enumeration'
import { role_apply_list, user_web, user_b, users_b, users_web, user_web_save, user_b_save, pay_types, role_apply_audit, get_deal_subsidy, deal_subsidy, system_transfer, verify_identity } from '@/api/usermanage'
import { order_details } from '@/api/order'
import float from '@/directive/float' // float Number directive
export default {
  name: 'Tab',
  components: { pagination },
  directives: { waves, float },
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
      meta: {
        current: 1,
        size: 10
      },
      newPassword: undefined,
      loading: false,
      list: [],
      peyTypeList: [],
      paginationMeta: {
        total: 10,
        pages: 1
      },
      id: undefined,
      dialogVisible: false,
      modals: {},
      editData: {},
      newData: {
        active: false,
        payTypes: [],
        rebate: undefined,
        groupId: undefined
      },
      subsidyBuy: {
        0: { rebate: undefined },
        1: { rebate: undefined },
        2: { rebate: undefined },
        3: { rebate: undefined }
      },
      subsidySell: {
        0: { rebate: undefined },
        1: { rebate: undefined },
        2: { rebate: undefined },
        3: { rebate: undefined }
      },
      showBuy: false,
      showSell: false,
      supplyLoading: false,
      detailLoading: false,
      payTypeLoading: false,
      orderLoading: false,
      assetsAdd: {},
      assetsDes: {
      },
      rules: {

        uuid: [{ required: true, message: '请输入', trigger: 'blur' }],
        amount: [{ required: true, message: '请输入', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      assetsEditTab: '0',
      saveLoading: false,
      applyId: undefined,
      reason: undefined

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
    this.applyId = this.$route.query.applyId
    this.detail(this.id)
    this.getList(null, { userId: this.id })
  },
  methods: {

    detail(id) {
      this.detailLoading = true
      user_web({ userId: id || this.id }).then(res => {
        this.detailLoading = false

        if (res.code === 0) {
          this.modals = res.data
        }
        console.log('res')
      }).catch(() => {
        this.detailLoading = false
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
        userId: this.id
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
      this.orderLoading = true
      order_details(meta || this.meta, data || { userId: this.id }).then(res => {
        this.orderLoading = false

        if (res.code === 0) {
          this.list = res.data.records
          this.meta.current = res.data.current
          this.paginationMeta.total = res.data.total
          this.paginationMeta.pages = res.data.pages
        }
      }).catch(() => {
        this.orderLoading = false
      })
    },
    handleAudit(status) {
      if (!this.reason) {
        this.$message.error('请输入通过/不通过原因')
        return false
      }
      const data = {
        applyId: this.applyId,
        status: status,
        reason: this.reason
      }
      verify_identity(data).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.dialogVisible = false
        } else {
          this.$message.error(res.message || '操作失败')
        }
      }).catch(err => {
        this.$message.error(err.message || '操作失败')
      })
    }

  }
}
</script>

<style scoped>
.card-info-text{
  margin-right: 10px;
}
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
.section-title-container{
  margin: 40px 0 20px;
}
.section-title{
  font-size: 24px;
  font-weight: bold;
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
.supplyRow{
  margin:10px 0;
  min-height: 20px;
}
.supplyType{
  line-height: 40px;
  font-size: 16px;
  font-weight: bold;
}
.text_red{
  color: #f56c6c
}
</style>
