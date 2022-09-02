<template>
  <q-layout view="lHh lpR fFf">
    <q-page-container>
      <essential-loading></essential-loading>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import EssentialLoading from 'components/loading/view/EssentialLoading.vue'

export default defineComponent({
  name: 'MainLayout',
  components: { EssentialLoading },
  setup() {
    //
  },
})
</script>
