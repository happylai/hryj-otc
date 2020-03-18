<template>
  <div class="">

    <h2>用户黑名单</h2>

    <el-table :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column min-width="120px" align="center" label="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="ip">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="拉黑时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
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

import { restrict_ip as listApi, restrict_ip_remove } from '@/api/params'

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
      listApi(meta, data || { type: this.type }).then(res => {
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

</style>
