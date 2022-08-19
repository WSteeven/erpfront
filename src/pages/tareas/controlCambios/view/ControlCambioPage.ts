// Dependencias
import { configuracionColumnasControlCambios } from '../domain/configuracionColumnasControlCambios'
import { defineComponent, reactive } from 'vue'

// Componentes
import TabLayout from 'layouts/TabLayout.vue'

// Logica y controladores
import { ControlCambio } from '../domain/ControlCambio'
import { obtenerFechaActual } from 'src/pages/shared/utils'

export default defineComponent({
  components: {
    TabLayout,
  },
  setup() {
    const control = reactive(new ControlCambio())
    control.codigo_tarea_jp = 'JP000001'
    control.fecha = obtenerFechaActual()

    const datos = [
      {
        id: 1,
        codigo_tarea_jp: 'JP000001',
        codigo_tarea_cliente: '56551844',
        fecha: '27/5/2022',
        detalle_tarea:
          'RUTA MPLS CIRCULAR PALMALES, HINCADO DE POSTE EN RUTA MPLS CIRCULAR PALMALES',
        aprobado_por: 'JONATHAN REYES',
      },
      {
        id: 2,
        codigo_tarea_jp: 'JP000001',
        codigo_tarea_cliente: '56551844',
        fecha: '28/5/2022',
        detalle_tarea:
          'RUTA MPLS CIRCULAR PALMALES, HINCADO DE POSTE EN RUTA MPLS CIRCULAR PALMALES',
        aprobado_por: 'JONATHAN REYES',
      },
      {
        id: 3,
        codigo_tarea_jp: 'JP000001',
        codigo_tarea_cliente: '56551844',
        fecha: '30/5/2022',
        detalle_tarea:
          'RUTA MPLS CIRCULAR PALMALES, HINCADO DE POSTE EN RUTA MPLS CIRCULAR PALMALES',
        aprobado_por: 'JONATHAN REYES',
      },
      {
        id: 4,
        codigo_tarea_jp: 'JP000003',
        codigo_tarea_cliente: '56557849',
        fecha: '30/5/2022',
        detalle_tarea: 'RETIRO DE POSTE ENMAL ESTADO DE TN MACHALA',
        aprobado_por: 'JONATHAN REYES',
      },
    ]

    function enviar() {
      //
    }

    return { control, datos, enviar, configuracionColumnasControlCambios }
  },
})
