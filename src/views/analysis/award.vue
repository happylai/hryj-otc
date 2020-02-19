<template>
  <div class="tab-container">

    <el-card class="box-card marginT20">
      <div slot="header" class="clearfix">
        <span class="card-title">奖励金额汇总</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">导出当前数据</el-button> -->
      </div>
      <div class="text item">
        <el-row :gutter="10">
          <el-col :span="24">
            <div class="card-item ">
              <div class="cart-i-t">总额 </div>
              <div class="cart-i-v">{{ totalAward }}</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <div class="filter-container" style="margin-bottom: 10px;">
      <el-input v-model="fliterQuery.orderNo" placeholder="订单编号" style="width: 300px;" class="filter-item" />
      <el-input v-model="fliterQuery.userUid" placeholder="用户UID" style="width: 300px;" class="filter-item" />
      <el-select v-model="fliterQuery.type" placeholder="奖励类型" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in AwardType" :key="item.id" :label="item.label" :value="item.id" />
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

    <el-table v-loading="loading" :data="awardList" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="订单编号" min-width="100px" element-loading-text="请给我点时间！">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNo }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="UID">
        <template slot-scope="scope">
          <span>{{ scope.row.userUid }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="奖励金额">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="奖励类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type|awardType }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="150px" label="奖励时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="meta.current" :limit.sync="meta.size" @pagination="paginationChange" />

  </div>
</template>

<script>
import { waves } from '@/directive/waves'
import pagination from '@/components/Pagination'
import { AwardType } from '@/utils/enumeration'
import { order_awards } from '@/api/statistic'
export default {
  name: 'OrderAward',
  components: { pagination },
  directives: { waves },
  data() {
    return {
      AwardType,
      fliterQuery: {
        page: 1,
        size: 20,
        date: null,
        orderNo: null,
        userUid: null,
        type: null
      },
      totalAward: null,
      awardList: [],
      loading: false,
      meta: {
        current: 1,
        size: 10
      },
      paginationMeta: {
        total: 10,
        pages: 1
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleFilter() {
      const fliterQuery = this.fliterQuery
      const data = {
        type: fliterQuery.type,
        orderNo: fliterQuery.orderNo,
        userUid: fliterQuery.userUid
      }
      if (fliterQuery.date) {
        data.start = this.$moment(fliterQuery.date[0]).format('YYYY-MM-DD HH:mm:ss')
        data.end = this.$moment(fliterQuery.date[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      const meta = this.meta
      meta.current = 1
      this.getList(meta, data)
    },
    getList(meta, data) {
      this.loading = true
      order_awards(meta || this.meta, data || {}).then(res => {
        this.loading = false
        if (res.code === 0) {
          this.totalAward = res.data.totalAward
          this.awardList = res.data.details.records
          this.meta.current = res.data.details.current
          this.paginationMeta.total = res.data.details.total
          this.paginationMeta.pages = res.data.details.pages
        }
      })
    },
    paginationChange(e) {
      this.meta.size = e.limit
      this.meta.current = e.page
      const fliterQuery = this.fliterQuery
      const data = {
        type: fliterQuery.type,
        orderNo: fliterQuery.orderNo,
        userUid: fliterQuery.userUid
      }
      if (fliterQuery.date) {
        data.start = this.$moment(fliterQuery.date[0]).format('YYYY-MM-DD HH:mm:ss')
        data.end = this.$moment(fliterQuery.date[1]).format('YYYY-MM-DD') + ' 23:59:59'
      }
      this.getList(this.meta, data)
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
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
</style>
