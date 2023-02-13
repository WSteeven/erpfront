import { defineComponent, reactive,ref } from 'vue'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SubDetalleFondo } from '../domain/SubDetalleFondo'
import { SubDetalleFondoController } from '../infrestructure/SubDetalleFondoController'
import { configuracionColumnasSubDetalleFondo } from '../domain/configuracionColumnasSubDetalleFondo'
import { DetalleFondoController } from 'pages/fondosRotativos/detalleFondo/infrestructure/DetalleFondoController'



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
    const mixin = new ContenedorSimpleMixin(SubDetalleFondo, new SubDetalleFondoController())
    const { entidad: subDetalleFondo, disabled, accion,listadosAuxiliares } = mixin.useReferencias()
    const { setValidador,cargarVista,obtenerListados } = mixin.useComportamiento()
    const { onGuardado, onReestablecer } = mixin.useHooks()

    /*************
    * Validaciones
    **************/
    const reglas = {
      detalle_viatico: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      descripcion: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      transcriptor: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      autorizacion: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },

      estatus: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
    }
    const v$ = useVuelidate(reglas, subDetalleFondo)
    setValidador(v$.value)
    const detalles = ref([]);

    cargarVista(async () => {
      await obtenerListados({
        detalles: {
          controller: new DetalleFondoController(),
          params: { campos: 'id,descripcion' },
        },
      })});

    subDetalleFondo.autorizacion='NO';
    subDetalleFondo.estatus='Inactivo';
    detalles.value = listadosAuxiliares.detalles
  /*********
   * Filtros
   **********/
    // - Filtro Detalles
    function filtrarDetalles(val, update) {
      if (val === '') {
        update(() => {
          detalles.value = listadosAuxiliares.detalles
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        detalles.value = listadosAuxiliares.detalles.filter(
          (v) => v.descripcion.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    return {
      mixin,
      subDetalleFondo,
      detalles,
      disabled, accion, v$,
      configuracionColumnas: configuracionColumnasSubDetalleFondo,
      listadosAuxiliares,
      filtrarDetalles
    }
  }
})


