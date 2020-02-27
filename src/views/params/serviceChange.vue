<template>
  <div class="tab-container" :class="type==='1'?'digbox':null">
    <el-tabs v-model="filterQuery.type" style="margin-top:15px;" @tab-click="handleTabClick">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key" />
    </el-tabs>
    <!-- <tab-pane :loading="loading" :data="list" @edit="handlEdit" /> -->
    <div class="filter-container" style="margin-bottom: 10px;">

      <el-select v-model="filterQuery.channelCode" placeholder="支付通道" clearable style="width: 160px" class="filter-item">
        <el-option v-for="item in PayChannel" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>

      <el-select v-model="filterQuery.schemaCode" placeholder="收款方式" clearable style="width: 160px" class="filter-item">
        <el-option v-for="item in PaySchema" :key="item.id" :disabled="(filterQuery.channelCode!==undefined&&filterQuery.channelCode!=='')&&filterQuery.channelCode!==item.parentId" :label="item.label" :value="item.id" />
      </el-select>

      <el-button v-show="filterQuery.type==='0'" v-waves class="filter-item" style="margin-left: 40px" type="primary" @click="handleFilter">
        查询
      </el-button>
      <el-button v-if="!editAbled" v-waves class="filter-item" style="margin-left: 40px" type="primary" @click="editAbled=true">
        编辑
      </el-button>
      <el-button v-if="editAbled" v-waves class="filter-item" style="margin-left: 40px" type="primary" @click="handleSave">
        保存
      </el-button>

    </div>
    <el-table v-loading="loading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        align="center"
        :label="filterQuery.type==='1'?'支付方式':'通道名称'"
        width="120"
        element-loading-text="请给我点时间！"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.channelName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="通道编码"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.channelId }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="filterQuery.type==='0'"
        align="center"
        label="收款方式"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.schemaName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="filterQuery.type==='0'&&type==='0'"
        align="center"
        label="通道说明"
        min-width="180"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.schemaDesc }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="手续费费率"
        min-width="120"
      >
        <template slot-scope="scope">
          <el-input v-if="editAbled" v-model="scope.row.rate" placeholder="请编辑手续费率" style="width: 120px;" class="filter-item" />

          <span v-else>{{ scope.row.rate }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        :label="type==='1'?'开关':'全局开关'"
        width="120"
      >
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.status }}</span> -->
          <el-switch
            v-model="scope.row.status"
            :disabled="!editAbled"
          />
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="meta.total>0" :total="meta.total" :page.sync="meta.pages" :limit.sync="meta.size" @pagination="metaChange" />

  </div>
</template>

<script>
import tabPane from './components/TabPane'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { UserType, TimeParamsType, PayType, PayTypeUstd, CounterParty, PayChannel, PaySchema } from '@/utils/enumeration'
import { subsidies, subsidy_save, subsidy_del, merchant_rates, merchant_rate_save } from '@/api/params'
import { merchant_rates as current_merchant_rates, merchant_rate_save as current_merchant_rate_save } from '@/api/usermanage'
import { groupsConstName, userRolesConstName, adminRolesConstName } from '@/utils'
export default {
  name: 'Tab',
  components: { tabPane, pagination },
  directives: { waves },
  props: {
    userid: {
      default: undefined
    },
    type: {
      default: '0'
    }
  },
  data() {
    return {
      PayTypeUstd,
      userRolesConstName,
      UserType,
      PayType,
      CounterParty,
      PayChannel,
      PaySchema,
      tabMapOptions: [
        { label: '入金手续费', key: '0' },
        { label: '出金手续费', key: '1' }
      ],

      addUserType: {
        0: [5, 6, 7, 8],
        1: [5, 6, 7, 8],
        2: [5, 6, 7, 8]

      },
      list: [],
      loading: false,
      dialogVisible: false,
      meta: {
        current: 1,
        size: 10,
        total: 1,
        pages: 1
      },

      filterQuery: {
        schemaCode: undefined,
        channelCode: undefined,
        type: 0
      },
      editData: {
        roleId: 1
      },
      editAbled: false
    }
  },
  watch: {
    filterQuery(val) {
      // if (val === undefined) {
      //   val = 0
      // }
      const type = val.type
      this.$router.push(`${this.$route.path}?tab=${type}`)
    }
  },
  computed: {
    ...mapGetters([
      'groupsConst',
      'userRolesConst',
      'adminRolesConst'
    ]),
    ...mapState({
      adminId: state => state.user.principal.adminId
    })
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    tab === undefined ? this.filterQuery.type === 0 : this.filterQuery.type = tab.toString()
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleTabClick(tab, event) {
      this.meta.current = 1
      console.log('tab', tab, event)
      this.$router.push(`${this.$route.path}?tab=${tab.name}`)
      this.getList()
    },
    metaChange(e) {
      console.log('e', e)
      const meta = { current: e.page, size: e.limit }
      this.getList(meta)
    },
    getList(meta, data) {
      this.loading = true
      const apiList = [merchant_rates, current_merchant_rates]
      apiList[this.type](meta || this.meta, data || { ...this.filterQuery, userId: this.userid }).then(res => {
        console.log('res', res)
        this.loading = false
        if (res.code === 0) {
          this.editData = false
          this.list = res.data.records
          this.meta.total = res.data.total
          this.meta.size = res.data.size
          this.meta.current = res.data.current
        }
      }).catch(err => {
        console.log('err', err)
        this.loading = false
      })
    },
    handleFilter() {
      this.meta.current = 1
      this.getList()
    },
    handlEdit(data) {
      this.editData = data
      this.dialogVisible = true
    },

    handleSave() {
      const data = this.editData
      console.log('handleSave', data)
      const postData = {
        rates: this.list,
        userId: this.userid
      }
      const apiList = [merchant_rate_save, current_merchant_rate_save]
      apiList[this.type](postData).then(res => {
        console.log('res', res)
        this.loading = false
        this.editAbled = false
        this.dialogVisible = false
        if (res.code === 0) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.getList()
        } else {
          this.$message.error(res.message || '操作失败')
        }
      }).catch(err => {
        console.log('err', err)
        this.$message.error(err || '操作失败')
        this.loading = false
      })
    },
    save(postData) {
      merchant_rate_save(postData).then(res => {
        console.log('res', res)
        this.loading = false
        this.dialogVisible = false
        if (res.code === 0) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.getList()
        } else {
          this.$message.error(res.message || '操作失败')
        }
      }).catch(err => {
        console.log('err', err)
        this.$message.error(err || '操作失败')
        this.loading = false
      })
    }

  }
}
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
.digbox{
  margin:0 !important
}

</style>
