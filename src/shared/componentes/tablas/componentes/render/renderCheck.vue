<template>
  <div class="form-check d-flex align-items-center h-100">
    <input
      :checked="valor"
      :disabled="evaluarDisabled(computedDisabled)"
      type="checkbox"
      class="form-check-input"
      @change="change"
    />
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, getCurrentInstance} from "vue"
// componentes
import {ConfiguracionCheck} from "@shared/componentes/tablas/types"
import {useAgGridComponent} from "../useAgGridComponent"

export default defineComponent({
  props: ["params"],
  setup(props) {
    const inst = getCurrentInstance()
    const {refInput, value, getValue, configuracion, actualizar, params, args} =
      useAgGridComponent<ConfiguracionCheck<any>>(inst)
    const computedDisabled = computed(
      () => configuracion.value?.configuracionCheck?.disabled
    )

    const change = () => {
      actualizar(!value.value)
    }

    const evaluarDisabled = (disabled: any) => {
      return disabled
        ? typeof disabled === "function"
          ? disabled(args.value as any)
          : disabled
        : params.value?.columna.editable
    }
    const valor = computed(() => props.params.value)
    return {
      refInput,
      value,
      getValue,
      computedDisabled,
      change,
      evaluarDisabled,
      valor,
    }
  },
})
</script>
