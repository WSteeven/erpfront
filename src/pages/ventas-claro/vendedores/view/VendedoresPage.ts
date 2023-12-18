import { defineComponent, ref } from 'vue'
import { Vendedores } from '../domain/Vendedores'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { VendedoresController } from '../infrestructure/VendedoresController'
import { configuracionColumnasVendedores } from '../domain/configuracionColumnasVendedores'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { ModalidadController } from 'pages/ventas-claro/modalidad/infrestructure/ModalidadController'
import { tipos_vendedor } from 'config/utils'


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
    const mixin = new ContenedorSimpleMixin(Vendedores, new VendedoresController())
    const { entidad: vendedores, disabled, accion,listadosAuxiliares } = mixin.useReferencias()
    const { setValidador ,obtenerListados, cargarVista} = mixin.useComportamiento()

    const empleados= ref([]);
    const modalidades= ref([]);

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos',estado: 1,departamento_id:13 },
        },
        modalidades: {
          controller: new ModalidadController(),
          params: { campos: 'id,nombre' },
        },
      })
        empleados.value = listadosAuxiliares.empleados
        modalidades.value = listadosAuxiliares.modalidades
    })
    /*************
    * Validaciones
    **************/
    const reglas = {
      codigo_vendedor: {
        required: true
      },
      empleado: {
        required: true
      },
      modalidad: {
        required: true
      },
      tipo_vendedor:{
        required: true
      }

    }
    const v$ = useVuelidate(reglas, vendedores)
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
    function filtrarModalidades(val, update) {
      if (val === '') {
        update(() => {
          modalidades.value = listadosAuxiliares.modalidades
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        modalidades.value = listadosAuxiliares.modalidades.filter(
          (v) =>
            v.nombre.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    return {
      mixin,
      vendedores,
      disabled, accion, v$,
      configuracionColumnas: configuracionColumnasVendedores,
      empleados,
      modalidades,
      tipos_vendedor,
      filtrarEmpleados,
      filtrarModalidades,
    }
  }
})


