<template>
  <div class="">
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-input v-model="fliterQuery.account" clearable placeholder="手机号" style="width: 220px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="fliterQuery.uuid" clearable placeholder="托底商家id" style="width: 220px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-date-picker
        v-model="fliterQuery.creatDate"
        class="filter-item"
        type="daterange"
        range-separator="至"
        start-placeholder="订单完创建开始日期"
        end-placeholder="结束日期"
      />

      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <!-- <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button> -->
    </div>
    <el-card class="box-card marginT20">
      <div slot="header" class="clearfix">
        <span class="card-title">资产总计（中央财务余额/所有交易提成/保证金/激活金）</span>
        <el-button style="float: right; margin-right:4px" size="small" @click="dialogVisibleWithdraw=true">提现</el-button>
        <el-button style="float: right; margin-right:4px" size="small" @click="dialogVisibleRecharge=true">充值</el-button>
      </div>
      <div class="text item">
        <el-row :gutter="10">
          <el-col :xs="6" :sm="6" :md="6" :lg="5" :xl="5">
            <div class="card-item borderR">
              <div class="cart-i-t">托底出售交易量汇总 </div>
              <div class="cart-i-v">{{ modals.dealAmount||'-' }}</div>
            </div>
          </el-col>
          <el-col :xs="6" :sm="6" :md="6" :lg="5" :xl="5">
            <div class="card-item borderR">
              <div class="cart-i-t">托底出售完成交易量汇总</div>
              <div class="cart-i-v">{{ modals.finishAmount||'-' }}</div>
            </div>
          </el-col>
          <el-col :xs="6" :sm="6" :md="6" :lg="4" :xl="4">
            <div class="card-item borderR">
              <div class="cart-i-t">托底订单数</div>
              <div class="cart-i-v">{{ modals.dealCount||'-' }}</div>
            </div></el-col>
          <el-col :xs="6" :sm="6" :md="6" :lg="5" :xl="5">
            <div class="card-item borderR">
              <div class="cart-i-t">托底完成订单数</div>
              <div class="cart-i-v">{{ modals.finishCount||'-' }}</div>
            </div>
          </el-col>
          <el-col :xs="6" :sm="6" :md="6" :lg="5" :xl="5">
            <div class="card-item ">
              <div class="cart-i-t">托底订单完成率</div>
              <div class="cart-i-v">{{ modals.percent||'-' }}</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

  </div>
</template>

<script>

import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { Groups, UserType, Authents, emptySelect } from '@/utils/enumeration'
import { finance_central, finance_central_flow, system_central_withdraw, system_central_recharge, central_detail } from '@/api/finance'
import {order_statics} from '@/api/thirdChannle'

export default {
  name: 'Tab',
  components: { pagination,  },
  directives: { waves },
  data() {
    return {
      rechargeRules: {
        uuid: [{ required: true, trigger: 'blur', message: '请输入uuid' }],
        amount: [{ required: true, trigger: 'blur', message: '请输入数量' }],
        remark: [{ required: true, trigger: 'blur', message: '请输入备注' }]
      },
      UserType,
      Authents: [{ id: '',
        mame: '',
        label: '请选择'
      }, ...Authents],
      Groups: [emptySelect, ...Groups],
      fliterQuery: {
        account: undefined,
        uuid: undefined,
        creatDate: undefined,
      },
      meta: {
        current: 1,
        size: 10
      },
      recharge: {
        'amount': undefined,
        'remark': undefined,
        'uuid': undefined
      },
      withdraw: {
        'amount': undefined,
        'remark': undefined,
        'uuid': undefined
      },
      loading: false,
      list: [],
      paginationMeta: {
        total: 10,
        pages: 1
      },
      id: undefined,
      dialogVisible: false,
      dialogVisibleWithdraw: false,
      dialogVisibleRecharge: false,

      modals: {
        balance: 128,
        deposit: 43,
        activeGold: 423
      },
      dateBucket: 7,
      editData: {},
      type: 0

    }
  },

  computed: {

  },

  mounted() {
    this.detail()
  },
  methods: {
    handleFilter(resetPage = true) {
      const fliterQuery = this.fliterQuery
      const data = {
        account:fliterQuery.account,
        uuid:fliterQuery.uuid,
      }
      if (fliterQuery.creatDate) {
        data.start = this.$moment(fliterQuery.creatDate[0]).format('YYYY-MM-DD HH:mm:ss')
        data.end = this.$moment(fliterQuery.creatDate[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }

      const meta = this.meta
      resetPage ? meta.current = 1 : null

      this.detail( data)
    },
    detail(data) {
      this.listLoading = true
      order_statics(data).then(res => {
        if (res.code === 0) {
          this.modals = res.data
        }
      })
    },

    paginationChange(e) {
      console.log('paginationChange', e)
      this.meta.size = e.limit
      this.meta.current = e.page
      const fliterQuery = this.fliterQuery
      const data = {
        authent: fliterQuery.authent,
        groupId: fliterQuery.groupId,
        query: fliterQuery.query,
        roleId: fliterQuery.roleId
      }
      if (fliterQuery.date) {
        data.start = this.$moment(fliterQuery.date[0]).format('YYYY-MM-DD HH:mm:ss')
        // data.start = '2019-10-16 12:11:11'
        data.end = this.$moment(fliterQuery.date[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      this.getList(this.meta, data)
    },
    handleFilter() {
      const fliterQuery = this.fliterQuery
      console.log('fliterQuery', this.fliterQuery)
      const data = {
        type: this.type
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
      finance_central_flow(meta, data || { type: this.type }).then(res => {
        if (res.code === 0) {
          this.list = res.data.records
          this.meta.current = res.data.current
          this.paginationMeta.total = res.data.total
          this.paginationMeta.pages = res.data.pages
        }
      })
    },

    dateChange(e) {
      console.log('datachange', e)
      this.dateBucket = undefined
      this.handleFilter()
    },
    clickAduit() {
      this.dialogVisible = true
      this.editData = this.modals
    },
    handlWithdraw() {
      this.$refs.withdrawForm.validate((valid) => {
        if (valid) {
          system_central_withdraw(this.withdraw).then(res => {
            this.dialogVisibleWithdraw = false
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          })
        } else {
          return false
        }
      })

    },
    handlRecharge() {
      this.$refs.rechargeForm.validate((valid) => {
        if (valid) {
          system_central_recharge(this.recharge).then(res => {
            this.dialogVisibleRecharge = false,

            this.$message({
              message: '操作成功',
              type: 'success'
            })
          })
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
