// Dependencias
import { defineComponent, reactive, ref } from 'vue'
import { configuracionColumnasTareas } from '../domain/configuracionColumnasTareas'

// Componentes
import TabLayout from 'layouts/TabLayout.vue'
import GeneralPage from 'src/pages/tareas/view/GeneralContent.vue'
import SubtareasContent from 'src/pages/tareas/view/SubtareasContent.vue'
import SolicitudMaterialesContent from 'src/pages/tareas/view/SolicitudMaterialesContent.vue'
import DevolucionMaterialesContent from 'src/pages/tareas/view/DevolucionMaterialesContent.vue'
import PrefacturasContent from 'src/pages/tareas/view/PrefacturasContent.vue'

// Logica y controladores
import { Tarea } from '../domain/Tarea'

export default defineComponent({
  name: 'TareaPage',
  components: {
    TabLayout,
    GeneralPage,
    SubtareasContent,
    SolicitudMaterialesContent,
    PrefacturasContent,
    DevolucionMaterialesContent,
  },
  setup() {
    const tarea = reactive(new Tarea())

    const step = ref(1)
    const done1 = ref(false)
    const done2 = ref(false)
    const done3 = ref(false)
    const done4 = ref(false)
    const done5 = ref(false)

    const listado = [
      {
        id: 1,
        tarea_jp: 'JP001',
        tarea_cliente: 'ADD878',
        coordinador: 'MARILÚ JARAMILLO',
        cliente: 'NEDETEL',
        estado: 'FINALIZADO',
      },
      {
        id: 2,
        tarea_jp: 'JP002',
        tarea_cliente: 'ADD879',
        coordinador: 'MARILÚ JARAMILLO',
        cliente: 'NEDETEL',
        estado: 'EJECUTANDO',
      },
      {
        id: 3,
        tarea_jp: 'JP003',
        tarea_cliente: 'ADD858',
        coordinador: 'MARILÚ JARAMILLO',
        cliente: 'NEDETEL',
        estado: 'CREADO',
      },
      {
        id: 4,
        tarea_jp: 'JP004',
        tarea_cliente: 'ADD874',
        coordinador: 'MARILÚ JARAMILLO',
        cliente: 'NEDETEL',
        estado: 'FINALIZADO',
      },
      {
        id: 5,
        tarea_jp: 'JP005',
        tarea_cliente: 'ADD875',
        coordinador: 'MARILÚ JARAMILLO',
        cliente: 'NEDETEL',
        estado: 'EJECUTANDO',
      },
      {
        id: 6,
        tarea_jp: 'JP006',
        tarea_cliente: 'ADD856',
        coordinador: 'MARILÚ JARAMILLO',
        cliente: 'NEDETEL',
        estado: 'CREADO',
      },
    ]

    return {
      tarea,
      configuracionColumnas: configuracionColumnasTareas,
      listado,
      //
      step,
      done1,
      done2,
      done3,
      done4,
      done5,
    }
  },
})
