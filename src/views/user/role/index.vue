<template>
  <div class="tab-container">
    <el-tabs v-model="activeType" style="margin-top:15px;">
      <el-tab-pane :key="tabMapOptions[0].key" :label="tabMapOptions[0].label" :name="tabMapOptions[0].key">
        <update />
      </el-tab-pane>
      <el-tab-pane :key="tabMapOptions[1].key" :label="tabMapOptions[1].label" :name="tabMapOptions[1].key">
        <surrender />
      </el-tab-pane>
      <el-tab-pane :key="tabMapOptions[2].key" :label="tabMapOptions[2].label" :name="tabMapOptions[2].key">
        <activeGlod />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import update from './update'
import surrender from './surrender'
import activeGlod from './activeGlod'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import waves from '@/directive/waves' // waves directive
import { OrderStatus, PayType, UserType } from '@/utils/enumeration'

export default {
  name: 'Tab',
  components: { update, surrender, activeGlod },
  directives: { waves },
  data() {
    return {
      tabMapOptions: [
        { label: '角色升级', key: '0' },
        { label: '退保审核', key: '1' },
        { label: '退激活金', key: '2' }
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

  mounted() {
  },
  methods: {

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
