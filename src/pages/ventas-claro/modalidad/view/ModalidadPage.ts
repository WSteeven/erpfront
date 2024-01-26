import { defineComponent, ref } from 'vue'
import { Modalidad } from '../domain/Modalidad'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ModalidadController } from '../infrestructure/ModalidadController'
import { configuracionColumnasModalidad } from '../domain/configuracionColumnasModalidad'


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
    const mixin = new ContenedorSimpleMixin(Modalidad, new ModalidadController())
    const { entidad: modalidad, disabled, accion,listadosAuxiliares } = mixin.useReferencias()
    const { setValidador ,obtenerListados, cargarVista} = mixin.useComportamiento()


    /*************
    * Validaciones
    **************/
    const reglas = {
      nombre: {
        required: true
      },
      umbral_minimo:{
        required: true
      }

    }
    const v$ = useVuelidate(reglas, modalidad)
    setValidador(v$.value)

    return {
      mixin,
      modalidad,
      disabled, accion, v$,
      configuracionColumnas: configuracionColumnasModalidad,
    }
  }
})


