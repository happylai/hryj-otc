<template>
  <div class="tab-container">
    <el-tabs v-model="activeId" style="margin-top:15px;" @tab-click="handleClick">

      <el-tab-pane v-for="item in tabMapOptions" :key="item.id" :label="item.zhName" :name="item.id.toString()" />

      <el-tree
        ref="roleTree"
        :data="list"
        show-checkbox
        node-key="id"
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="defaultPremission"
        :props="defaultProps"
        @check-change="getCheckedKeys"
      />
    </el-tabs>
    <el-button v-waves class="filter-item" style="margin-top: 40px" type="primary" @click="handleSave">
      保存
    </el-button>
  </div>
</template>

<script>
import tabPane from './components/TabPane'
import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { OrderStatus, PayType } from '@/utils/enumeration'
import { role_save, role_list, current_permission_add_list, role_permission_list, all_permission_list, role_delete, role_permission_delete, role_permission_add } from '@/api/role'
import arrayDiffer from 'array-differ'
export default {
  name: 'Tab',
  components: { tabPane },
  directives: { waves },
  data() {
    return {
      tabMapOptions: [
        { label: 'zhName', id: '0' }
      ],
      activeId: '1',
      list: [],
      defaultProps: {
        label: 'title'
      },
      defaultPremission: [],
      checkPremission: []

    }
  },
  computed: {

  },
  watch: {

  },

  mounted() {
    this.getList()
  },
  methods: {
    handleClick(tab, event) {
      this.activeId = tab.name
      this.defaultPremission = []
      this.checkPremission = []
      this.$refs.roleTree.setCheckedKeys([])
      this.getCurrentPerList(this.activeId)
    },
    getList() {
      this.listLoading = true
      role_list().then(res => {
        if (res.code === 0) {
          this.tabMapOptions = res.data
          this.activeId = res.data[0].id.toString()
          this.getAllList(this.activeId)
          this.getCurrentPerList(this.activeId)
        }
      })
    },
    getAllList(id) {
      all_permission_list(id).then(res => {
        if (res.code === 0) {
          this.list = res.data
        }
      })
    },
    getCurrentPerList(id) {
      role_permission_list(id).then(res => {
        if (res.code === 0) {
          this.permission_list = res.data
          this.defaultPremission = this.permission_list.map(item => item.id)
        }
      })
    },
    getCheckedKeys() {
      console.log(this.$refs.roleTree.getCheckedKeys())
      this.checkPremission = this.$refs.roleTree.getCheckedKeys()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSave() {
      const defaultPremission = this.defaultPremission
      const currentPremission = this.$refs.roleTree.getCheckedKeys()
      const dec = arrayDiffer(defaultPremission, currentPremission)
      if (dec.length) {
        this.rolePerDel(dec, currentPremission)
      } else {
        this.rolePerAdd(currentPremission)
      }
    },
    rolePerDel(dec, currentPremission) {
      const postData = {
        rolePermissionIds: dec.join(',')
      }
      role_permission_delete(postData).then(res => {
        if (res.code === 0) {
          this.rolePerAdd(currentPremission)
        }
      })
    },
    rolePerAdd(data) {
      const postData = {
        permissionIds: data,
        roleId: this.activeId
      }
      role_permission_add(postData).then(res => {
        if (res.code === 0) {
          this.dialogVisible = false
          // this.getAllList(this.activeId)
          this.getCurrentPerList(this.activeId)
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        } else {
          this.$message.error('操作失败')
        }
      })
    }
  }
}
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
</style>
