// Dependencias
import { configuracionColumnasTiposTareas } from '../domain/configuracionColumnasControlDiarioMateriales'
import { defineComponent, reactive } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

// Logica y controladores
import { ControlDiarioMaterial } from '../domain/ControlDiarioMaterial'
import { obtenerFechaActual } from 'src/pages/shared/utils'

export default defineComponent({
  components: {
    TabLayout,
  },
  setup() {
    const control = reactive(new ControlDiarioMaterial())
    control.codigo_tarea_jp = 'JP000001'
    control.codigo_subtarea_jp = 'JP000001_1'
    control.fecha = obtenerFechaActual()
    control.grupo = 'MACHALA'
    control.tecnico_responsable = 'FERNANDO AYORA'

    const datos = [
      {
        cliente: 'ACCESS',
        categoria: 'RECABLEADO',
        nombre: 'RFO01-RECABLEADO CUADNO EL DAÑO ES FUERA DE CASA DEL CLIENTE',
      },
      {
        cliente: 'ACCESS',
        categoria: 'INSTALACIÓN NUEVA',
        nombre: 'IBF01-INSTALACIÓN BÁSICA CASA GPON HASTA 300 METROS',
      },
      {
        cliente: 'ACCESS',
        categoria: 'INSTALACIÓN NUEVA',
        nombre: 'IBF02-INSTALACIÓN BÁSICA EDIFICIO GPON 300 METROS',
      },
      {
        cliente: 'NEDETEL',
        categoria: 'TAREA PROGRAMADA',
        nombre: 'TP-ARREGLO PATH NODO',
      },
      {
        cliente: 'NEDETEL',
        categoria: 'TAREA PROGRAMADA',
        nombre: 'TP-CAMBIO DE MANGAS',
      },
    ]

    function enviar() {
      //
    }
    return { control, datos, enviar, configuracionColumnasTiposTareas }
  },
})
