<template>
  <input
    ref="refInput"
    v-model="fecha"
    v-maska="'##-##-####'"
    class="form-control w-100"
    placeholder="DD-MM-YYYY"
    type="text"
    @blur="validarFecha"
    @keydown.tab="validarFecha"
  />
</template>

<script lang="ts">
import {defineComponent, getCurrentInstance, ref, watch} from "vue"
import {useAgGridComponent} from "../useAgGridComponent"
import moment from "moment"
// import {useNotificaciones} from "@shared/notify/application/notificaciones"

export default defineComponent({
  setup() {
    const inst = getCurrentInstance()
    // const notificaciones = useNotificaciones()
    const {value, getValue, actualizar, refInput} = useAgGridComponent<{
      id: number
    }>(inst)

    const fecha = ref() // referencia local de fecha
    watch(value, (newValue) => {
      // actualizar fecha local, al valor inyectado
      if (newValue) fecha.value = moment(newValue).format("DD-MM-YYYY")
    })
    /**
     * valida que la fecha ingresada sea correcta
     */
    const validarFecha = function () {
      if (fecha.value) {
        const fechaValida = moment(fecha.value, ["DD-MM-YYYY"])
        if (fechaValida.isValid()) {
          actualizar(fechaValida.format("YYYY-MM-DD"))
        } else {
          // notificaciones.notificarAdvertencia("Fecha ingresada no valida")
          actualizar("")
        }
      }
    }

    return {
      fecha,
      refInput,
      value,
      validarFecha,
      getValue,
    }
  },
})
</script>
