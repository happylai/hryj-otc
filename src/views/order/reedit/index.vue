<template>
  <div class="tab-container">
    <el-tabs v-model="activeType" style="margin-top:15px;" @tab-click="handleTabClick">
      <el-tab-pane :key="0" label="预处理" name="0">
        <pretreatment />
      </el-tab-pane>
      <el-tab-pane :key="1" label="已处理" name="1">
        <processed />
      </el-tab-pane>

    </el-tabs>

  </div>
</template>
<script>
import pretreatment from './pretreatment'
import processed from './processed'

export default {
  name: 'ReeditIndex',
  components: { pretreatment, processed },
  data() {
    return {
      activeType: '0'
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
