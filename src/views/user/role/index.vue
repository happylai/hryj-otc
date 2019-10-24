<template>
  <div class="tab-container">
    <el-tabs v-model="activeType" style="margin-top:15px;">
      <el-tab-pane :key="tabMapOptions[0].key" :label="tabMapOptions[0].label" :name="tabMapOptions[0].key">
        <update />
      </el-tab-pane>
      <el-tab-pane :key="tabMapOptions[1].key" :label="tabMapOptions[1].label" :name="tabMapOptions[1].key">
        <surrender />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import update from './update'
import surrender from './surrender'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import waves from '@/directive/waves' // waves directive
import { OrderStatus, PayType, UserType } from '@/utils/enumeration'

export default {
  name: 'Tab',
  components: { update, surrender },
  directives: { waves },
  data() {
    return {
      tabMapOptions: [
        { label: '角色升级', key: '0' },
        { label: '退保审核', key: '1' }
      ],
      activeType: '0',
      UserType,
      fliterQuery: {
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
    activeType(val) {
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
      this.activeType = tab
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    },
    getList() {
      this.listLoading = true
      this.$store.dispatch('order/getAllList')
      // 	fetchList(this.fliterQuery).then(response => {
      // 		this.list = response.data.items
      // 		this.total = response.data.total

      // 		// Just to simulate the time of the request
      // 		setTimeout(() => {
      // 			this.listLoading = false
      // 		}, 1.5 * 1000)
      // })
    },
    handleFilter() {
      this.fliterQuery.page = 1
      this.getList()
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
