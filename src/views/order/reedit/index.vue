<template>
  <div class="tab-container">
    <el-tabs v-model="activeType" style="margin-top:15px;" @tab-click="handleTabClick">
      <el-tab-pane :key="0" label="预处理" name="pretreatment">
        <pretreatment />
      </el-tab-pane>
      <el-tab-pane :key="1" label="已处理" name="processed">
        <pretreatment />
      </el-tab-pane>

    </el-tabs>

  </div>
</template>
<script>
import pretreatment from './pretreatment'

export default {
  name: 'ReeditIndex',
  components: { pretreatment },
  data() {
    return {
      activeType: 0,
      tabMapOptions: [
        { label: '站内订单', key: '1' },
        { label: 'To B订单', key: '2' }
      ]
    }
  },
  methods: {
    handleTabClick() {}
  }
}
</script>

<style  scoped>
.tab-container {
    margin: 30px;
}
</style>
