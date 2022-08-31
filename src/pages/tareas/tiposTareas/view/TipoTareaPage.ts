// Dependencias
import { configuracionColumnasTiposTareas } from '../domain/configuracionColumnasTiposTareas'
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'layouts/TabLayout.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/contenedorSimple.mixin'
import { TipoTareaController } from '../infraestructure/TipoTareaController'
import { TipoTarea } from '../domain/TipoTarea'

export default defineComponent({
  components: {
    TabLayout,
    EssentialSelectableTable,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      TipoTarea,
      new TipoTareaController()
    )
    const { entidad: tipoTarea, disabled, accion } = mixin.useReferencias()
    const { cargarVista, obtenerListados, setValidador } =
      mixin.useComportamiento()

    function saludar(v) {
      console.log(v.data)
      tipoTarea.cliente = v.data.toUpperCase()
    }

    const datos = [
      {
        id: 1,
        cliente: 'TELCONET',
        nombre: 'HINCADO (U)',
      },
      {
        id: 2,
        cliente: 'TELCONET',
        nombre: 'RETIRO (U)',
      },
      {
        id: 3,
        cliente: 'TELCONET',
        nombre: 'TENDIDO (M)',
      },
      {
        id: 4,
        cliente: 'TELCONET',
        nombre: 'DESMONTAJE (M)',
      },
      {
        id: 5,
        cliente: 'NEDETEL',
        nombre: 'INSTALACION',
      },
      {
        id: 6,
        cliente: 'NEDETEL',
        nombre: 'CABLEADO',
      },
      {
        id: 7,
        cliente: 'NEDETEL',
        nombre: 'ASISTENCIA NODO NEDETEL',
      },
      {
        id: 8,
        cliente: 'NEDETEL',
        nombre: 'ASISTENCIA NODO CLIENTE',
      },
      {
        id: 9,
        cliente: 'NEDETEL',
        nombre: 'MIGRACIÓN',
      },
      {
        id: 10,
        cliente: 'NEDETEL',
        nombre: 'EMERGENCIA',
      },
      {
        id: 11,
        cliente: 'NEDETEL',
        nombre: 'RECORRIDO',
      },
      {
        id: 12,
        cliente: 'NEDETEL',
        nombre: 'FACTIBILIDAD',
      },
      {
        id: 13,
        cliente: 'NEDETEL',
        nombre: 'AUDITORÍA',
      },
      {
        id: 14,
        cliente: 'NEDETEL',
        nombre: 'LEVANTAMIENTO DE INFORMACIÓN',
      },
      {
        id: 15,
        cliente: 'NEDETEL',
        nombre: 'LOGÍSTICA',
      },
      {
        id: 16,
        cliente: 'NEDETEL',
        nombre: 'DESINSTALACIÓN',
      },
      {
        id: 17,
        cliente: 'NEDETEL',
        nombre: 'RETIRO DE EQUIPOS',
      },
      {
        id: 18,
        cliente: 'NEDETEL',
        nombre: 'DESMONTAJE',
      },
      {
        id: 19,
        cliente: 'NEDETEL',
        nombre: 'CERTIFICACIÓN',
      },
      {
        id: 20,
        cliente: 'NEDETEL',
        nombre: 'ENVÍO DE INFORMACIÓN',
      },
      {
        id: 21,
        cliente: 'NEDETEL',
        nombre: 'TRASLADO',
      },
    ]
    /* const datos = [
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
] */

    const rules = {
      cliente: { required },
      nombre: { required },
    }

    const v$ = useVuelidate(rules, tipoTarea)
    setValidador(v$.value)

    return {
      // mixin
      mixin,
      tipoTarea,
      disabled,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasTiposTareas,
      saludar,
    }
  },
})
