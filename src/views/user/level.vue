<template>
  <div class="tab-container">
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-input v-model="fliterQuery.phone" placeholder="手机号搜索" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="fliterQuery.email" placeholder="邮箱搜索" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="fliterQuery.uid" placeholder="uuid搜索" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table
      ref="table"
      :data="list"
      style="width: 100%"
      row-key="userId"
      border
      lazy
      row-class-name="setCurrent"
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >

      <el-table-column
        align="center"
        min-width="180"
        type="expand"
        element-loading-text="请给我点时间！"
      />
      <el-table-column
        align="center"
        label="注册账号"
        min-width="180"
        prop="account"
        element-loading-text="请给我点时间！"
      />

      <el-table-column width="120px" align="center" label="手机号" prop="phone" />

      <el-table-column min-width="120px" align="center" label="邮箱" prop="email" />

      <el-table-column min-width="120px" align="center" label="用户UID" prop="userUid" />

      <el-table-column min-width="120px" align="center" label="注册时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="交易总额(To B)" min-width="120" prop="orderTob" />

    </el-table>

  </div>
</template>

<script>
// import tabPane from './components/TabPane'
import waves from '@/directive/waves' // waves directive
import { user_web_children, user_web_init } from '@/api/usermanage'

export default {
  name: 'UserInstation',
  directives: { waves },

  data() {
    return {
      openLeaveId: [],
      fliterQuery: {
        phone: undefined,
        email: undefined,
        uid: undefined
      },
      loading: false,
      list: [
      ],
      searchUserId: undefined

    }
  },

  computed: {

  },

  mounted() {
  },
  methods: {
    async load(tree, treeNode, resolve) {
      console.log('tree', tree)
      const data = await this.getList(tree.userId)
      console.log('loaddata', data)
      if (data.userId === this.searchUserId) {
        data.isSearch = true
      }
      resolve(data)
    },

    async getList(id) {
      this.loading = true
      const responeData = await user_web_children(id).then(res => {
        this.loading = false
        console.log('res', res)
        if (res.code === 0) {
          var resData = res.data
          return resData
        }
      })
      return responeData
    },

    handleFilter() {
      this.loading = true
      user_web_init(this.fliterQuery).then(res => {
        this.loading = false
        console.log('res', res)
        if (res.code === 0) {
          this.setCurrentSearch(res.data)
          this.list = res.data
        }
      })
    },
    setCurrentSearch(data) {
      console.log('setCurrentSearch')
      const _this = this
      data.map(item => {
        console.log('item', item)
        if (item.isSearch) {
          _this.searchUserId = item.userId
          console.log('current', item.userId)
        } else if (item.hasChildren && item.children) {
          this.setCurrentSearch(item.children)
        }
      })
    },
    setCurrent(row) {
      console.log('row', row)
      if (row.userId === this.searchUserId) {
        return 'current'
      }
    },

    goDetail(id) {
      this.$router.push({ path: `/user/instation/${id}` })
    },

    async loadchildren(id) {
      const data = {
        parentId: id
      }
      const meta = {
        current: 1,
        size: 100
      }
      const resData = await this.getList(meta, data)
      console.log('childrenData', resData)
      return (resData)
    }

  }
}
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
.payTypeImage{
  width: 100px;
  height: 100px;
  background-color: #dedede
}
.permission_toggleFold{
  vertical-align: middle;
  padding-right: 5px;
  font-size: 16px;
  cursor: pointer
}
.current{
  background-color: aqua
}

</style>
