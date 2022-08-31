// Dependencias
import { configuracionColumnasTiposTareas } from '../domain/configuracionColumnasTecnico'
import { defineComponent, reactive, Ref, ref } from 'vue'
import {
  provincias,
  ciudades,
  grupos,
  tiposInstalaciones,
  tiposTareasTelconet,
  tiposTareasNedetel,
} from 'config/utils'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { Subtarea } from '../domain/Subtarea'
import { Tecnico } from '../domain/Tecnico'
import { getIndexOf } from 'shared/utils'
import { ComportamientoModalesSubtarea } from '../application/ComportamientoModalesSubtarea'

export default defineComponent({
  components: { EssentialTable, LabelAbrirModal, ModalesEntidad },
  setup() {
    const subtarea = reactive(new Subtarea())
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

    function eliminarTecnico(entidad) {
      const index = getIndexOf(datos.value, entidad.id)
      datos.value.splice(index, 1)
    }

    const modalesSubtarea = new ComportamientoModalesSubtarea()

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
    }
  },
})
