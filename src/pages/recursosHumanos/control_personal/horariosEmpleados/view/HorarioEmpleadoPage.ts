import { defineComponent, ref } from 'vue'
import ErrorComponent from 'components/ErrorComponent.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { configuracionColumnasHorarioEmpleado } from 'controlPersonal/horariosEmpleados/application/configuracionColumnasHorarioEmpleado'
import { HorarioEmpleado } from 'controlPersonal/horariosEmpleados/application/HorarioEmpleado'
import { HorarioEmpleadoController } from 'controlPersonal/horariosEmpleados/infraestructure/HorarioEmpleadoController'
import { useVuelidate } from '@vuelidate/core'
import { required } from 'shared/i18n-validators'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { HorarioLaboralController } from 'controlPersonal/horario_laboral/infraestructure/HorarioLaboralController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { ordenarLista } from 'shared/utils'
import { tabOptionsProveedoresInternacionales } from 'config/utils_compras_proveedores'
import { maskFecha } from 'config/utils'

export default defineComponent({
  components: { NoOptionComponent, ErrorComponent, TabLayoutFilterTabs2 },
  props: {
    datos: { type: Object, required: false }
  },
  emit: ['cerrar-modal', 'guardado'],
  setup(props,{emit}) {
    const mixin = new ContenedorSimpleMixin(
      HorarioEmpleado,
      new HorarioEmpleadoController()
    )
    const {
      entidad: horario_empleado,
      disabled,
      accion,
      listadosAuxiliares, listado, tabs
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados,  listar } =
      mixin.useComportamiento()
    const { onReestablecer, onGuardado } = mixin.useHooks()

    const currentTab = ref('1')
    const searchTable = ref<string|string[]|null>(null)
    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)
    const horarios = ref([])
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { estado: 1 }
        },
        horarios: {
          controller: new HorarioLaboralController(),
          params: { activo: 1 }
        }
      })

      horarios.value = listadosAuxiliares.horarios

      // valor por defecto de fecha de inicio
      setFechaInicioDefault()

      if(props.datos?.empleado_id){
        const empleadoListado: HorarioEmpleado = listado.value.filter((he: HorarioEmpleado) =>he.empleado_id === props.datos.empleado_id)[0]
        console.log(empleadoListado)
        searchTable.value = empleadoListado.empleado.toString()
        tabs.value = 'listado'
      }
    })

    const reglas = {
      empleado: { required },
      horario: { required },
      fecha_inicio: { required }
    }
    const v$ = useVuelidate(reglas, horario_empleado)
    setValidador(v$.value)

    /**************
     * HOOKS
     **************/
    onReestablecer(() => {
      setFechaInicioDefault()
    })
    onGuardado(()=>{
      emit('guardado', 'HorarioEmpleadoPage')
      emit('cerrar-modal')
    })

    /**************
     * FUNCIONES
     **************/
    const setFechaInicioDefault = () => {
      horario_empleado.fecha_inicio = '2025-01-01'
    }

    function filtrarHorarios(tab: string) {
      currentTab.value = tab
      listar({ activo: tab })
    }

    return {
      mixin,
      horario_empleado,
      disabled,
      accion,
      v$,
      tabOptions: tabOptionsProveedoresInternacionales,
      configuracionColumnas: configuracionColumnasHorarioEmpleado,
      maskFecha,
      currentTab,searchTable,
      empleados,
      filtrarEmpleados,
      horarios,
      filtrarHorarios,
      ordenarLista
    }
  }
})
