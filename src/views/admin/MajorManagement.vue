<template>
  <tinymce
    ref="editor"
    v-model="data.content"
  />
</template>
<script>
import tinymce from '@/components/Ty-editor.vue'
export default {
  name: 'Test',
  components: {
    tinymce
  },
  data() {
    return {
      data: {
        content: ''
      }

    }
  }
}
</script>
