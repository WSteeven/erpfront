// Dependencias
import { configuracionColumnasSubtareas } from '../domain/configuracionColumnasSubtareas'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { defineComponent } from 'vue'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { useRouter } from 'vue-router'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/contenedorSimple.mixin'
import { Subtarea } from 'pages/tareas/subtareas/domain/Subtarea'
import { SubtareaController } from 'pages/tareas/subtareas/infraestructure/SubtareaController'

export default defineComponent({
  components: { EssentialTable },
  setup() {
    const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())

    const { listado } = mixin.useReferencias()
    const { listar } = mixin.useComportamiento()

    const router = useRouter()

    listar()
    //
    /* const listado = [
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
    ] */

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
