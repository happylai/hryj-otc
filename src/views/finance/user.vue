<template>
  <div class="tab-container">
    <el-tabs v-model="activeType" style="margin-top:15px;">
      <el-tab-pane :key="tabMapOptions[0].key" :label="tabMapOptions[0].label" :name="tabMapOptions[0].key">
                  <el-row>
          <el-col style="text-align:center">
            <el-link  type="info">更新时间： {{modals.updateTime}}</el-link>
          </el-col>
        </el-row>
        
        <el-card class="box-card marginT20">
          <div slot="header" class="clearfix">
            <span class="card-title">资产总计（所有交易所用户资产/保证金）</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">审核</el-button> -->
          </div>
          <div class="text item">
            <el-row :gutter="10">
              <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8">
                <div class="card-item borderR">
                  <div class="cart-i-t">累计资产 </div>
                  <div class="cart-i-v">{{ modals.balance }}</div>
                </div>
              </el-col>
              <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8">
                <div class="card-item borderR">
                  <div class="cart-i-t">保证金</div>
                  <div class="cart-i-v">{{ modals.deposit }}</div>
                </div></el-col>
              <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8">
                <div class="card-item ">
                  <div class="cart-i-t">激活金</div>
                  <div class="cart-i-v">{{ modals.activeBalance }}</div>
                </div>
              </el-col>
            </el-row>

          </div>
        </el-card>

        <el-card class="box-card marginT20">
          <div slot="header" class="clearfix">
            <span class="card-title">角色资产总计</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">审核</el-button> -->
          </div>
          <div class="text item">
            <el-row :gutter="10">
              <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6">
                <div class="card-item borderR">
                  <div class="cart-i-t">普通 </div>
                  <div class="cart-i-v">{{ modals.dealerBalance }}</div>
                </div>
              </el-col>
              <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6">
                <div class="card-item borderR">
                  <div class="cart-i-t">信任</div>
                  <div class="cart-i-v">{{ modals.trustBalance }}</div>
                </div></el-col>
              <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6">
                <div class="card-item borderR">
                  <div class="cart-i-t">大宗</div>
                  <div class="cart-i-v">{{ modals.stapleBalance }}</div>
                </div>
              </el-col>
              <el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6">
                <div class="card-item ">
                  <div class="cart-i-t">至尊</div>
                  <div class="cart-i-v">{{ modals.supremacyBalance }}</div>
                </div>
              </el-col>

            </el-row>

          </div>
        </el-card>

        <h2>流水统计</h2>
        <div class="filter-container" style="margin-bottom: 10px;">
          <el-radio-group v-model="dateBucket" @change="dateBucketChange">
            <el-radio-button :label="7">最近一周</el-radio-button>
            <el-radio-button :label="14">最近两周</el-radio-button>
            <el-radio-button :label="30">最近30天</el-radio-button>
          </el-radio-group>
          <el-date-picker
            v-model="fliterQuery.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change='dateChange'
          />

        </div>
        <el-table :data="list" border fit highlight-current-row style="width: 100%">
          <el-table-column
            v-loading="loading"
            align="center"
            label="日期"
            width="120"
            element-loading-text="请给我点时间！"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.createDay }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="120px" align="center" label="下单数">
            <template slot-scope="scope">
              <span>{{ scope.row.placeOrderCount }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="120px" align="center" label="下单总额">
            <template slot-scope="scope">
              <span>{{ scope.row.orderAmount }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="120px" align="center" label="支付订单数">
            <template slot-scope="scope">
              <span>{{ scope.row.passOrderCount }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="120px" label="实践成交额">
            <template slot-scope="scope">
              <span>{{ scope.row.realityAmount }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="paginationMeta.pages" :limit.sync="meta.size" @pagination="paginationChange" />
        
      </el-tab-pane>
      <el-tab-pane :key="tabMapOptions[1].key" :label="tabMapOptions[1].label" :name="tabMapOptions[1].key">
        <el-row>
          <el-col style="text-align:center">
            <el-link  type="info">更新时间： {{modals2.updateTime}}</el-link>
          </el-col>
        </el-row>
        
        <el-card class="box-card marginT20">
          <div slot="header" class="clearfix">
            <span class="card-title">资产总计（余额）</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">审核</el-button> -->
          </div>
          <div class="text item">
            <el-row :gutter="10">
              <el-col :span="24" >
                <div class="card-item ">
                  <div class="cart-i-t">累计资产 </div>
                  <div class="cart-i-v">{{ modals2.balance }}</div>
                </div>
              </el-col>

            </el-row>

          </div>
        </el-card>

        <h2>流水统计</h2>
        <div class="filter-container" style="margin-bottom: 10px;">
          <el-radio-group v-model="dateBucket" @change="dateBucketChange">
            <el-radio-button :label="7">最近一周</el-radio-button>
            <el-radio-button :label="14">最近两周</el-radio-button>
            <el-radio-button :label="30">最近30天</el-radio-button>
          </el-radio-group>
          <el-date-picker
            v-model="fliterQuery.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change='dateChange'
          />

        </div>
        <el-table :data="list" border fit highlight-current-row style="width: 100%">
          <el-table-column
            v-loading="loading"
            align="center"
            label="日期"
            width="120"
            element-loading-text="请给我点时间！"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.createDay }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="120px" align="center" label="下单数">
            <template slot-scope="scope">
              <span>{{ scope.row.placeOrderCount }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="120px" align="center" label="下单总额">
            <template slot-scope="scope">
              <span>{{ scope.row.orderAmount }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="120px" align="center" label="支付订单数">
            <template slot-scope="scope">
              <span>{{ scope.row.passOrderCount }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="120px" label="实践成交额">
            <template slot-scope="scope">
              <span>{{ scope.row.realityAmount }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="paginationMeta.pages" :limit.sync="meta.size" @pagination="paginationChange" />
        
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { Groups, UserType, Authents, emptySelect } from '@/utils/enumeration'
import { finance_user_b, finance_user_web } from '@/api/finance'


export default {
  name: 'Tab',
  components: {  pagination },
  directives: { waves },
  data() {
    return {
      UserType,
      Authents: [{ id: '',
        mame: '',
        label: '请选择'
      }, ...Authents],
      Groups: [emptySelect, ...Groups],
      tabMapOptions: [
        { label: '站内用户', key: '0' },
        { label: 'B端商户', key: '1' },
      ],
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
      activeType:'0',
      loading: false,
      list: [],
      paginationMeta: {
        total: 10,
        pages: 1
      },
      id: undefined,
      dialogVisible: false,
      modals: {},
      modals2: {},
      editData: {},
      dateBucket:7,


    }
  },

  computed: {

  },

  mounted() {
    this.detail()
    this.detail2()
  },
  methods: {
    detail() {
      this.listLoading = true
      finance_user_web().then(res => {
        if (res.code === 0) {
          this.modals = res.data
        }
        console.log('res')
      })
    },
    detail2() {
      this.listLoading = true
      finance_user_b().then(res => {
        if (res.code === 0) {
          this.modals2 = res.data
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
    getList() {
      this.$message('暂未统计');
    },
    dateBucketChange(e) {
      console.log("e",e)
      const start=this.$moment().subtract(e, 'days')
      const end=this.$moment(new Date())
      
      this.fliterQuery.date=[start,end];
      this.handleFilter()
    },
    dateChange(e) {
      console.log('datachange',e)
      this.dateBucket=undefined;
      this.handleFilter()
    },

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
