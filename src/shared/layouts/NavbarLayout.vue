<template>
  <navbar></navbar>
  <router-view class="contenido" />
</template>

<script lang="ts">
// Dependencias
import {defineComponent} from "vue"
// Componentes
import Navbar from "@componentes/theNavbar/view/TheNavbar.vue"

export default defineComponent({
  components: {
    Navbar,
  },
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped>
.contenido {
  position: absolute;
  top: 0;
  width: 100%;
}
</style>
