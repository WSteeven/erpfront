import { defineComponent, ref } from 'vue'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import {  useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useCargandoStore } from 'stores/cargando'
import { AprobarGastoController } from 'pages/fondosRotativos/autorizarGasto/infrestructure/AprobarGastoController'
import { GastoController } from 'pages/fondosRotativos/gasto/infrestructure/GastoController'
import { Gasto } from 'pages/fondosRotativos/gasto/domain/Gasto'
import { useNotificaciones } from 'shared/notificaciones'

export default defineComponent({
  components: { TabLayout },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())

    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(Gasto, new GastoController())
    const aprobarController = new AprobarGastoController()

    const { notificarAdvertencia } = useNotificaciones()
    const { entidad: gasto, disabled, accion } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()
    /*************
     * Validaciones
     **************/
    const reglas = {
      id: {
        required: true,
      },
      detalle_estado: {
        required: true,
      },
    }
    const v$ = useVuelidate(reglas, gasto)
    setValidador(v$.value)

    async function anular(){
      await aprobarController.anularGasto(gasto)
      gasto.id=null;
      gasto.detalle_estado=null
      notificarAdvertencia('Se anulado Gasto Exitosamente')
    }

    return {
      mixin,
      gasto,
      disabled,
      accion,
      v$,
      anular,
    }
  },
})
