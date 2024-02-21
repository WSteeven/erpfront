import { defineComponent, ref, watchEffect } from 'vue'
import { Chargeback } from '../domain/Chargeback'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ChargebackController } from '../infrestructure/ChargebackController'
import { configuracionColumnasChargeback } from '../domain/configuracionColumnasChargeback'
import { estados_activaciones, formas_pagos, maskFecha } from 'config/utils'
import {requiredIf,} from 'shared/i18n-validators'
import { VentaController } from 'pages/ventas-claro/ventas/infrestructure/VentaController'
import { TipoChargeBackController } from 'pages/ventas-claro/tipoChargeBack/infrestructure/TipoChargeBackController'

export default defineComponent({
  components: { TabLayout },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      Chargeback,
      new ChargebackController()
    )
    const {
      entidad: chargeback,
      disabled,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } =
      mixin.useComportamiento()
    const precio_producto = ref(0)
    const comision_vendedor = ref(0)
    /*************
     * Validaciones
     **************/
    const reglas = {
      venta: {
        required: true,
      },
      fecha: {
        required: true,
        //  maxValue: maxValue(13),
      },
      valor: {
        required: true,
      },
      tipo_chargeback: {
        required: true,
      },
      porcentaje: {
        required: requiredIf(() => chargeback.tipo_chargeback == 1)
      }
    }
    const v$ = useVuelidate(reglas, chargeback)
    setValidador(v$.value)
    const tipos_chargebacks = ref([])
    const ventas = ref([])
    cargarVista(async () => {
      await obtenerListados({
        tipos_chargebacks: {
          controller: new TipoChargeBackController(),
          params: { campos: 'id,nombre' },
        },
        ventas: {
          controller: new VentaController(),
          params: {},
        },
      })
      tipos_chargebacks.value = listadosAuxiliares.tipos_chargebacks
      ventas.value = listadosAuxiliares.ventas
    })
    function filtrarTiposChargeback(val, update) {
      if (val === '') {
        update(() => {
          tipos_chargebacks.value = listadosAuxiliares.tipos_chargebacks
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tipos_chargebacks.value = listadosAuxiliares.tipos_chargebacks.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    function filtrarVentas(val, update) {
      if (val === '') {
        update(() => {
          ventas.value = listadosAuxiliares.ventas
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        ventas.value = listadosAuxiliares.ventas.filter(
          (v) =>
            v.orden_interna.toLowerCase().indexOf(needle) > -1 ||
            v.orden_id.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    function tipoChargeback() {
      chargeback.valor = null;
      chargeback.porcentaje = null;
    }
    function obtenerValor() {

      const total = listadosAuxiliares.ventas.filter(
        (v) =>
          v.id == chargeback.venta)
      precio_producto.value = total[0].producto_precio;
    }
    watchEffect(() => {
      if (chargeback.tipo_chargeback == 1) {
        const porcentaje = chargeback.porcentaje != null ? chargeback?.porcentaje : 0
        chargeback.valor = (precio_producto.value * porcentaje) / 100
      }
    })

    return {
      mixin,
      chargeback,
      disabled,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasChargeback,
      estados_activaciones,
      formas_pagos,
      ventas,
      tipos_chargebacks,
      maskFecha,
      precio_producto,
      comision_vendedor,
      filtrarTiposChargeback,
      filtrarVentas,
      tipoChargeback,
      obtenerValor,
    }
  },
})
