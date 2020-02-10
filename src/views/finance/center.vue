<template>
  <div class="tab-container">

    <el-card class="box-card marginT20">
      <div slot="header" class="clearfix">
        <span class="card-title">资产总计（所有交易提成/保证金/激活金）</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">审核</el-button> -->
      </div>
      <div class="text item">
        <el-row :gutter="10">
          <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8">
            <div class="card-item borderR">
              <div class="cart-i-t">交易提成 </div>
              <div class="cart-i-v">{{ modals.royalty||'-' }}</div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8">
            <div class="card-item borderR">
              <div class="cart-i-t">保证金</div>
              <div class="cart-i-v">{{ modals.deposit||'-' }}</div>
            </div></el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8">
            <div class="card-item ">
              <div class="cart-i-t">激活金</div>
              <div class="cart-i-v">{{ modals.activeBalance||'-' }}</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="box-card marginT20">
      <div slot="header" class="clearfix">
        <span class="card-title">补贴支出（交易补贴/夜间补贴/达量补贴/退还激活金/返利补贴）</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">审核</el-button> -->
      </div>
      <div class="text item">
        <el-row :gutter="10">
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5">
            <div class="card-item borderR">
              <div class="cart-i-t">交易补贴 </div>
              <div class="cart-i-v">{{ modals.dealSubsidy }}</div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5">
            <div class="card-item borderR">
              <div class="cart-i-t">夜间补贴</div>
              <div class="cart-i-v">{{ modals.nightSubsidy }}</div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5">
            <div class="card-item borderR">
              <div class="cart-i-t">达量补贴</div>
              <div class="cart-i-v">{{ modals.amountSubsidy }}</div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="5" :xl="5">
            <div class="card-item borderR">
              <div class="cart-i-t">退还激活金 </div>
              <div class="cart-i-v">{{ modals.depositBack }}</div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
            <div class="card-item ">
              <div class="cart-i-t">邀请奖励</div>
              <div class="cart-i-v">{{ modals.shareSubsidy }}</div>
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
        class="filter-item"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="dateChange"
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

      <el-table-column min-width="120px" align="center" label="成交订单数">
        <template slot-scope="scope">
          <span>{{ scope.row.passOrderCount }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" label="实际成交额">
        <template slot-scope="scope">
          <span>{{ scope.row.realityAmount }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="交易提成" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.royalty }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="系统补贴" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.systemSubsidy }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="meta.current" :limit.sync="meta.size" @pagination="paginationChange" />
    <!-- <el-dialog :visible.sync="dialogVisible" title="基础信息审核">
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">用户名ID：</el-col>
        <el-col :span="16">{{ editData.username }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">用户名：</el-col>
        <el-col :span="16">{{ editData.email }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">真实姓名：</el-col>
        <el-col :span="16">{{ editData.email }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">认证状态：：</el-col>
        <el-col :span="16">{{ editData.email }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">手机号：</el-col>
        <el-col :span="16">
          {{ editData.ip }}
          <el-checkbox v-model="ipOnly">
            <el-link type="danger" :underline="false">认证状态</el-link>
          </el-checkbox>
          <el-link type="primary">详情</el-link>
        </el-col>
        <el-col :span="16" />
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">身份证号：</el-col>
        <el-col :span="16">{{ editData.email }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">登陆邮箱：</el-col>
        <el-col :span="16">{{ editData.email }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">登陆密码：</el-col>
        <el-col :span="16">{{ editData.email }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">返佣比:</el-col>
        <el-col :span="16">{{ editData.email }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">角色升级：</el-col>
        <el-col :span="16">
          <el-select v-model="newRole" placeholder="更换角色">
            <el-option v-for="(item,index) in Roles" :key="index" :label="item.label" :value="item.id" />
          </el-select>
          <el-link type="danger" :underline="false">当前登录角色：{{ editData.role }}</el-link>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">所在分组：</el-col>
        <el-col :span="16">
          <el-select v-model="newAuth" placeholder="更换权限">
            <el-option v-for="(item,inedex) in Auths" :key="inedex+'auth'" :label="item.label" :value="item.id" />
          </el-select>
          <el-link type="danger" :underline="false">当前登录权限：{{ editData.auth }}</el-link>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">账号状态：</el-col>
        <el-col :span="16">{{ editData.createTime }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">收付款方式：</el-col>
        <el-col :span="16">{{ editData.createTime }}</el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="16" :offset="8">
          <el-checkbox v-model="isfreeze">
            <el-link type="danger" :underline="false">冻结该账号</el-link>
          </el-checkbox>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click=" saveEdit() ">通过</el-button>
        <el-button @click="dialogVisible = false">不通过</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>

import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { Groups, UserType, Authents, emptySelect } from '@/utils/enumeration'
import { finance_central, finance_central_flow } from '@/api/finance'

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
      dateBucket: 7,
      editData: {}

    }
  },

  computed: {

  },

  mounted() {
    this.dateBucketChange(7)
    this.detail()
  },
  methods: {

    detail(id) {
      this.listLoading = true
      finance_central().then(res => {
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
      this.getList(this.meta,data)
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
    getList(meta, data) {
      finance_central_flow(meta, data).then(res => {
        if (res.code === 0) {
          this.list = res.data.records
          this.meta.current = res.data.current
          this.paginationMeta.total = res.data.total
          this.paginationMeta.pages = res.data.pages
        }
      })
    },
    dateBucketChange(e) {
      console.log('e', e)
      const start = this.$moment().subtract(e, 'days')
      const end = this.$moment(new Date())

      this.fliterQuery.date = [start, end]
      this.handleFilter()
    },
    dateChange(e) {
      console.log('datachange', e)
      this.dateBucket = undefined
      this.handleFilter()
    },
    clickAduit() {
      this.dialogVisible = true
      this.editData = this.modals
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
