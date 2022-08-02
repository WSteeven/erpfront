<template>
  <span>{{ valorSeleccionado }}</span>
</template>

<script lang="ts">
import {computed, defineComponent, getCurrentInstance} from "vue"

import {labels} from "@config/utils.config"
import {useAgGridComponent} from "../useAgGridComponent"

export default defineComponent({
  setup() {
    const inst = getCurrentInstance()
    const {value, getValue, configuracion} = useAgGridComponent<{
      id: number
    }>(inst)

    const opciones = computed(() => configuracionListado.value?.listado)
    const configuracionListado = computed(
      () => configuracion.value?.configuracionListado
    )

    const obtenerDisplay = function (opt: any) {
      const labels: string[] = []
      // si tiene configuracion de listado
      if (configuracionListado?.value) {
        for (const field of configuracionListado.value.showFields) {
          labels.push(opt[field])
        }
      }
      return labels.join(" - ")
    }

    const valorSeleccionado = computed(() => {
      const seleccionado = opciones.value?.find(
        (elem: any) => elem.id === value.value
      )
      // si encontro un seleccionado
      if (seleccionado) {
        return obtenerDisplay(seleccionado)
      }
      // devuelve un label por defecto cuando no hay seleccion
      return configuracionListado.value?.obligatorio
        ? labels.obligatorio
        : labels.seleccione
    })

    return {
      valorSeleccionado,
      getValue,
    }
  },
})
</script>
