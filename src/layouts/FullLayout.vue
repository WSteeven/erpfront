<template>
  <q-layout view="lHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import {  defineComponent } from 'vue'
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const configuracionGeneralStore = useConfiguracionGeneralStore()
    // Establecer favicon
    configuracionGeneralStore
      .consultarConfiguracion()
      .then(() => configuracionGeneralStore.cambiarFavicon())

    // Titulo pagina
    document.title = configuracionGeneralStore.configuracion?.nombre_empresa

  }
})
</script>
