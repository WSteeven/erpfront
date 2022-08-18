// Dependencias
import { configuracionColumnasTareas } from '../domain/configuracionColumnasTareas'
import { defineComponent, reactive, ref } from 'vue'

// Componentes
import TabLayout from 'layouts/TabLayout.vue'
import GeneralPage from 'src/pages/tareas/controlTareas/modules/GeneralContent/view/GeneralContent.vue'
import SubtareasContent from 'src/pages/tareas/controlTareas/modules/subtareasContent/view/SubtareasContent.vue'
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

    const listado: any[] = [
      {
        id: 1,
        codigo_tarea_jp: 'JP000001',
        codigo_tarea_cliente: 'ADD878',
        detalle: 'Nombre de tarea',
        cliente: 'NEDETEL',
        solicitante: 'JOAQUIN PIZARRO',
        correo_solicitante: 'JPIZARRO@NEDETEL.EC',
        fecha_finalizacion: '2022/08/31',
        fecha_agendado: '11/08/2022',
        hora_agendado: '08:32',
        coordinador: 'MARILÚ JARAMILLO',
        estado: 'FINALIZADO',
        provincia: 'EL ORO',
        ciudad: 'MACHALA',
        parroquia: 'JAMBELÍ',
        referencias: '',
        direccion: 'MI CASA',
        georeferencia_x: '0145 855',
        georeferencia_y: '425 785',
      },
      {
        id: 2,
        codigo_tarea_jp: 'JP000002',
        codigo_tarea_cliente: 'ADD879',
        coordinador: 'MARILÚ JARAMILLO',
        cliente: 'NEDETEL',
        estado: 'EJECUTANDO',
      },
      {
        id: 3,
        codigo_tarea_jp: 'JP000003',
        codigo_tarea_cliente: 'ADD858',
        coordinador: 'MARILÚ JARAMILLO',
        cliente: 'NEDETEL',
        estado: 'CREADO',
      },
      {
        id: 4,
        codigo_tarea_jp: 'JP000004',
        codigo_tarea_cliente: 'ADD874',
        coordinador: 'MARILÚ JARAMILLO',
        cliente: 'NEDETEL',
        estado: 'FINALIZADO',
      },
      {
        id: 5,
        codigo_tarea_jp: 'JP000005',
        codigo_tarea_cliente: 'ADD875',
        coordinador: 'MARILÚ JARAMILLO',
        cliente: 'NEDETEL',
        estado: 'EJECUTANDO',
      },
      {
        id: 6,
        codigo_tarea_jp: 'JP000006',
        codigo_tarea_cliente: 'ADD856',
        coordinador: 'MARILÚ JARAMILLO',
        cliente: 'NEDETEL',
        estado: 'CREADO',
      },
      {
        id: 7,
        codigo_tarea_jp: 'JP000007',
        codigo_tarea_cliente: '56551844',
        coordinador: 'DARIO LOJA',
        cliente: 'TELCONET',
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
