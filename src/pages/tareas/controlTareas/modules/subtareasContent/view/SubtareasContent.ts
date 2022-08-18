// Dependencias
import { configuracionColumnasSubtareas } from '../domain/configuracionColumnasSubtareas'
import { defineComponent } from 'vue'

// Componentes
import EssentialTable from 'src/components/tables/view/EssentialTable.vue'

export default defineComponent({
  components: { EssentialTable },
  setup() {
    //
    const listado = [
      {
        id: 1,
        coordinador: 'MARILÚ JARAMILLO',
        codigo_subtarea_jp: 'JP000001_1',
        tipo_tarea: 'INSTALACION',
        fecha_asignado: '11/08/2022',
        estado: 'REALIZADO',
      },
      {
        id: 2,
        coordinador: 'MARILÚ JARAMILLO',
        codigo_subtarea_jp: 'JP000001_2',
        tipo_tarea: 'INSTALACION',
        fecha_asignado: '20/08/2022',
        estado: 'CREADO',
      },
    ]
    return { configuracionColumnasSubtareas, listado }
  },
})
