// Dependencias
import { configuracionColumnasTiposTareas } from '../domain/configuracionColumnasProgresivas'
import {
  tiposElementos,
  propietariosElementos,
  estadoElementos,
} from 'src/config/utils'
import { obtenerFechaActual } from 'pages/shared/utils'
import { defineComponent, reactive } from 'vue'

// Componentes
import TabLayout from 'layouts/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { Progresiva } from '../domain/Progresiva'
import { ComportamientoModalesProgresiva } from '../application/ComportamientoModalesProgresiva'

export default defineComponent({
  components: {
    TabLayout,
    SelectorImagen,
    LabelAbrirModal,
    ModalesEntidad,
  },
  setup() {
    const progresiva = reactive(new Progresiva())
    progresiva.codigo_tarea_jp = 'JP000001'
    progresiva.codigo_subtarea_jp = 'JP000001_1'
    progresiva.fecha = obtenerFechaActual()
    progresiva.nombre_proyecto = 'FTTH SARACAY'
    progresiva.grupo = 'MACHALA'
    progresiva.tecnico_responsable = 'FERNANDO AYORA'
    progresiva.tecnico = 'LUIS VACA'

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
      {
        cliente: 'NEDETEL',
        categoria: 'CORTE FIBRA',
        nombre: 'CF-ACCIDENTE DE TRÁNSITO',
      },
      {
        cliente: 'NEDETEL',
        categoria: '',
        nombre: 'INSTALACIÓN',
      },
      {
        cliente: 'NEDETEL',
        categoria: '',
        nombre: 'CABLEADO',
      },
      {
        cliente: 'TELCONET',
        categoria: '',
        nombre: 'HINCADO',
      },
      {
        cliente: 'TELCONET',
        categoria: '',
        nombre: 'RETIRO',
      },
      {
        cliente: 'TELCONET',
        categoria: '',
        nombre: 'TENDIDO',
      },
      {
        cliente: 'TELCONET',
        categoria: '',
        nombre: 'DESMONTAJE',
      },
    ]

    function enviar() {
      console.log(progresiva)
    }

    const setBase64 = (file: File) => {
      if (file !== null && file !== undefined) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => (progresiva.imagen = reader.result)
      } else {
        progresiva.imagen = file
      }
    }

    const modalesProgresiva = new ComportamientoModalesProgresiva()

    return {
      progresiva,
      datos,
      enviar,
      configuracionColumnasTiposTareas,
      setBase64,
      modalesProgresiva,
      // listados
      tiposElementos,
      propietariosElementos,
      estadoElementos,
    }
  },
})
