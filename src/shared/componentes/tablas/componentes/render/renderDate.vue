<template>
  <span>{{ getDisplay(value) }}</span>
</template>

<script lang="ts">
import moment from "moment"
import {defineComponent, getCurrentInstance} from "vue"

import {useAgGridComponent} from "../useAgGridComponent"

export default defineComponent({
  setup() {
    const inst = getCurrentInstance()

    const {value, getValue} = useAgGridComponent(inst)

    /**
     * configuraciones numericas
     */
    const getDisplay = function (value: string) {
      if (value) {
        const fecha = moment(value, ["YYYY-MM-DD"])
        if (fecha.isValid()) {
          return fecha.format("DD-MM-YYYY")
        }
      }
      return ""
    }
    return {
      value,
      getValue,
      getDisplay,
    }
  },
})
</script>
