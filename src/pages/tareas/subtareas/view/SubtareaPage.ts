// Dependencias
import { configuracionColumnasTiposTareas } from '../domain/configuracionColumnasTecnico'
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
//import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
//import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import flatPickr from 'vue-flatpickr-component';

// Logica y controladores
//import { ComportamientoModalesSubtarea } from '../application/ComportamientoModalesSubtarea'
import { useTareaStore } from 'stores/tarea'
import { Tecnico } from '../domain/Tecnico'

export default defineComponent({
  components: { EssentialTable, flatPickr },
  setup() {
    const tareaStore = useTareaStore()

    const step = ref(1)

    const busqueda = ref()
    const tecnicoSeleccionado = ref()

    const seleccionBusqueda = ref('por_tecnico')

    const columnas = [
      ...configuracionColumnasTiposTareas,
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
    ])

    function enviar() {
      //
    }

    const subtarea = tareaStore.subtarea

    function eliminarTecnico({ posicion }) {
      datos.value.splice(posicion, 1)
    }

    //const modalesSubtarea = new ComportamientoModalesSubtarea()

    const causasIntervencion = computed(() => causaIntervencion.filter((causa: any) => causa.categoria === subtarea.tipo_intervencion))

    return {
      step,
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
    }
  },
})
