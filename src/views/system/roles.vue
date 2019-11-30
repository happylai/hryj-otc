<template>
  <div class="tab-container">
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-input v-model="roleAdd.zhName" placeholder="请输入后台角色中文名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleAdd" />
      <el-input v-model="roleAdd.name" placeholder="请输入后台角色英文名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleAdd" />
      <el-input v-model="roleAdd.description" placeholder="角色描述" style="width: 200px;" class="filter-item" @keyup.enter.native="handleAdd" />
      <el-button v-loading="addLoading" v-waves class="filter-item" style="margin-left: 40px" type="primary" icon="el-icon-plus" @click="handleAdd">
        确定添加
      </el-button>

    </div>
    <el-table :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column v-loading="loading" align="center" label="角色名" prop="zhName" width="220" element-loading-text="请给我点时间！" />

      <el-table-column min-width="180px" align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="140px" align="center" prop="description" label="描述" />

      <el-table-column align="center" label="创建时间" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime|timestampFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" align="center" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="clickEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="clickDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-loading="listLoading" :visible.sync="dialogVisible" title="后台角色编辑" width="40%">
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">中文角色名：</el-col>
        <el-col :span="16">
          <el-input v-model="Edit.zhName" placeholder="请输入后台" style="width: 200px;" class="filter-item" @keyup.enter.native="handleAdd" />
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">英文角色名：</el-col>
        <el-col :span="16">
          <el-input v-model="Edit.name" placeholder="请输入后台角色英文名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleAdd" />
        </el-col>
      </el-row>
      <el-row :gutter="20" class="userRow">
        <el-col :span="8" class="textAlingR">角色描述：</el-col>
        <el-col :span="16">
          <el-input v-model="Edit.description" placeholder="角色描述" style="width: 200px;" class="filter-item" @keyup.enter.native="handleAdd" />
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button v-loading="addLoading" type="primary" @click="handleAudit(true)">保存</el-button>
        <el-button type="info" @click="handleAudit(false)">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { mapState, mapGetters, mapActions } from 'vuex' // 先要引入
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { OrderStatus, PayType } from '@/utils/enumeration'
import { role_save, role_list, current_permission_add_list, role_delete } from '@/api/role'

export default {
  name: 'RolesList',
  directives: { waves },
  data() {
    return {
      list: [],
      permission_add_list: [],
      roleAdd: {
        name: undefined,
        zhName: undefined,
        createTime: undefined
      },
      dialogVisible: false,
      loading: false,
      addLoading: false,
      listLoading: false,
      Edit: {
        name: undefined,
        zhName: undefined,
        createTime: undefined
      }
    }
  },
  computed: {

  },
  watch: {

  },
  created() {

  },
  mounted() {
    this.getList()
  },
  methods: {

    getList() {
      this.listLoading = true
      role_list().then(res => {
        this.listLoading = false
        if (res.code === 0) {
          this.list = res.data
        }
      })
    },
    getPrenAddList() {
      current_permission_add_list().then(res => {
        if (res.code === 0) {
          this.permission_add_list = res.datt
        }
      })
    },
    handleAdd() {
      const data = this.roleAdd
      if (!data.name) {
        this.$message.error('请输入中文名')
      } else if (!data.zhName) {
        this.$message.error('请输入英文名')
      } else if (!data.description) {
        this.$message.error('请输入角色描述')
      } else {
        const postData = {
          ...data,
          createTime: this.$moment().toISOString()
        }
        this.handleSave(postData)
      }
    },
    handleSave(data) {
      this.addLoading = true

      role_save(data).then(res => {
        this.addLoading = false

        if (res.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.roleAdd = {
            name: undefined,
            zhName: undefined,
            createTime: undefined
          }
          this.Edit = {
            name: undefined,
            zhName: undefined,
            createTime: undefined
          }
          this.dialogVisible = false
          this.getList()
        }
      }).catch(() => {
        this.addLoading = false
      })
    },
    clickDelete(id) {
      this.$confirm('是否删除这个角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        role_delete({ roleId: id }).then(res => {
          if (res.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getList()
          } else {
            this.$message.error(res.message || '操作失败')
          }
        }).catch(err => [
          this.$message.error(err.message || '操作失败')
        ])
      })
    },
    clickEdit(data) {
      this.dialogVisible = true
      this.Edit = data
    },
    handleAudit(isEdit) {
      if (isEdit) {
        const data = { ...this.Edit, createTime: undefined }
        this.handleSave(data)
      } else {
        this.Edit = {
          name: undefined,
          zhName: undefined,
          createTime: undefined
        }
        this.dialogVisible = false
      }
    }
  }
}
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
</style>
