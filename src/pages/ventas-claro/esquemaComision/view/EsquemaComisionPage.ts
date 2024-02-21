import { defineComponent, ref } from 'vue'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PlanesController } from 'pages/ventas-claro/planes/infrestructure/PlanesController'
import { formas_pagos, tipos_vendedores } from 'config/utils'
import { EsquemaComisionController } from '../infrestructure/EsquemaComisionController'
import { EsquemaComision } from '../domain/EsquemaComision'
import { configuracionColumnasEsquemaComision } from '../domain/configuracionColumnasEsquemaComision'


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
    const mixin = new ContenedorSimpleMixin(EsquemaComision, new EsquemaComisionController())
    const { entidad: esquemaComision, disabled, accion,listadosAuxiliares } = mixin.useReferencias()
    const { setValidador ,obtenerListados, cargarVista} = mixin.useComportamiento()

    /*************
    * Validaciones
    **************/
    const reglas = {
      mes_liquidacion: {
        required: true
      },
      esquema_comision:{
        required: true
      },
      tarifa_basica:{
        required: true
      }
    }
    const v$ = useVuelidate(reglas, esquemaComision)
    setValidador(v$.value)
    const planes= ref([]);
    cargarVista(async () => {
      await obtenerListados({
        planes: {
          controller: new PlanesController(),
          params: { campos: 'id,nombre' },
        },
      })
        planes.value = listadosAuxiliares.planes

    })
    function filtrarPlanes(val, update) {
      if (val === '') {
        update(() => {
          planes.value = listadosAuxiliares.planes
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        planes.value = listadosAuxiliares.planes.filter(
          (v) =>
            v.nombres.toLowerCase().indexOf(needle) > -1 ||
            v.apellidos.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    return {
      mixin,
      esquemaComision,
      tipos_vendedores,
      disabled, accion, v$,
      formas_pagos,
      planes,
      filtrarPlanes,
      configuracionColumnas: configuracionColumnasEsquemaComision,
    }
  }
})


