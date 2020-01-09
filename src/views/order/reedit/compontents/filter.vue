<template>
  <div class="filter-container" style="margin-bottom: 10px;">
    <el-input v-model="fliterQuery.query" placeholder="B端UID" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
    <el-input v-model="fliterQuery.query" placeholder="站内订单号" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
    <el-input v-model="fliterQuery.query" placeholder="B端订单号" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
    <el-input v-model="fliterQuery.query" placeholder="广告ID" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
    <el-input v-model="fliterQuery.query" placeholder="交易总价最高" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
    <el-input v-model="fliterQuery.query" placeholder="交易总价最低" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />

    <el-select v-model="fliterQuery.payType" placeholder="广告ID" clearable style="width: 140px" class="filter-item">
      <el-option v-for="item in PayType" :key="item.id" :label="item.label" :value="item.id" />
    </el-select>
    <el-select v-model="fliterQuery.type" placeholder="交易类型" clearable style="width: 140px" class="filter-item">
      <el-option v-for="item in CounterParty" :key="item.id" :label="item.label" :value="item.id" />
    </el-select>
    <el-select v-model="fliterQuery.status" placeholder="订单状态" clearable style="width: 140px" class="filter-item">
      <el-option v-for="item in OrderStatus" :key="item.id" :label="item.label" :value="item.id" />
    </el-select>
    <el-date-picker
      v-model="fliterQuery.creatDate"
      class="filter-item"
      type="daterange"
      range-separator="至"
      start-placeholder="创建开始日期"
      end-placeholder="结束日期"
    />

    <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
      搜索
    </el-button>
    <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
      创建预处理
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'ReeditTable',
  props: {
    list: {
      type: Object,
      default: {}
    }
  },
  methods: {
    handleFilter() { this.$emit('handleFilter') }
  }
}
</script>
