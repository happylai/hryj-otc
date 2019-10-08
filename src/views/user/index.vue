<template>
  <div class="tab-container">
    <!-- <el-tag>mounted times ：{{ createdTimes }}</el-tag>
    <el-alert :closable="false" style="width:200px;display:inline-block;vertical-align: middle;margin-left:30px;" title="Tab with keep-alive" type="success" /> -->
    <el-tabs v-model="activeName" style="margin-top:15px;" >
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
  </div>
</template>

<script>
import tabPane from './components/TabPane'
import {mapState,mapGetters,mapActions} from 'vuex'; //先要引入
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import {OrderStatus,PayType} from "@/utils/enumeration"

export default {
  name: 'Tab',
	components: { tabPane },
	directives: { waves },
  data() {
    return {
      tabMapOptions: [
        { label: '交易所用户订单', key: 'all' },
        { label: '站点用户订单', key: 'site' },
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
			orderStatus:undefined,
			dialogPvVisible:true,
			// orderStatus:OrderStatus,
			// payType:PayType
      },
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
	},
	computed:{
    ...mapState({  
				allList:state=>state.order.allList,
				allListMeta:state=>state.order.allMeta
      }),
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
	},
	mounted(){
		this.getList()
	},
  methods: {
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
		},
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
    },
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
