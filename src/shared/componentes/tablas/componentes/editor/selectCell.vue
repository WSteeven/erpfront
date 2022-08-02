<template>
  <select
    ref="refInput"
    v-model="value"
    class="w-100"
    @change="cambiarSeleccion"
  >
    <option
      v-for="opt in opciones"
      :key="opt.id"
      :disabled="opt.disabled"
      :value="opt.id"
    >
      {{ obtenerDisplay(opt) }}
    </option>
  </select>
</template>

<script lang="ts">
import {computed, defineComponent, getCurrentInstance} from "vue"
import {useAgGridComponent} from "../useAgGridComponent"

export default defineComponent({
  setup() {
    const inst = getCurrentInstance()
    const {refInput, value, args, getValue, actualizar, configuracion} =
      useAgGridComponent<{
        id: number
      }>(inst)
    /**
     * configuraciones para listado
     */
    const configuracionListado = computed(
      () => configuracion.value?.configuracionListado
    )
    /**
     * listado de opciones disponibles
     */
    const opciones = computed(() => configuracionListado.value?.listado)
    /**
     * obtener label segun los fields a mostrar
     */
    const obtenerDisplay = function (opt: any) {
      const labels: string[] = []
      if (configuracionListado?.value) {
        for (const field of configuracionListado.value?.showFields) {
          labels.push(opt[field])
        }
      }
      return labels.join(" - ")
    }
    /**
     * ejecuta el cambio al seleccionar un nuevo item
     */
    const cambiarSeleccion = () => {
      actualizar(value.value)
      if (configuracionListado.value?.onChange) {
        configuracionListado.value.onChange(args.value as any)
      }
    }

    return {
      refInput,
      value,
      opciones,
      cambiarSeleccion,
      obtenerDisplay,
      getValue,
    }
  },
})
</script>
