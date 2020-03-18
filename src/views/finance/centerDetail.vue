<template>
  <div class="">

    <h2>流水明细</h2>

    <el-table :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column min-width="120px" align="center" label="订单号">
        <template slot-scope="scope">
          <span>{{ scope.row.orderId }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="第三方订单号">
        <template slot-scope="scope">
          <span>{{ scope.row.merchantOrderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="120px" label="交易总价">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column min-width="120px" align="center" label="交易数量">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column> -->

      <el-table-column min-width="120px" align="center" label="买家id">
        <template slot-scope="scope">
          <span>{{ scope.row.buyerId }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="卖家ID">
        <template slot-scope="scope">
          <span>{{ scope.row.sellerId }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="交易类别" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.type|billTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="170px" align="center" label="支付方式">
        <template slot-scope="scope">
          <span>{{ scope.row.payType|payTypeName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="交易补贴" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.subsidy }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手续费" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.fee }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="申请时间" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.orderCreateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="完成时间" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.completeTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="备注" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="meta.current" :limit.sync="meta.size" @pagination="paginationChange" />

  </div>
</template>

<script>

import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { Groups, UserType, Authents, emptySelect } from '@/utils/enumeration'
import { finance_central, finance_central_flow, system_central_withdraw, system_central_recharge, central_detail } from '@/api/finance'

export default {
  name: 'Tab',
  components: { pagination },
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
        page: 1,
        size: 20,
        date: null,
        query: undefined,
        authent: undefined,
        groupId: undefined
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
    this.getList()
  },
  methods: {

    paginationChange(e) {
      console.log('paginationChange', e)
      this.meta.size = e.limit
      this.meta.current = e.page

      this.getList(this.meta,)
    },

    getList(meta, data) {
      central_detail(meta, data || { type: this.type }).then(res => {
        if (res.code === 0) {
          this.list = res.data.records
          this.meta.current = res.data.current
          this.paginationMeta.total = res.data.total
          this.paginationMeta.pages = res.data.pages
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
