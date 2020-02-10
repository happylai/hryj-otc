<template>

  <div class="components-container">

    <el-form ref="ruleForm" :model="form" label-width="100px" :rules="rules">
      <el-form-item prop="title" label="标题">
        <el-input v-model="form.title" style="width:400px;" placeholder="请输入消息标题" />
      </el-form-item>
      <el-form-item prop="path" label="发布对象">
        <el-checkbox-group v-model="form.path">
          <el-checkbox v-for="item in SystemMessageTypes" :key="item.id" :label="item.name" :value="item.id" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item v-if="id===undefined" prop="text" label="内容">
        <tinymce v-model="form.text" :height="300" />
      </el-form-item>
      <el-form-item v-if="id===undefined" style="margin-top=20px">
        <el-button :disabled="loading" :loading="loading" type="primary" @click="handleSave()">保存</el-button>
        <el-button :disabled="loading" :loading="loading" type="primary" @click="handleSave('publish')">立即发布</el-button>
      </el-form-item>
    </el-form>
    <h3>预览</h3>
    <div class="editor-content" v-html="form.text" />
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { SystemMessageTypes } from '@/utils/enumeration'
import { notice_create, notice_info } from '@/api/notice'
export default {
  name: 'SystemNotice',
  components: { Tinymce },
  data() {
    return {
      SystemMessageTypes,
      id: undefined,
      loading: false,
      form: {
        title: undefined,
        path: [],
        text: `<h1 style=\"text-align: center;\">在这里编辑你的文章</h1>\n<p style=\"text-align: center; font-size: 15px;\"><img title=\"TinyMCE Logo\" src=\"//www.tinymce.com/images/glyph-tinymce@2x.png\" alt=\"TinyMCE Logo\" width=\"110\" height=\"97\" /></p>\n<ul>\n<li>插入图片先上传素材再插入.</li>\n<li>下面可以预览文章效果.</li>\n<li>拖动窗口预览手机小屏模式.</li>\n</ul>`
      },
      rules: {
        title: [
          { required: true, message: '请输入消息标题', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请选择消息发布平台', trigger: 'blur' }
        ],
        text: [
          { required: true, message: '请编辑消息', trigger: 'blur' }
        ]

      }
    }
  },
  mounted() {
    const id = this.$route.params ? this.$route.params.id : undefined
    this.id = id
    if (id) {
      this.getInfoDetail(id)
    }
  },
  methods: {
    async validateForm() {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            resolve(true)
            return true
          } else {
            resolve(false)
            return false
          }
        })
      })
    },
    async handleSave(didPublish) {
      const res = await this.validateForm()
      console.log('res', res)
      if (!res) {
        return false
      }
      this.loading = true
      const data = {
        ...this.form,
        path: undefined,
        'app': this.form.path.includes('app'),
        'merchant': this.form.path.includes('merchant'),
        'web': this.form.path.includes('web'),
        'online': !!didPublish
      }
      notice_create(data).then(res => {
        this.loading = false
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: `${didPublish ? '保存并发布' : '保存'}成功`
          })
        } else {
          this.$message.error(res.message || '操作失败,请重试')
        }
      }).catch(err => {
        this.loading = false
        this.$message.error(err.message || '操作失败,请重试')
      })
    },
    getInfoDetail(id) {
      notice_info({ noticeId: id }).then(res => {
        if (res.code === 0) {
          this.form = res.data
          const path = []
          if (res.data.app) {
            path.push('app')
          }
          if (res.data.merchant) {
            path.push('merchant')
          }
          if (res.data.web) {
            path.push('web')
          }
          this.form.path = path
        }
      })
    }

  }
}
</script>

<style scoped>
.editor-content{
  margin-top: 20px;
}
.components-container{
  margin:30px
}
</style>

