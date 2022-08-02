<template>
  <span>{{ formatear(value) }}</span>
</template>

<script lang="ts">
import {defineComponent, getCurrentInstance} from "vue"
import {Utils} from "@shared/utils"
// import store from "@/store"
import {ConfiguracionNumerica} from "@shared/componentes/tablas/types"
import {useAgGridComponent} from "../useAgGridComponent"

export default defineComponent({
  setup() {
    const utils = new Utils()
    const inst = getCurrentInstance()

    const decimales = 2 //store.getters["nexus/decimalesEmpresa"]
    const {value, columna} =
      useAgGridComponent<ConfiguracionNumerica<any>>(inst)

    const formatear = function (value: string) {
      if (columna.value?.type && columna.value?.type === "integer")
        return value ? parseInt(value) : null
      return utils.formatoNumeroTexto(utils.redondear(value, 6), decimales)
    }

    return {
      formatear,
      value,
    }
  },
})
</script>
