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
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import flatPickr from 'vue-flatpickr-component';

// Logica y controladores
import { ComportamientoModalesSubtarea } from '../application/ComportamientoModalesSubtarea'
import { useTareaStore } from 'stores/tarea'
import { Tecnico } from '../domain/Tecnico'
import { getIndexOf } from 'shared/utils'

export default defineComponent({
  components: { EssentialTable, LabelAbrirModal, ModalesEntidad, flatPickr },
  setup() {
    const tareaStore = useTareaStore()

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
        nombres: 'LUIS',
        apellidos: 'TORRES',
        grupo: 'MACHALA',
      },
      {
        id: 2,
        nombres: 'ROBERTO',
        apellidos: 'CAICEDO',
        grupo: 'SANTO DOMINGO',
      },
    ])

    function enviar() {
      //
    }

    const subtarea = tareaStore.subtarea

    function eliminarTecnico(entidad) {
      const index = getIndexOf(datos.value, entidad.id)
      datos.value.splice(index, 1)
    }

    const modalesSubtarea = new ComportamientoModalesSubtarea()

    const causasIntervencion = computed(() => causaIntervencion.filter((causa: any) => causa.categoria === subtarea.tipo_intervencion))

    return {
      subtarea,
      seleccionBusqueda,
      columnas,
      datos,
      enviar,
      tecnicoSeleccionado,
      busqueda,
      grupos,
      eliminarTecnico,
      modalesSubtarea,
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
