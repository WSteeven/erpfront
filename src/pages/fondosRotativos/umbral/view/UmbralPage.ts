import { defineComponent, ref } from 'vue'
import { Umbral } from '../domain/Umbral'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { UmbralController } from '../infrestructure/UmbralController'
import { configuracionColumnasUmbral } from '../domain/configuracionColumnasUmbral'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'


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
    const mixin = new ContenedorSimpleMixin(Umbral, new UmbralController())
    const { entidad: umbral, disabled, accion,listadosAuxiliares } = mixin.useReferencias()
    const { setValidador ,obtenerListados, cargarVista} = mixin.useComportamiento()
    const empleados= ref([]);

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos',estado: 1 },
        },
      })
        empleados.value = listadosAuxiliares.empleados
    })
    /*************
    * Validaciones
    **************/
    const reglas = {
      empleado: {
        required: true
      },
      valor_minimo: {
        required: true,
      },
      referencia: {
        required: true,
      },
    }
    const v$ = useVuelidate(reglas, umbral)
    setValidador(v$.value)
    function filtrarEmpleados(val, update) {
      if (val === '') {
        update(() => {
          empleados.value = listadosAuxiliares.empleados
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        empleados.value = listadosAuxiliares.empleados.filter(
          (v) =>
            v.nombres.toLowerCase().indexOf(needle) > -1 ||
            v.apellidos.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    return {
      mixin,
      umbral,
      filtrarEmpleados,
      empleados,
      disabled, accion, v$,
      configuracionColumnas: configuracionColumnasUmbral,
    }
  }
})


