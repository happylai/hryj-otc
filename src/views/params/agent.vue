<template>
  <div class="tab-container">
    <div class="container-tip"><i class="el-icon-warning color-primary" s /> 温馨提示：系统目前代理总数为： <el-link type="primary">7342 人</el-link>  | 拓展用户总数为：<el-link type="primary">7342 人</el-link></div>
    <el-row :gutter="20">
      <el-col :span="16">
        <div class="">

          <el-row :gutter="20" class="userRow">
            <el-col :span="8" class="textAlingR">代理奖励：</el-col>
            <el-col :span="16">
              <el-input v-model="price.exchangeRate" placeholder="设置最高比例%" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
            </el-col>
          </el-row>
          <el-row :gutter="20" class="userRow">
            <el-col :span="8" class="textAlingR">当前奖励比：</el-col>
            <el-col :span="16">
              <span>1.6%</span>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="userRow">
            <el-col :span="8" class="textAlingR">层级差：</el-col>
            <el-col :span="16">
              <el-input v-model="price.exchangeRate" placeholder="比例%" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
