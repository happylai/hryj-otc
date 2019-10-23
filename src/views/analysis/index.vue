<template>
  <div class="tab-container card-container">

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
              <div class="cart-i-v">{{ modals.balance }}</div>
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
              <div class="cart-i-t">激活金 <el-link :underline="false" type="success">(已退还)</el-link> </div>
              <div class="cart-i-v">{{ modals.activeGold }}</div>
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
              <div class="cart-i-v">{{ modals.balance }}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="card-item ">
              <div class="cart-i-t">最小成交额</div>
              <div class="cart-i-v">{{ modals.deposit }}</div>
            </div>
          </el-col>

        </el-row>
      </div>
    </el-card>

    <el-card class="box-card marginT20">
      <div slot="header" class="clearfix">
        <span class="card-title">接口调用统计</span>
        <el-button type="primary" size="small" style="float: right;">详情</el-button>
        </span></div>
      <div class="text item">
        <el-row :gutter="10">
          <el-col :span="12">
            <div class="card-item borderR">
              <div class="cart-i-t">总调用次数 </div>
              <div class="cart-i-v">{{ modals.balance }}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="card-item ">
              <div class="cart-i-t">失败次数</div>
              <div class="cart-i-v">{{ modals.deposit }}</div>
            </div>
          </el-col>

        </el-row>
      </div>
    </el-card>

    <el-card class="box-card marginT20">
      <div slot="header" class="clearfix">
        <span class="card-title">匹配接口统计</span>
        <el-button type="primary" size="small" style="float: right;">详情</el-button>
        </span></div>
      <div class="text item">
        <el-row :gutter="10">
          <el-col :span="12">
            <div class="card-item borderR">
              <div class="cart-i-t">总调用次数 </div>
              <div class="cart-i-v">{{ modals.balance }}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="card-item ">
              <div class="cart-i-t">失败次数</div>
              <div class="cart-i-v">{{ modals.deposit }}</div>
            </div>
          </el-col>

        </el-row>
      </div>
    </el-card>

    <el-card class="box-card marginT20">
      <div slot="header" class="clearfix">
        <span class="card-title">支付接口统计</span>
        <el-button type="primary" size="small" style="float: right;">详情</el-button>
        </span></div>
      <div class="text item">
        <el-row :gutter="10">
          <el-col :span="12">
            <div class="card-item borderR">
              <div class="cart-i-t">总调用次数 </div>
              <div class="cart-i-v">{{ modals.balance }}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="card-item ">
              <div class="cart-i-t">失败次数</div>
              <div class="cart-i-v">{{ modals.deposit }}</div>
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
import { role_apply_list, role_apply_detail, role_apply_audit } from '@/api/usermanage'

export default {
  name: 'Tab',
  components: { pagination },
  directives: { waves },
  data() {
    return {
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
      editData: {}

    }
  },

  computed: {

  },

  mounted() {
    this.id = this.$route.params.id
    // this.detail(this.id)
  },
  methods: {
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    },

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
      const meta = this.meta
      meta.current = 1
      this.getList(meta, data)
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
