// Dependencias
import { configuracionColumnasMaterialOcupadoFormulario } from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/configuracionColumnasMaterialOcupadoFormulario'
import { configuracionColumnasTrabajoRealizado } from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/configuracionColumnasTrabajoRealizado'
import { configuracionColumnasObservacion } from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/configuracionColumnasObservacion'
import { regiones, atenciones, tiposIntervenciones, causaIntervencion, accionesTabla } from 'config/utils'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { computed, defineComponent, Ref, ref } from 'vue'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { MaterialOcupadoFormulario } from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/MaterialOcupadoFormulario'
import TrabajoRealizado from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/TrabajoRealizado'
import Observacion from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/Observacion'
import { EmergenciaController } from '../infraestructure/EmergenciaController'
import { Emergencia } from '../domain/Emergencia'
import { CausaIntervencion } from './CausaIntervencion'
import { obtenerTiempoActual } from 'shared/utils'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

export default defineComponent({
  components: {
    EssentialTable,
    SelectorImagen,
  },
  setup() {
    /*********
     * Stores
     *********/
    const authenticationStore = useAuthenticationStore()

    /********
    * Mixin
    *********/
    const mixin = new ContenedorSimpleMixin(Emergencia, new EmergenciaController())
    const { entidad: emergencia, accion } = mixin.useReferencias()

    /***************************
    * Configuracion de columnas
    ****************************/
    const columnasTrabajoRealizado = [
      ...configuracionColumnasTrabajoRealizado,
      accionesTabla
    ]

    const columnasObservacion = [...configuracionColumnasObservacion, accionesTabla]

    const columnasMaterial = [...configuracionColumnasMaterialOcupadoFormulario, accionesTabla]

    /***************
     * Botones tabla
     ***************/
    const agregarActividadRealizada: CustomActionTable = {
      titulo: 'Insertar fila debajo',
      icono: 'bi-arrow-bar-down',
      color: 'positive',
      accion: async () => {
        const fila: TrabajoRealizado = new TrabajoRealizado()
        const { hora } = await obtenerTiempoActual()
        fila.hora = hora
        emergencia.trabajos_realizados.push(fila)
      }
    }

    const agregarObservacion: CustomActionTable = {
      titulo: 'Insertar fila debajo',
      icono: 'bi-arrow-bar-down',
      color: 'positive',
      accion: () => emergencia.observaciones.push(new Observacion()),
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

    const { prompt } = useNotificaciones()

    const eliminarTrabajoRealizado = ({ posicion }) => {
      emergencia.trabajos_realizados.splice(posicion, 1)
    }

    const eliminarObservacion = ({ posicion }) => {
      emergencia.observaciones.splice(posicion, 1)
    }

    const causasIntervencion = computed(() => causaIntervencion.filter((causa: CausaIntervencion) => causa.categoria === emergencia.tipo_intervencion))

    const materiales: Ref<MaterialOcupadoFormulario[]> = ref([])

    async function obtenerMateriales() {
      const axios = AxiosHttpRepository.getInstance()
      const ruta = axios.getEndpoint(endpoints.materiales_despachados_sin_bobina, { tarea: 1, grupo: authenticationStore.user.grupo_id })
      const response: AxiosResponse = await axios.get(ruta)
      materiales.value = response.data.results
    }

    obtenerMateriales()

    return {
      emergencia,
      accion,
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
