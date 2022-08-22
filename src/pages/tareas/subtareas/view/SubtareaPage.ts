// Dependencias
import { configuracionColumnasTiposTareas } from '../domain/configuracionColumnasTecnico'
import { defineComponent, reactive, ref } from 'vue'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { Subtarea } from '../domain/Subtarea'

export default defineComponent({
  components: { EssentialTable },
  setup() {
    const subtarea = reactive(new Subtarea())

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

    const datos = [
      {
        cliente: 'ACCESS',
        categoria: 'RECABLEADO',
        nombre: 'RFO01-RECABLEADO CUADNO EL DAÑO ES FUERA DE CASA DEL CLIENTE',
      },
    ]

    function enviar() {
      //
    }

    return {
      subtarea,
      seleccionBusqueda,
      columnas,
      datos,
      enviar,
    }
  },
})
