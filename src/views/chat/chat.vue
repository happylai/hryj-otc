<template>
  <div class="content">
    <div class="msglist">
      <search />
      <chatlist />
    </div>
    <div class="chatbox">
      <message />
      <v-text />
    </div>
  </div>
</template>

<script>
import search from '@/components/Chat/search/search'
import chatlist from '@/components/Chat/chatlist/chatlist'
import message from '@/components/Chat/message/message'
import vText from '@/components/Chat/text/text'
export default {
  components: {
   	 search,
   	 chatlist,
   	 message,
   	 vText
  }
}
</script>

<style lang="stylus" scoped>
.content
  display: flex
  width: 800px
  .msglist
    width: 250px
    background: rgb(230,230,230)
  .chatbox
    flex: 1
</style>
