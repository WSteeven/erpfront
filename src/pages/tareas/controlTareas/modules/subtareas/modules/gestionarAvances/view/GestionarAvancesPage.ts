// Dependencias
import { configuracionColumnasEmpleado } from 'pages/tareas/controlTareas/modules/subtareas/domain/configuracionColumnasEmpleado'
import { computed, defineComponent, Ref, ref } from 'vue'
import { useTareaStore } from 'stores/tarea'
import {
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
import PausasRealizadasContent from '../modules/pausasRealizadas/view/PausasRealizadasPage.vue'
import ControlAvanceContent from '../modules/controlAvance/view/ControlAvanceContent.vue'
import ImagenAdicionalContent from '../modules/imagenesAdicionales/view/ImagenAdicionalContent.vue'
import InformacionAdicionalContent from '../modules/informacionAdicional/view/InformacionAdicionalContent.vue'

// Logica y controladores
import { Tecnico } from 'subtareas/domain/Tecnico'

export default defineComponent({
  components: { EssentialTable, PausasRealizadasContent, ControlAvanceContent, ImagenAdicionalContent, InformacionAdicionalContent },
  setup() {
    const tareaStore = useTareaStore()

    const busqueda = ref()
    const tecnicoSeleccionado = ref()

    const seleccionBusqueda = ref('por_tecnico')

    const columnas = [
      ...configuracionColumnasEmpleado,
      {
        name: 'acciones',
        field: 'acciones',
        label: 'Acciones',
        align: 'center',
      },
    ]

    const datos: Ref<Tecnico[]> = ref([])

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
