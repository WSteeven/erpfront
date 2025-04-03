import { defineComponent, ref } from 'vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { tabOptionsProveedoresInternacionales } from 'config/utils_compras_proveedores'
import {
  ContenedorSimpleMixin
} from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import {
  EmpleadoDelegado
} from 'recursosHumanos/empleados/modules/modoNoDisponible/domain/EmpleadoDelegado'
import {
  EmpleadoDelegadoController
} from 'recursosHumanos/empleados/modules/modoNoDisponible/infraestructure/EmpleadoDelegadoController'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import {
  configuracionColumnasEmpleadosDelegados
} from 'recursosHumanos/empleados/modules/modoNoDisponible/domain/configuracionColumnasEmpleadosDelegados'
import { ordenarLista } from 'shared/utils'

export default defineComponent({
  components: { TabLayoutFilterTabs2 },
  setup(){
    const mixin = new ContenedorSimpleMixin(EmpleadoDelegado, new EmpleadoDelegadoController())
    const {entidad: empleado_delegado, accion, disabled,listadosAuxiliares,} = mixin.useReferencias()
    const {setValidador, cargarVista, obtenerListados, listar} = mixin.useComportamiento()
    const {} = mixin.useHooks()

    const tabDefecto = ref('1')
    const {empleados, filtrarEmpleados}=useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async()=>{
      await  obtenerListados({
        empleados: {controller:new EmpleadoController(), params:{estado:1}}
      })
    })

    const reglas = {
      empleado: {required},
      delegado:{required},
      fecha_hasta:{required},
    }
    const v$ = useVuelidate(reglas, empleado_delegado)
    setValidador(v$.value)

    /***********************
     * FUNCIONES
     **********************/
    async  function filtrarListado(tab:string){
      tabDefecto.value = tab
      await listar({activo:tab})
    }

    return {
      v$, empleado_delegado, accion, disabled, mixin,
      tabOptions: tabOptionsProveedoresInternacionales,
      tabDefecto,
      configuracionColumnas: configuracionColumnasEmpleadosDelegados,
      //listados
      empleados, filtrarEmpleados,

      //funciones
      filtrarListado,
      ordenarLista,

    }
  }
})
