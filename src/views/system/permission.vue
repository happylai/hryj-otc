<template>
  <div class="tab-container">
    <el-tabs v-model="activeId" style="margin-top:15px;" @tab-click="handleClick">

      <el-tab-pane v-for="item in tabMapOptions" :key="item.id" :label="item.zhName" :name="item.id.toString()" />

      <el-tree
        ref="roleTree"
        v-loading="loading"
        :data="list"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
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
import { role_save, role_list, current_permission_add_list, role_permission_list, all_permission_list, role_delete, role_permission_delete, role_permission_add, role_permission_owner_list } from '@/api/role'
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
      checkPremission: [],
      loading: false

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

      this.$refs.roleTree.setCheckedKeys([])
      this.getCurrentPerList(this.activeId)
    },
    getList() {
      this.loading = true
      role_list().then(res => {
        this.loading = false
        if (res.code === 0) {
          this.tabMapOptions = res.data
          this.activeId = res.data[0].id.toString()

          this.getCurrentPerList(this.activeId)
        }
      }).catch(err => {
        this.loading = false
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
      role_permission_owner_list(id).then(res => {
        if (res.code === 0) {
          this.list = res.data
          this.defaultPremission = this.getValue(res.data, 'owner', 'id')
          this.checkPremission = this.getValue(res.data, 'owner', 'id')
        }
      })
    },
    getValue(data, flag, value) {
      const temp = []
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        if (item[flag]) {
          temp.push(item[value])
        }
        if (item.children) {
          temp.push(...this.getValue(item.children, flag, value))
        }
      }
      return temp
    },
    getCurrentValue(data, flag, value, current) {
      const temp = []
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        if (item[flag] === current) {
          console.log('item[flag] === current', item[flag], current, item[flag] === current)
          temp.push(item[value])
        }
        if (item.children) {
          const temp2 = this.getCurrentValue(item.children, flag, value, current)
          if (temp2) {
            temp.push(...temp2)
          }
        }
      }
      return temp
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
      console.log('defaultPremission', defaultPremission, 'currentPremission', currentPremission, 'dec', dec)
      if (dec.length) {
        var rolePermissionIds = []
        for (let i = 0; i < dec.length; i++) {
          const item = dec[i]
          rolePermissionIds.push(...this.getCurrentValue(this.list, 'id', 'rolePermissionId', item))
        }
        console.log('rolePermissionIds', rolePermissionIds)
      }

      if (rolePermissionIds && rolePermissionIds.length) {
        this.rolePerDel(rolePermissionIds, currentPremission)
      } else {
        this.rolePerAdd(currentPremission)
      }
    },
    rolePerDel(rolePermissionIds, currentPremission) {
      const postData = {
        rolePermissionIds: rolePermissionIds.join(',')
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
