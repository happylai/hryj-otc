<template>
  <div class="tab-container">
    <el-tabs v-model="activeType" style="margin-top:15px;">
      <el-tab-pane :key="tabMapOptions[0].key" :label="tabMapOptions[0].label" :name="tabMapOptions[0].key">
        <el-row :gutter="20">
          <el-col :span="16">
            <div class="">
              <el-row :gutter="20" class="userRow">
                <el-col :span="8" class="textAlingR">选择币种：</el-col>
                <el-col :span="16">
                  <el-select v-model="price.token" placeholder="请选择币种" clearable style="width: 140px" class="filter-item">
                    <el-option v-for="item in TokenType" :key="item.label+'tokenType'" :label="item.label" :value="item.label" />
                  </el-select>
                </el-col>
              </el-row>
              <el-row :gutter="20" class="userRow">
                <el-col :span="8" class="textAlingR">CNY：</el-col>
                <el-col :span="16">
                  <el-input v-model="price.exchangeRate" placeholder="设置汇率" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
                </el-col>
              </el-row>
              <el-row :gutter="20" class="userRow">
                <el-col :span="8" class="textAlingR">是否激活该配置？</el-col>
                <el-col :span="16" class="">
                  <el-radio v-model="price.active" label="true">是</el-radio>
                  <el-radio v-model="price.active" label="false">否</el-radio>
                </el-col>
              </el-row>
              <el-row :gutter="20" class="userRow">
                <el-col :span="8" class="textAlingR" />
                <el-col :span="16" class="">
                  <el-button v-waves class="filter-item" style="width: 100px;" type="primary" @click="handleFilter">
                    保存
                  </el-button>
                  <el-button v-waves class="filter-item" style="margin-left: 20px;width: 100px;">
                    取消
                  </el-button>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane :key="tabMapOptions[1].key" :label="tabMapOptions[1].label" :name="tabMapOptions[1].key">
        <div class="filter-container" style="margin-bottom: 10px;">
          <el-input v-model="price.minVolume" placeholder="最低接单价" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-input v-model="price.maxVolume" placeholder="最高接单价" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

          <el-button v-waves class="filter-item" style="margin-left: 40px;wdith:120px" type="primary" icon="el-icon-add" @click="handleFilter">
            确认添加
          </el-button>
        </div>
        <el-table :data="data" border fit highlight-current-row style="width: 800px">
          <el-table-column v-loading="loading" align="center" label="接单范围" width="180" element-loading-text="请给我点时间！">
            <template slot-scope="scope">
              <span>{{ scope.row.roleId|userTypeName }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="180px" align="center" label="创建时间">
            <template slot-scope="scope">
              <span>{{ scope.row.time }}分钟</span>
            </template>
          </el-table-column>

          <el-table-column class-name="status-col" align="center" label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
              <el-button type="info" size="small" @click="edit(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane :key="tabMapOptions[2].key" :label="tabMapOptions[2].label" :name="tabMapOptions[2].key">
        <el-row :gutter="20">
          <el-col :span="16">
            <div class="">
              <el-row :gutter="20" class="userRow">
                <el-col :span="8" class="textAlingR">是否激活该配置？</el-col>
                <el-col :span="16" class="">
                  <el-radio v-model="price.active" label="true">是</el-radio>
                  <el-radio v-model="price.active" label="false">否</el-radio>
                </el-col>
              </el-row>
              <el-row :gutter="20" class="userRow">
                <el-col :span="8" class="textAlingR" />
                <el-col :span="16" class="">
                  <el-button v-waves class="filter-item" style="width: 100px;" type="primary" @click="handleFilter">
                    保存
                  </el-button>
                  <el-button v-waves class="filter-item" style="margin-left: 20px;width: 100px;">
                    取消
                  </el-button>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>

    </el-tabs>
  </div>

</template>

<script>
// import tabPane from './components/TabPane'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { Groups, UserType, Authents, emptySelect, TokenType } from '@/utils/enumeration'
import { role_apply_list, role_apply_detail, role_apply_audit } from '@/api/usermanage'

export default {
  name: 'Tab',
  components: { pagination },
  directives: { waves },
  data() {
    return {
      tabMapOptions: [
        { label: '固定价格', key: '1' },
        { label: '价格范围', key: '2' },
        { label: '灵活价格', key: '3' }
      ],
      activeType: '1',
      UserType,
      TokenType,
      Authents: [{ id: '',
        mame: '',
        label: '请选择'
      }, ...Authents],
      Groups: [emptySelect, ...Groups],

      price: {
        active: false
      },

      loading: false,

      editData: {}
    }
  },

  computed: {
    ...mapState({
      allList: state => state.order.allList,
      allListMeta: state => state.order.allMeta
    })
  },

  mounted() {
    this.getList()
  },
  methods: {
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    },
    paginationChange(e) {
      console.log('paginationChange', e)
      this.meta.size = e.limit
      this.meta.current = e.page
      this.getList()
    },
    getList(meta, data) {
      this.listLoading = true
      role_apply_list(meta || this.meta, data).then(res => {
        console.log('res', res)
        if (res.code === 0) {
          this.list = res.data.records
          this.meta.current = res.data.current
          this.paginationMeta.total = res.data.total
          this.paginationMeta.pages = res.data.pages
        }
      })
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
    toDetail(id) {
      console.log('to detail')
      this.$router.push({ path: `/role/${id}` })
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
</style>
