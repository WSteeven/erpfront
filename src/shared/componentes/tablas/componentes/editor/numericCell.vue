<template>
  <number-input
    ref="refInput"
    v-model="value"
    :options="CONFIG_DECIMALES"
    type="text"
  />
</template>

<script lang="ts">
import NumberInput from "@shared/componentes/input/numberInput.vue"
// import {useNotificaciones} from "@shared/notify/application/notificaciones"
import {computed, defineComponent, getCurrentInstance} from "vue"
import {ConfiguracionNumerica, Listable} from "@shared/componentes/tablas/types"

import {useAgGridComponent} from "../useAgGridComponent"
import {CONFIG_DECIMALES, CONFIG_NUMERICO} from "@config/numeric.config"
import {redondear} from "@/@app/shared/utils"
import {Notificaciones} from "../../../toastification/application/notificaciones"

export default defineComponent({
  components: {NumberInput},
  setup() {
    const notificaciones = new Notificaciones()
    const inst = getCurrentInstance()

    const {
      refInput,
      value,
      getValue,
      args,
      configuracion,
      actualizar,
      configurarOnChange,
    } = useAgGridComponent<Listable>(inst)

    /**
     * configuraciones numericas
     */
    const configuracionNumerica = computed<
      ConfiguracionNumerica<Listable> | undefined
    >(() => configuracion.value?.configuracionNumerica)

    const verificarMinimo = (valor: number, minimo: number) => {
      if (valor < minimo) {
        notificaciones.notificarAdvertencia(
          `El valor es inferior al minimo permitido: ${minimo}`
        )
        actualizar(minimo)
      }
    }
    const verificarMaximo = (valor: number, maximo: number) => {
      if (valor > maximo) {
        notificaciones.notificarAdvertencia(
          `El valor es superior al maximo permitido: ${maximo}`
        )
        actualizar(maximo)
      }
    }

    const obtenerValorConfiguracion = (
      configuracion: ConfiguracionNumerica<Listable>,
      valor: keyof ConfiguracionNumerica<Listable>
    ) => {
      if (!configuracion[valor]) return null
      if (typeof configuracion[valor] === "function") {
        const callback = configuracion[valor] as (params: any) => number | null
        return callback(args.value)
      }
      return configuracion[valor] as number
    }

    const change = function () {
      const valor = redondear(value.value, 6)
      actualizar(valor)
      if (configuracionNumerica.value && value.value) {
        if (configuracionNumerica.value.minimo) {
          const minimo = obtenerValorConfiguracion(
            configuracionNumerica.value,
            "minimo"
          )
          if (minimo && !isNaN(minimo)) {
            verificarMinimo(valor, minimo)
          }
        }
        if (configuracionNumerica.value.maximo) {
          const maximo = obtenerValorConfiguracion(
            configuracionNumerica.value,
            "maximo"
          )
          if (maximo !== null && !isNaN(maximo)) {
            verificarMaximo(valor, maximo)
          }
        }
      }
    }

    configurarOnChange(change)

    return {
      refInput,
      value,
      getValue,
      change,
      CONFIG_NUMERICO,
      CONFIG_DECIMALES,
    }
  },
})
</script>
