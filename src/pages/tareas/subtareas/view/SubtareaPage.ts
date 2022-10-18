// Dependencias
import { configuracionColumnasTecnico } from '../domain/configuracionColumnasTecnico'
import { computed, defineComponent, Ref, ref } from 'vue'
import {
  provincias,
  ciudades,
  grupos,
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
import flatPickr from 'vue-flatpickr-component';

// Logica y controladores
import { useTareaStore } from 'stores/tarea'
import { Tecnico } from '../domain/Tecnico'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { SubtareaController } from '../infraestructure/SubtareaController';
import { Subtarea } from '../domain/Subtarea';
import { TipoTareaController } from 'pages/tareas/tiposTareas/infraestructure/TipoTareaController';

export default defineComponent({
  components: { EssentialTable, flatPickr },
  setup() {
    const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())
    const { entidad: subtarea, listadosAuxiliares } = mixin.useReferencias()
    const { obtenerListados } = mixin.useComportamiento()

    obtenerListados({
      tiposTrabajos: new TipoTareaController(),
      //grupos: new GrupoController()
    })

    const tareaStore = useTareaStore()

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

    subtarea.hydrate(tareaStore.subtarea)

    function eliminarTecnico({ posicion }) {
      datos.value.splice(posicion, 1)
    }

    const causasIntervencion = computed(() => causaIntervencion.filter((causa: any) => causa.categoria === subtarea.tipo_intervencion))

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
    }
  },
})
