<template>
  <div
    class="h-100 d-flex flex-column align-items-center justify-content-center"
  >
    <div>Recurso no encontrado</div>
    <h2 class="mb-4">Error 404</h2>
    <router-link
      :to="{name: 'MisNegocios'}"
      class="btn btn-primary"
      @click="mostrarMisNegocios"
      >Ver mis negocios</router-link
    >
  </div>
</template>

<script lang="ts">
import {SesionUsuario} from "@/router/sesionUsuario"
import {defineComponent} from "@vue/runtime-core"

export default defineComponent({
  setup() {
    const sesionUsuario = SesionUsuario.getInstance()

    const mostrarMisNegocios = () => {
      sesionUsuario.resetearNegocioSeleccionado()
    }

    return {mostrarMisNegocios}
  },
})
</script>
