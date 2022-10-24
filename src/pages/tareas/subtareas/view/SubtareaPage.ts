// Dependencias
import { configuracionColumnasTecnico } from '../domain/configuracionColumnasTecnico'
import { computed, defineComponent, Ref, ref } from 'vue'
import {
  provincias,
  ciudades,
  tiposInstalaciones,
  tiposTareasTelconet,
  tiposTareasNedetel,
  regiones,
  atenciones,
  tiposIntervenciones,
  causaIntervencion,
} from 'config/utils'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import flatPickr from 'vue-flatpickr-component'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { TipoTareaController } from 'pages/tareas/tiposTareas/infraestructure/TipoTareaController'
import { GrupoController } from 'pages/tareas/grupos/infraestructure/GrupoController'
import { SubtareaController } from '../infraestructure/SubtareaController'
import { Subtarea } from '../domain/Subtarea'
import { useTareaStore } from 'stores/tarea'
import { Tecnico } from '../domain/Tecnico'

export default defineComponent({
  components: { EssentialTable, flatPickr },
  setup() {
    const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())
    const { entidad: subtarea, listadosAuxiliares } = mixin.useReferencias()
    const { obtenerListados, cargarVista } = mixin.useComportamiento()

    const tareaStore = useTareaStore()

    cargarVista(async () => {
      await obtenerListados({
        tiposTrabajos: {
          controller: new TipoTareaController(),
          params: { cliente: tareaStore.tarea.cliente }
        },
        subtareas: new SubtareaController(),
        grupos: new GrupoController(),
      })

      subtarea.hydrate(tareaStore.subtarea)
    })

    const busqueda = ref()
    const tecnicoSeleccionado = ref()

    const seleccionBusqueda = ref('por_tecnico')

    const columnas = [
      ...configuracionColumnasTecnico,
      {
        name: 'acciones',
        field: 'acciones',
        label: 'Acciones',
        align: 'center',
      },
    ]

    const datos: Ref<Tecnico[]> = ref([
      {
        id: 1,
        tecnico: 'LUIS DHDHD',
        contacto: '0897564321',
        grupo: 'MACHALA',
        disponibilidad: true,
        observacion: '',

      },
      {
        id: 2,
        tecnico: 'ROBERTO HGHGGF',
        contacto: '0897564321',
        grupo: 'SANTO DOMINGO',
        disponibilidad: true,
        observacion: '',
      },
      {
        id: 3,
        tecnico: 'CARLA AGUIRRE',
        contacto: '0897564321',
        grupo: 'SANTO DOMINGO',
        disponibilidad: false,
        observacion: '',
      },
    ])

    function enviar() {
      //
    }

    function eliminarTecnico({ posicion }) {
      datos.value.splice(posicion, 1)
    }

    const causasIntervencion = computed(() => causaIntervencion.filter((causa: any) => causa.categoria === subtarea.tipo_intervencion))

    async function obtenerResponsable(grupo_id: number) {
      // Obtener grupo
      const grupoController = new GrupoController()
      const { result } = await grupoController.consultar(grupo_id)
      const responsable = result.empleado_id

      const empleadoController = new EmpleadoController()
      const { result: tecnicoResponsable } = await empleadoController.consultar(responsable)

      subtarea.tecnico_responsable = tecnicoResponsable.nombres + ' ' + tecnicoResponsable.apellidos
    }

    // Filtro tipos de trabajos
    const tiposTrabajos = ref([])
    function filtrarTiposTrabajos(val, update) {
      if (val === '') {
        update(() => {
          tiposTrabajos.value = listadosAuxiliares.tiposTrabajos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tiposTrabajos.value = listadosAuxiliares.tiposTrabajos.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // Filtros subtareas
    const subtareas = ref([])
    function filtrarSubtareas(val, update) {
      if (val === '') {
        update(() => {
          subtareas.value = listadosAuxiliares.subtareas
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        subtareas.value = listadosAuxiliares.subtareas.filter(
          (v) => v.codigo_subtarea.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // Filtros grupos
    const grupos = ref([])
    function filtrarGrupos(val, update) {
      if (val === '') {
        update(() => {
          grupos.value = listadosAuxiliares.grupos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        grupos.value = listadosAuxiliares.grupos.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    return {
      step: ref(1),
      done1: ref(true),
      done2: ref(false),
      done3: ref(false),
      done4: ref(false),
      done5: ref(false),
      subtarea,
      seleccionBusqueda,
      columnas,
      datos,
      enviar,
      tecnicoSeleccionado,
      busqueda,
      grupos,
      eliminarTecnico,
      //modalesSubtarea,
      provincias,
      ciudades,
      tiposInstalaciones,
      tiposTareasTelconet,
      tiposTareasNedetel,
      fab: ref(false),
      regiones,
      atenciones,
      tiposIntervenciones,
      causasIntervencion,
      listadosAuxiliares,
      filtrarTiposTrabajos,
      tiposTrabajos,
      filtrarSubtareas,
      subtareas,
      filtrarGrupos,
      obtenerResponsable,
    }
  },
})
