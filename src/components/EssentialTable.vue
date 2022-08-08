<template>
  <q-table :columns="configuracionColumnas" :rows="datos"></q-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    configuracionColumnas: {
      type: Object as () => [],
      required: true,
    },
    datos: {
      type: Object as () => [],
      required: true,
    },
  },
  setup() {
    return {}
  },
})
</script>
