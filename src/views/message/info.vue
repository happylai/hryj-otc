<template>

  <div class="components-container">
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-select v-model="type" placeholder="公告对象" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in SystemMessageTypes" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>
      <el-select v-model="status" placeholder="状态" clearable style="width: 140px" class="filter-item">
        <el-option v-for="item in SystemMessageStatus" :key="item.id" :label="item.label" :value="item.id" />
      </el-select>

    </div>
    <div>
      <tinymce v-model="content" :height="300" />
    </div>
    <h3>预览</h3>
    <div class="editor-content" v-html="content" />
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'

export default {
  name: 'TinymceDemo',
  components: { Tinymce },
  data() {
    return {
      content:
      `<h1 style=\"text-align: center;\">在这里编辑你的文章</h1>\n<p style=\"text-align: center; font-size: 15px;\"><img title=\"TinyMCE Logo\" src=\"//www.tinymce.com/images/glyph-tinymce@2x.png\" alt=\"TinyMCE Logo\" width=\"110\" height=\"97\" /></p>\n<ul>\n<li>插入图片先上传素材再插入.</li>\n<li>下面可以预览文章效果.</li>\n<li>拖动窗口预览手机小屏模式.</li>\n</ul>`
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

