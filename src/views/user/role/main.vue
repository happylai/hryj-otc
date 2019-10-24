<template>
  <router-view />
</template>

<script>
import update from './update'
import surrender from './surrender'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { OrderStatus, PayType, UserType } from '@/utils/enumeration'

export default {
  name: 'Tab',
  components: { update, surrender, pagination },
  directives: { waves },
  data() {
    return {

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
