import { listadoAuxiliar } from './../../../../shared/contenedor/domain/listable';
import { defineComponent, ref, watch, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from 'shared/i18n-validators'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PlantillaCapacitacion } from '../domain/PlantillaCapacitacion'
import { configuracionColumnasEmpleados } from 'pages/recursosHumanos/empleados/domain/configuracionColumnasEmpleados'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { configuracionColumnasPlantillaCapacitacion } from '../domain/configuracionColumnasPlantillaCapacitacion'
import { PlantillaCapacitacionController } from '../infraestructure/PlantillaCapacitacionController'

// componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import InputComponent from 'components/inputs/InputComponent.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import { acciones } from 'config/utils'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

export default defineComponent({
  components: { TabLayout, InputComponent, EssentialTable, ButtonSubmits },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      PlantillaCapacitacion,
      new PlantillaCapacitacionController()
    )

    const { entidad: plantilla, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, guardar, reestablecer, eliminar, listar } =
      mixin.useComportamiento()
    const { onBeforeGuardar, onGuardado, onBeforeModificar, onModificado, onReestablecer } =
      mixin.useHooks()

    const cargando = new StatusEssentialLoading()

    const metodo = computed(() => {
      switch (accion.value) {
        case acciones.nuevo:
          return 'POST'
        case acciones.editar:
          return 'PUT'
        case acciones.eliminar:
          return 'DELETE'
        default:
          return 'GET'
      }
    })

    // HOOKS
    onGuardado(async () => await listar())
    onModificado(async () => await listar())
    onBeforeGuardar(() => (plantilla._method = metodo.value))
    onBeforeModificar(() => (plantilla._method = metodo.value))
    onReestablecer(() => (plantilla._method = metodo.value))

    // Empleados
    const { empleados, filtrarEmpleados } = useFiltrosListadosSelects(listadosAuxiliares)

    const modalidades = ref([
      { label: 'Interno', value: 'Interno' },
      { label: 'Externo', value: 'Externo' }
    ])

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos,identificacion,cargo_id,departamento_id',
            estado: 1
          }
        }
      })
    })

    empleados.value = listadosAuxiliares.empleados

    const listado = ref<any[]>([])



    // Asistentes
    const empleadosFiltrados = ref<any[]>([])
    const asistentesSeleccionados = ref<number[]>([])

    async function cargarEmpleados(fecha: string) {
      const { result } = await new EmpleadoController().listar({
        estado: 1,
        fecha_ingreso_hasta: fecha
      })
      empleadosFiltrados.value = Array.isArray(result) ? result : []
    }

    function seleccionarAsistentes(rows: any[]) {
      asistentesSeleccionados.value = rows.map(r => r.id)
      plantilla.asistentes = [...asistentesSeleccionados.value]
    }

    // cada vez que cambia la fecha de la capacitación, carga empleados
    watch(
      () => plantilla.fecha,
      nuevaFecha => {
        if (nuevaFecha) {
          cargarEmpleados(nuevaFecha)
        }
      }
    )

    // Validaciones
    const reglas = {
      tema: { required },
      fecha: { required },
      hora_inicio: { required },
      hora_fin: { required },
      capacitador_id: { required },
      modalidad: { required }
    }

    const v$ = useVuelidate(reglas, plantilla)
    setValidador(v$.value)

    // Extra: Exportar PDF
    function exportarPdf() {
      console.log('Generar PDF con los datos de la plantilla...')
      // Aquí podrías usar jsPDF o lo que tengas ya implementado
    }

    return {
      mixin,
      plantilla,
      disabled,
      accion,
      configuracionColumnas: configuracionColumnasPlantillaCapacitacion,
      empleados,
      filtrarEmpleados,
      modalidades,
      v$,
      empleadosFiltrados,
      listado,
      asistentesSeleccionados,
      seleccionarAsistentes,
      configuracionColumnasEmpleados,
      guardar,
      reestablecer,
      eliminar,
      cargando,
      exportarPdf
    }
  }
})
