// Dependencias
import { configuracionColumnasTrabajoRealizado } from '../../../domain/configuracionColumnasTrabajoRealizado'
import { configuracionColumnasObservacion } from '../../../domain/configuracionColumnasObservacion'
import { configuracionColumnasMaterial } from '../../../domain/configuracionColumnasMaterial'
import { regiones, atenciones, tiposIntervenciones, causaIntervencion } from 'config/utils'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { computed, defineComponent, reactive, ref } from 'vue'
import { useAuthenticationStore } from 'stores/authentication'
import { useTendidoStore } from 'stores/tendido'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'

// Componentes
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import TrabajoRealizado from 'pages/tareas/controlTareas/modules/subtareas/domain/TrabajoRealizado'
import Observacion from 'pages/tareas/controlTareas/modules/subtareas/domain/Observacion'
import { useNotificaciones } from 'shared/notificaciones'
import { ControlAvance } from '../domain/ControlAvance'

export default defineComponent({
  components: {
    EssentialTable,
  },
  setup() {
    const controlAvance = reactive(new ControlAvance())
    const acciones = {
      name: 'acciones',
      field: 'acciones',
      label: 'Acciones',
      align: 'center',
    }

    const authenticationStore = useAuthenticationStore()
    const tendidoStore = useTendidoStore()

    const { prompt } = useNotificaciones()

    const columnasTrabajoRealizado = [
      ...configuracionColumnasTrabajoRealizado,
      acciones
    ]

    const columnasObservacion = [...configuracionColumnasObservacion, acciones]

    const columnasMaterial = [...configuracionColumnasMaterial, acciones]

    const eliminarTrabajoRealizado = ({ posicion }) => {
      controlAvance.trabajos_realizados.splice(posicion)
    }

    const eliminarObservacion = ({ posicion }) => {
      controlAvance.observaciones.splice(posicion)
    }

    const agregarActividadRealizada: CustomActionTable = {
      titulo: 'Agregar actividad realizada',
      icono: 'bi-plus',
      color: 'positive',
      accion: () => controlAvance.trabajos_realizados.push(new TrabajoRealizado()),
    }

    const agregarObservacion: CustomActionTable = {
      titulo: 'Agregar observación',
      color: 'positive',
      icono: 'bi-plus',
      accion: () => controlAvance.observaciones.push(new Observacion()),
    }

    const botonEditarCantidad: CustomActionTable = {
      titulo: 'Cantidad utilizada',
      icono: 'bi-pencil',
      color: 'secondary',
      accion: ({ entidad, posicion }) => {
        const config: CustomActionPrompt = {
          titulo: 'Confirmación',
          mensaje: 'Ingresa la cantidad',
          defecto: materiales.value[posicion].cantidad_utilizada,
          tipo: 'number',
          validacion: (val) => val >= 0 && val <= entidad.stock_actual,
          accion: (data) => materiales.value[posicion].cantidad_utilizada = data
        }

        prompt(config)
      },
    }

    const causasIntervencion = computed(() => causaIntervencion.filter((causa: any) => causa.categoria === controlAvance.tipo_intervencion))

    const materiales: any = ref([])

    async function obtenerMateriales() {
      const axios = AxiosHttpRepository.getInstance()
      const ruta = axios.getEndpoint(endpoints.materiales_despachados_sin_bobina, { tarea: 1, grupo: authenticationStore.user.grupo_id })
      const response: AxiosResponse = await axios.get(ruta)
      materiales.value = response.data.results
    }

    obtenerMateriales()

    return {
      controlAvance,
      causasIntervencion,
      // columnas
      columnasTrabajoRealizado,
      columnasObservacion,
      columnasMaterial,
      // listados
      materiales,
      agregarActividadRealizada,
      agregarObservacion,
      botonEditarCantidad,
      // config
      regiones,
      atenciones,
      tiposIntervenciones,
      eliminarTrabajoRealizado,
      eliminarObservacion,
    }
  }
})
