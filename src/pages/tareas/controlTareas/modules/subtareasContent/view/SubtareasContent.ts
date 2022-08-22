// Dependencias
import { configuracionColumnasSubtareas } from '../domain/configuracionColumnasSubtareas'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { defineComponent } from 'vue'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  components: { EssentialTable },
  setup() {
    const router = useRouter()
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

    const configuracionColumnas = [
      ...configuracionColumnasSubtareas,
      {
        name: 'acciones',
        field: 'acciones',
        label: 'Acciones',
        align: 'center',
      },
    ]

    const botonEditarSubtarea: CustomActionTable = {
      titulo: 'Gestionar',
      accion: (entidad) => {
        console.log(entidad)
        router.replace({ name: 'Subtareas' })
      },
    }

    return {
      configuracionColumnas,
      configuracionColumnasSubtareas,
      listado,
      botonEditarSubtarea,
    }
  },
})
