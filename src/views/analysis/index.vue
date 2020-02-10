<template>
  <div class="tab-container ">

    <el-card class="box-card marginT20">
      <div slot="header" class="clearfix">
        <span class="card-title">交易额总计（交易所交易资金总额）</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">审核</el-button> -->
      </div>
      <div class="text item">
        <el-row :gutter="10">
          <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8">
            <div class="card-item borderR">
              <div class="cart-i-t">交易总额 </div>
              <div class="cart-i-v">{{ modals.totalAmount }}</div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8">
            <div class="card-item borderR">
              <div class="cart-i-t">保证金(不可用) </div>
              <div class="cart-i-v">{{ modals.deposit }}</div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8">
            <div class="card-item ">
              <div class="cart-i-t">激活金  </div>
              <div class="cart-i-v">{{ modals.activeBalance }}</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="box-card marginT20">
      <div slot="header" class="clearfix">
        <span class="card-title">订单成交额（上限、下限）</span>
        </span></div>
      <div class="text item">
        <el-row :gutter="10">
          <el-col :span="12">
            <div class="card-item borderR">
              <div class="cart-i-t">最大成交额 </div>
              <div class="cart-i-v">{{ modals.maxAmount }}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="card-item ">
              <div class="cart-i-t">最小成交额</div>
              <div class="cart-i-v">{{ modals.minAmount }}</div>
            </div>
          </el-col>

        </el-row>
      </div>
    </el-card>
    <h3>整体统计</h3>
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-input v-model="fliterQuery.userUid" clearable placeholder="B端UID" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="fliterQuery.payChannel" clearable placeholder="支付通道" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in PayChannel" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-select v-model="fliterQuery.payType" clearable placeholder="支付方式" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in PayType" :key="item.id" :label="item.label" :value="item.id" />
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
    <div class="staticTable">
      <el-row class="staticRow rowHeader" :gutter="10">
        <el-col :span="6">
          <span>统计名称</span>
        </el-col>
        <el-col :span="6">
          <span>今日数据</span>
        </el-col>
        <el-col :span="6">
          <span>昨日数据</span>
        </el-col>
        <el-col :span="6">
          <span>累计数据</span>
        </el-col>
      </el-row>

      <el-row class="staticRow" :gutter="10">
        <el-col :span="6">
          <span>接口调用次数  |  总金额</span>
        </el-col>
        <el-col :span="6">
          <span>{{ statics.today.apiCount }} | {{ statics.today.finishCountAmount }}</span>
        </el-col>
        <el-col :span="6">
          <span>{{ statics.yesterday.apiCount }} | {{ statics.yesterday.finishCountAmount }}</span>
        </el-col>
        <el-col :span="6">
          <span>{{ statics.all.apiCount }}| {{ statics.all.finishCountAmount }}</span>
        </el-col>
      </el-row>

      <el-row class="staticRow" :gutter="10">
        <el-col :span="6">
          <span>B端用户未扫码订单数  |  占比</span>
        </el-col>
        <el-col :span="6">
          <span>{{ statics.today.noMatch }} | {{ statics.today.noMatchPercent }}</span>
        </el-col>
        <el-col :span="6">
          <span>{{ statics.yesterday.noMatch }} | {{ statics.yesterday.noMatchPercent }}</span>
        </el-col>
        <el-col :span="6">
          <span>{{ statics.all.noMatch }} | {{ statics.all.noMatchPercent }}</span>
        </el-col>
      </el-row>

      <el-row class="staticRow" :gutter="10">
        <el-col :span="6">
          <span>匹配成功订单数  |  总金额</span>
        </el-col>
        <el-col :span="6">
          <span>{{ statics.today.matchSuccess }} | {{ statics.today.matchSuccessAmount }}</span>
        </el-col>
        <el-col :span="6">
          <span>{{ statics.yesterday.matchSuccess }} | {{ statics.yesterday.matchSuccessAmount }}</span>
        </el-col>
        <el-col :span="6">
          <span>{{ statics.all.matchSuccess }} | {{ statics.all.matchSuccessAmount }}</span>
        </el-col>
      </el-row>
      <el-row class="staticRow" :gutter="10">
        <el-col :span="6">
          <span>匹配失败订单数  |  占比</span>
        </el-col>
        <el-col :span="6">
          <span>{{ statics.today.matchFailedAmount }} | {{ statics.today.matchFailedPercent }}</span>
        </el-col>
        <el-col :span="6">
          <span>{{ statics.yesterday.matchFailedAmount }} | {{ statics.yesterday.matchFailedPercent }}</span>
        </el-col>
        <el-col :span="6">
          <span>{{ statics.all.matchFailedAmount }} | {{ statics.all.matchFailedPercent }}</span>
        </el-col>
      </el-row>
      <el-row class="staticRow" :gutter="10">
        <el-col :span="6">
          <span>完成订单数  |  总金额</span>
        </el-col>
        <el-col :span="6">
          <span>{{ statics.today.finishCount }} | {{ statics.today.finishCountAmount }}</span>
        </el-col>
        <el-col :span="6">
          <span>{{ statics.yesterday.finishCount }} | {{ statics.yesterday.finishCountAmount }}</span>
        </el-col>
        <el-col :span="6">
          <span>{{ statics.all.finishCount }} | {{ statics.all.finishCountAmount }}</span>
        </el-col>
      </el-row>
      <el-row class="staticRow" :gutter="10">
        <el-col :span="6">
          <span>系统成功率</span>
        </el-col>
        <el-col :span="6">
          <span>{{ statics.today.successPercentSys||'0' }}</span>

        </el-col>
        <el-col :span="6">
          <span>{{ statics.yesterday.successPercentSys }} </span>
        </el-col>
        <el-col :span="6">
          <span>{{ statics.all.successPercentSys }} </span>
        </el-col>
      </el-row>
      <el-row class="staticRow" :gutter="10">
        <el-col :span="6">
          <span>B端成功率</span>
        </el-col>
        <el-col :span="6">
          <span>{{ statics.today.successPercentB||'0' }}</span>
        </el-col>
        <el-col :span="6">
          <span>{{ statics.yesterday.successPercentB }}</span>
        </el-col>
        <el-col :span="6">
          <span>{{ statics.all.successPercentB }}</span>
        </el-col>
      </el-row>

    </div>
    <staticDetail />

  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { PayChannel, PayType } from '@/utils/enumeration'
