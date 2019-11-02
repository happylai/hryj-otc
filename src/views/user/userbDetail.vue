<template>
  <div class="tab-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-title">基础信息</span>
        <el-button style="float: right; " type="primary" size="small" @click="clickAduit">编辑</el-button>
      </div>
      <div class="text item">
        <el-row :gutter="10" class="card-row">
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5"><div class="">用户ID：{{ modals.uuid }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5"><div class="">用户名：{{ modals.nickName }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4"><div class="">真实姓名：{{ modals.realName }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5"><div class="">
            当前状态：<el-tag :type="editData.active?'success':'danger'">{{ editData.active?'正常':'冻结' }}</el-tag></div></el-col>
        </el-row>
        <el-row :gutter="10" class="card-row">
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5"><div class="">手机号：{{ modals.mobileContact }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5"><div class="">邮箱：{{ modals.emailContact }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5"><div class="">申诉数：{{ modals.appealNum }}</div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4"><div class="">被申诉数：{{ modals.appealedNum }}</div></el-col>
        </el-row>
      </div>
    </el-card>

    <h2 class="marginT40">收付款方式</h2>

    <el-table :data="peyTypeList" border fit highlight-current-row style="width: 100%">
      <el-table-column
        v-loading="loading"
        align="center"
        label="支付方式"
        width="120px"
        element-loading-text="请给我点时间！"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.payType|payTypeName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="账号">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="收付款昵称">
        <template slot-scope="scope">
          <span>{{ scope.row.nick }}</span>
        </template>
      </el-table-column>

      <el-table-column width="170px" align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.realName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="收款码" align="center">
        <template slot-scope="scope">
          <span v-if=" scope.row.payType===2||scope.row.qrCode===null">无</span>
          <img v-else class="paymentImage" :src="scope.row.qrCode||''" alt="收款码">
        </template>
      </el-table-column>

      <el-table-column align="center" label="提现手续费" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.royalty }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="操作" width="110">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="clickEditPayment(scope.row)">编辑</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-card class="box-card marginT40">
      <div slot="header" class="clearfix">
        <span class="card-title">用户资产（可用资产/冻结资产）</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">审核</el-button> -->
      </div>
      <div class="text item">
        <el-row :gutter="10">
          <el-col span="12">
            <div class="card-item borderR">
              <div class="cart-i-t">可用资产 </div>
              <div class="cart-i-v">{{ modals.balance }}</div>
            </div>
          </el-col>
          <el-col span="12">
            <div class="card-item ">
              <div class="cart-i-t">冻结资产(不可用) </div>
              <div class="cart-i-v">{{ modals.frozenBalance }}</div>
            </div></el-col>
        </el-row>

      </div>
    </el-card>

    <div class="section-title-container marginT40">
      <span class="section-title">交易明细</span><span class="container-tip">  已经完成订单：总数<el-link type="primary">{{ modals.orders }} </el-link> </span>
    </div>
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
        auto-complete="off"
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
    <el-dialog :visible.sync="editDialogVisible" title="基础信息修改">
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
        <el-col :span="16">{{ editData.email }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">认证状态：：</el-col>
        <el-col :span="16">{{ editData.kycLevel|kycLevel }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">手机号：</el-col>
        <el-col :span="16" class="">
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
        <el-col :span="8" class="textAlingR">修改密码：</el-col>
        <el-col :span="16">
          <el-input v-model="newPassword" style="width: 240px" ype="text" placeholder="请输入密码" bindex="2" />
        </el-col>
      </el-row>

      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">账号状态：</el-col>
        <el-col :span="16">
          <el-switch
            v-model="newData.active"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />{{ newData.active?'正常/激活':'冻结/未激活' }}
          <el-link type="danger" :underline="false">当前状态： {{ editData.active?'正常/激活':'冻结/未激活' }}</el-link></el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click=" handleAudit() ">保存</el-button>
        <el-button @click="editDialogVisible=false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="paymentDialogVisible" title="编辑手续费" width="40%">
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">支付方式：</el-col>
        <el-col :span="16">{{ editPayment.payType|paymentStatus }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">账号：</el-col>
        <el-col :span="16">
          {{ editPayment.uuid }}
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">昵称：</el-col>
        <el-col :span="16">
          {{ editPayment.nickName||'-' }}
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">姓名：</el-col>
        <el-col :span="16">
          {{ editPayment.realName||'-' }}
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">体现手续费：</el-col>
        <el-col :span="16">
          <el-input v-model="editPayment.royalty" style="width: 240px" type="text" placeholder="请输入手续费比例(%)" suffix="%" tabindex="2" auto-complete="off">
            <template slot="append">%</template>
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR" />
        <el-col v-if="editPayment.qrCode" :span="16">
          <img :src="editPayment.qrCode" alt="收款码" class="payTypeImage">
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleEditroyalty(true)">确认</el-button>
        <el-button type="info" @click="paymentDialogVisible=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { Groups, UserType, Authents, emptySelect, OrderStatus, CounterParty, PayType } from '@/utils/enumeration'
import { role_apply_list, user_web, user_b, users_b, users_web, user_web_save, user_b_save, pay_types, role_apply_audit, royalty_save } from '@/api/usermanage'
import { order_details } from '@/api/order'

export default {
  name: 'Tab',
  components: { pagination },
  directives: { waves },
  data() {
    return {
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
      editDialogVisible: false,
      paymentDialogVisible: false,
      modals: {},
      editData: {
        password: ''
      },
      newData: {
        active: false,
        payTypes: [],
        rebate: undefined,
        groupId: undefined
      },
      editPayment: {}

    }
  },
  computed: {
    ...mapState({
      adminId: state => state.user.principal.adminId
    })
  },
  mounted() {
    this.id = this.$route.params.id

    this.type = this.$route.meta.type
    this.detail(this.id)
    this.getList(null, { userId: this.id })
  },
  methods: {

    detail(id) {
      const requestType = ['', user_web, user_b]
      this.listLoading = true
      requestType[this.type]({ userId: id || this.id }).then(res => {
        if (res.code === 0) {
          this.modals = res.data
          this.getPayTypes()
        }
        console.log('res')
      })
    },
    getPayTypes(id) {
      pay_types({ userId: id || this.id }).then(res => {
        if (res.code === 0) {
          this.peyTypeList = res.data.records
        }
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
      order_details(meta || this.meta, data || { userId: this.id }).then(res => {
        if (res.code === 0) {
          this.list = res.data.records
          this.meta.current = res.data.current
          this.paginationMeta.total = res.data.total
          this.paginationMeta.pages = res.data.pages
        }
      })
    },
    clickAduit() {
      this.editDialogVisible = true
      this.editData = this.modals
      this.newData.active = this.editData.active
      this.editData.password = undefined
    },
    handleAudit() {
      const data = {
        active: this.newData.active,
        id: this.id,
        password: this.newPassword ? this.newPassword : undefined
      }

      this.user_save(data)
    },
    user_save(data) {
      const requestType = ['', user_web_save, user_b_save]
      requestType[this.type](data).then(res => {
        if (res.code === 0) {
          this.editDialogVisible = false
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.detail()
        } else {
          this.$message.error('操作失败')
        }
      }).catch(err => {
        this.$message.error(err || '操作失败')
      })
    },
    clickEditPayment(data) {
      this.editPayment = data
      this.paymentDialogVisible = true
    },
    handleEditroyalty() {
      const data = {
        'id': this.editPayment.id,
        'payType': this.editPayment.payType,
        'royalty': this.editPayment.royalty,
        'userId': this.id
      }
      this.saveRoyalty(data)
    },
    saveRoyalty(data) {
      royalty_save(data).then(res => {
        if (res.code === 0) {
          this.paymentDialogVisible = false
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.getPayTypes()
        } else {
          this.$message.error('操作失败')
        }
      }).catch(err => {
        this.$message.error(err || '操作失败')
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
</style>
