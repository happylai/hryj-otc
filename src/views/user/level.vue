<template>
  <div class="tab-container">
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-input v-model="fliterQuery.phone" placeholder="手机号搜索" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="fliterQuery.email" placeholder="邮箱搜索" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="fliterQuery.uid" placeholder="uuid搜索" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-search" @click="init">
        查询一级
      </el-button>
    </div>

    <el-table
      v-if="!isSearch"
      ref="table"
      :data="list"
      style="width: 100%"
      row-key="userId"
      border
      lazy
      :row-class-name="setCurrent"
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >

      <el-table-column
        align="center"
        label="注册账号"
        min-width="180"
        prop="account"
        element-loading-text="请给我点时间！"
      />

      <el-table-column min-width="120px" align="center" label="手机号" prop="phone" />

      <el-table-column min-width="120px" align="center" label="邮箱" prop="email" />

      <el-table-column min-width="120px" align="center" label="用户UID" prop="userUid" />

      <el-table-column min-width="120px" align="center" label="注册时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="交易总额(To B)" min-width="120" prop="orderTob" />

    </el-table>
    <div>
      <el-table
        ref="table2"
        :data="searchList"
        style="width: 100%"
        row-key="userId"
        border
        default-expand-all
        :row-class-name="setCurrent"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >

        <el-table-column
          align="center"
          label="注册账号"
          min-width="180"
          prop="account"
          element-loading-text="请给我点时间！"
        />
        <el-table-column
          align="center"
          min-width="120"
          label="-"
          element-loading-text="请给我点时间！"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.isSearch?'当前搜索':'-' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="120px" align="center" label="手机号" prop="phone" />

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

    <tree-table
      ref="table"
      :data="searchList"
      :columns="columns"
      selection-type="false"
      :expand-type="false"
    >
      <!-- <tree-table
        :columns="columns"
        :expand-type="false"
        :selection-type="false"
        :data="data"> -->

      <template slot-scope="scope">
        {{ scope.row.account }}
      </template>
      <template slot-scope="scope">
        {{ scope.row.phone }}
      </template>
      <template slot-scope="scope">
        {{ scope.row.email }}
      </template>
      <template slot-scope="scope">
        {{ scope.row.userUid }}
      </template>
      <template slot-scope="scope">
        {{ scope.row.createTime }}
      </template>
      <template slot-scope="scope">
        {{ scope.row.orderTob }}
      </template>

      <!-- <el-table-column min-width="120px" align="center" label="手机号" prop="phone" /> -->
    </tree-table>

    <pagination v-show="paginationMeta.total>0" :total="paginationMeta.total" :page.sync="meta.current" :limit.sync="meta.size" @pagination="paginationChange" />

  </div>
</template>

<script>
// import tabPane from './components/TabPane'
import waves from '@/directive/waves' // waves directive
import { user_web_children, user_web_init } from '@/api/usermanage'
import pagination from '@/components/Pagination'

export default {
  name: 'UserInstation',
  directives: { waves },
  components: { pagination },
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
      searchList: [],
      meta: {
        current: 1,
        size: 10
      },
      paginationMeta: {
        total: 10,
        pages: 1
      },
      isSearch: false,
      columns: [
        {
          title: '注册账号',
          key: 'account'
        },
        {
          title: '手机号',
          key: 'phone'
        },
        {
          title: '邮箱',
          key: 'email'
        },
        {
          title: '用户UID',
          key: 'userUid'
        },
        {
          title: '注册时间',
          key: 'createTime'
        },
        {
          title: '交易总额(To B)',
          key: 'orderTob'
        }

      ]

    }
  },

  computed: {

  },

  async mounted() {
    this.init()
  },

  methods: {
    init() {
      this.isSearch = false
      this.getList(0)
    },
    async load(tree, treeNode, resolve) {
      console.log('tree', tree)
      const data = await this.getList(tree.userId)
      this.paginationMeta.total = 0

      resolve(data)
    },

    async getList(id, meta) {
      this.loading = true
      const responeData = await user_web_children(id, meta).then(res => {
        this.loading = false
        console.log('res', res)
        if (res.code === 0) {
          var resData = res.data.records

          if (id === 0) {
            this.list = res.data.records
            this.meta.current = res.data.current
            this.paginationMeta.total = res.data.total
            this.paginationMeta.pages = res.data.pages
          }
          return resData
        }
      })
      return responeData
    },

    handleFilter() {
      this.loading = true
      user_web_init(this.fliterQuery).then(res => {
        this.loading = false
        this.isSearch = true
        console.log('res', res)
        if (res.code === 0) {
          this.setCurrentSearch(res.data)
          this.searchList = res.data
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
    setCurrent(row, index) {
      // console.log('row', row)
      if (row.isSearch) {
        console.log('index', index)
        return 'current'
      }
    },

    goDetail(id) {
      this.$router.push({ path: `/user/instation/${id}` })
    },
    paginationChange(e) {
      console.log('paginationChange', e)
      this.meta.size = e.limit
      this.meta.current = e.page
      this.getList(0, this.meta)
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
