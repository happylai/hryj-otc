<template>
  <div class="content">
    <div class="friend-wrapper">
      <search />
      <friendlist />
    </div>
    <div class="friendinfo">
      <info />
    </div>
  </div>
</template>

<script>
import search from '@/components/Chat/search/search'
import friendlist from '@/components/Chat/friendlist/friendlist'
import info from '@/components/Chat/info/info'
export default {
  components: {
    search,
    friendlist,
    info
  }
}
</script>

<style lang="stylus" scoped>
.content
  display: flex
  width: 800px
  .friend-wrapper
    width: 250px
    background: rgb(230,230,230)
  .friendinfo
    flex: 1
</style>
