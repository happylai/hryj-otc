<template>
<<<<<<< HEAD
  <div class="tab-container">
    <!-- <el-tag>mounted times ：{{ createdTimes }}</el-tag>
    <el-alert :closable="false" style="width:200px;display:inline-block;vertical-align: middle;margin-left:30px;" title="Tab with keep-alive" type="success" /> -->
    <el-tabs v-model="activeName" style="margin-top:15px;">
      <div class="filter-container" style="margin-bottom: 10px;">
        <el-input v-model="listQuery.keywords" placeholder="订单ID/广告ID/买家/卖家/备注" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-select v-model="listQuery.importance" placeholder="订单类型" clearable style="width: 140px" class="filter-item">
          <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select v-model="listQuery.type" placeholder="支付方式" clearable class="filter-item" style="width: 140px">
          <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
        </el-select>
        <el-select v-model="listQuery.sort" placeholder="订单状态" style="width: 140px" class="filter-item" @change="handleFilter">
          <el-option v-for="item in OrderStatus" :key="item.id" :label="item.label" :value="item.id" />
        </el-select>
        <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>

      </div>
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <keep-alive>
          <tab-pane v-if="activeName==item.key" :data="allList" :type="item.key" @create="showCreatedTimes" />
        </keep-alive>
      </el-tab-pane>
      <pagination v-show="allListMeta.total>0" :total="allListMeta.total" :page.sync="allListMeta.pages" :limit.sync="allListMeta.size" @pagination="getList" />
    </el-tabs>

    <el-dialog :visible.sync="dialogPvVisible" title="订单详情">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
=======
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

>>>>>>> dev
  </div>
</template>

<script>
<<<<<<< HEAD
import tabPane from './components/TabPane'
import { mapState, mapGetters, mapActions } from 'vuex' //先要引入
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { OrderStatus, PayType } from '@/utils/enumeration'

export default {
  name: 'Tab',
  components: { tabPane },
  directives: { waves },
  data() {
    return {
      tabMapOptions: [
        { label: '交易所用户订单', key: 'all' },
        { label: '站点用户订单', key: 'site' }
      ],
      activeName: 'all',
      createdTimes: 0,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        keywords: undefined,
        orderType: undefined,
        paymentType: undefined,
        orderStatus: undefined,
        dialogPvVisible: true
        // orderStatus:OrderStatus,
        // payType:PayType
      }
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  computed: {
    ...mapState({
      allList: state => state.order.allList,
      allListMeta: state => state.order.allMeta
    })
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  mounted() {
    this.getList()
=======
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
>>>>>>> dev
  },
  methods: {
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    },
<<<<<<< HEAD
    getList() {
      this.listLoading = true
      this.$store.dispatch('order/getAllList')
      // 	fetchList(this.listQuery).then(response => {
      // 		this.list = response.data.items
      // 		this.total = response.data.total

      // 		// Just to simulate the time of the request
      // 		setTimeout(() => {
      // 			this.listLoading = false
      // 		}, 1.5 * 1000)
      // })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }
=======

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

>>>>>>> dev
  }
}
</script>

<style scoped>
<<<<<<< HEAD
.tab-container {
  margin: 30px;
}
=======

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

>>>>>>> dev
</style>
