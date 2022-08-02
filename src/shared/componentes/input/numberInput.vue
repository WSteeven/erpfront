<template>
  <input
    :class="{'is-invalid': state === false}"
    class="form-control"
    type="text"
    v-bind="$attrs"
    @blur="onBlur"
    @focus="onFocus"
    @keydown="onKeyDown"
  />
</template>

<script lang="ts">
// import Cleave from "cleave"
// import {Utils} from "@shared/utils"
import {defineComponent, ref} from "@vue/runtime-core"

export default defineComponent({
  name: "NumberInput",
  props: {
    // eslint-disable-next-line vue/require-prop-types
    value: {
      default: "",
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    state: {
      type: Boolean || null,
      default: null,
    },
    decimales: {
      type: Number,
      default: 2,
      required: false,
    },
  },
  setup(props, {emit}) {
    const cleave = ref(null)
    const valorSinFormato = ref(null)

    /* watch(options => {
      deep: true,
      handler(val) {
        cleave.destroy()
        cleave = new Cleave($el, val)
      }
  }) */
    /* mounted() {
    $el.value = value
    cleave = new Cleave($el, options)
    $watch("cleave.properties.result", (value) => {
      if (typeof value === "string" || typeof value === "number") {
        $emit("input", parseFloat(cleave.getRawValue()))
      }
    })
    $watch("value", (value) => {
      if (value !== $el.value) {
        $el.value = value
        $el.dispatchEvent(new Event("input", {bubbles: true}))
      }
    })
  }, */
    /* beforeDestroy() {
    cleave.destroy()
  }, */

    const onBlur = (ev: any) => {
      // formatearCantidad()
      emit("blur", ev)
    }
    const onKeyDown = (ev: any) => {
      emit("keydown", ev)
    }
    const onFocus = (ev: any) => {
      // recuperarCantidad()
      emit("focus", ev)
    }
    // focus
    /* const recuperarCantidad = () => {
      const utils = new Utils()
      const comparador1 = utils.redondear(
        parseFloat(cleave.value.getRawValue()),
        2
      )
      const comparador2 = utils.redondear(valorSinFormato, 2)
      emit(
        "input",
        comparador1 !== comparador2
          ? parseFloat(cleave.value.getRawValue())
          : valorSinFormato
      )
    },
    // blur
    const formatearCantidad = () => {
      const utils = new Utils()
      valorSinFormato.value = parseFloat(cleave.value.getRawValue())
      const valorFormateado = utils.redondear(
        valorSinFormato,
        decimales
      )
      emit("input", valorFormateado)
    }, */
    return {
      cleave,
      valorSinFormato,
      onBlur,
      onKeyDown,
      onFocus,
      // recuperarCantidad,
      // formatearCantidad
    }
  },
})
</script>
