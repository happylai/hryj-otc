<template>
  <div>
    <gallery :images="images" :index="index" @close="index = null" />
  </div>
</template>

<script>

import VueGallery from 'vue-gallery'
export default {
  name: 'Pagination',
  components: {
    'gallery': VueGallery
  },
  props: {
    images: {
      required: true,
      type: Array
    },
    index: {
      required: false,
      type: Number,
      default: 0
    }
  },
  computed: {

  },
  methods: {

  }
}
</script>

<style scoped>

</style>
