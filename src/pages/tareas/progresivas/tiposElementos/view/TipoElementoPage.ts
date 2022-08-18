// Dependencias
import { configuracionColumnasTiposTareas } from '../domain/configuracionColumnasTiposTareas'
import { defineComponent, reactive } from 'vue'

// Componentes
import TabLayout from 'layouts/TabLayout.vue'

// Logica y controladores
import { TipoTarea } from '../domain/TipoTarea'

export default defineComponent({
  components: { TabLayout },
  setup() {
    const tipoTarea = reactive(new TipoTarea())

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
      //
    }
    return {
      tipoTarea,
      datos,
      configuracionColumnas: configuracionColumnasTiposTareas,
    }
  },
})