import { data_center, merchant_statics_total, merchant_statics_day } from '@/api/statistic'
import staticDetail from './detail'

export default {
  name: 'Tab',
  components: { pagination, staticDetail },
  directives: { waves },
  data() {
    return {
      PayChannel,
      PayType,

      fliterQuery: {
        date: null,
        payChannel: undefined,
        userUid: undefined,
        payType: undefined

      },
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
      modals: {
        balance: 128,
        deposit: 43,
        activeGold: 423

      },
      statics: {
        today: {},
        yesterday: {},
        all: {}
      },
      editData: {}

    }
  },

  computed: {

  },

  mounted() {
    this.detail()
    this.get_merchant_statics()
  },
  methods: {

    detail() {
      this.listLoading = true
      data_center().then(res => {
        if (res.code === 0) {
          this.modals = res.data
        }
        console.log('res')
      })
    },
    get_merchant_statics(meta, data) {
      merchant_statics_total(meta || this.meta, data).then(res => {
        if (res.code === 0) {
          this.statics = res.data
          this.meta.current = res.data.current
        }
      })
    },

    paginationChange(e) {
      console.log('paginationChange', e)
      this.meta.size = e.limit
      this.meta.current = e.page
      this.get_merchant_statics()
    },
    handleFilter() {
      const fliterQuery = this.fliterQuery
      console.log('fliterQuery', this.fliterQuery)
      const data = {
        ...this.fliterQuery,
        date: undefined
      }
      if (fliterQuery.date) {
        data.start = this.$moment(fliterQuery.date[0]).format('YYYY-MM-DD HH:mm:ss')
        // data.start = '2019-10-16 12:11:11'
        data.end = this.$moment(fliterQuery.date[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      const meta = this.meta
      meta.current = 1
      this.get_merchant_statics(meta, data)
    },
    getList() {},
    clickAduit() {
      this.dialogVisible = true
      this.editData = this.modals
    }

  }
}
</script>

<style scoped>
.tab-container{
  padding:0 30px;
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
.staticRow{
  border-bottom:1px solid #ddd;
  padding:10px
}
.staticRow:nth-child(2n)
{
background:#FAFAFA;
}
.rowHeader{
  font-size: 16px;
  font-weight: bold
}
.staticTable{
  font-size: 14px;
  border:1px solid #dddddd;
  padding:0 8px
}

</style>
