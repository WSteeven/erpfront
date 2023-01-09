// Dependencias
import { configuracionColumnasProductos } from 'pages/bodega/productos/domain/configuracionColumnasProductos'
import { tiposElementos, propietariosElementos, estadoElementos, tiposTension, acciones } from 'config/utils'
import { configuracionColumnasResumenTendido } from '../domain/configuracionColumnasResumenTendido'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import { useTendidoStore } from 'stores/tendido'
import { defineComponent, ref } from 'vue'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { ResumenTendido } from '../domain/ResumenTendido'
import { RegistroTendido } from '../../registrosTendidos/domain/RegistroTendido'
import { RegistroTendidoController } from '../../registrosTendidos/infraestructure/RegistroTendidoController'

export default defineComponent({
  emits: ['cerrar-modal'],
  components: { EssentialTable },
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(RegistroTendido, new RegistroTendidoController())
    const { listado } = mixin.useReferencias()
    const { listar } = mixin.useComportamiento()

    const trabajoAsignadoStore = useTrabajoAsignadoStore()
    const tendidoStore = useTendidoStore()

    // if (tendidoStore.idRegistroTendido) consultar({ id: tendidoStore.idRegistroTendido })
    listar({ tendido: 1 })

    // const { confirmar, prompt } = useNotificaciones()

    const botonVerImagen: CustomActionTable = {
      titulo: 'Ver elemento',
      icono: 'bi-card-image',
      color: 'primary',
      accion: ({ entidad, posicion }) => {
        //
      },
    }

    const botonVerCruceAmericano: CustomActionTable = {
      titulo: 'Ver cruce americano',
      icono: 'bi-card-image',
      color: 'secondary',
      accion: ({ entidad, posicion }) => {
        //
      },
    }

    const botonVerPosteAnclaje1: CustomActionTable = {
      titulo: 'Ver poste anclaje 1',
      icono: 'bi-card-image',
      color: 'secondary',
      accion: ({ entidad, posicion }) => {
        //
      },
    }

    const botonVerPosteAnclaje2: CustomActionTable = {
      titulo: 'Ver poste anclaje 2',
      icono: 'bi-card-image',
      color: 'secondary',
      accion: ({ entidad, posicion }) => {
        //
      },
    }

    function cerrar() {
      emit('cerrar-modal')
    }

    const materiales: any = ref([])

    async function obtenerMateriales() {
      const axios = AxiosHttpRepository.getInstance()
      const ruta = axios.getEndpoint(endpoints.materiales_despachados_sin_bobina, { tarea: 2, grupo: 1 })
      const response: AxiosResponse = await axios.get(ruta)
      materiales.value = response.data.results
    }

    const columnas = [
      ...configuracionColumnasResumenTendido,
      {
        name: 'acciones',
        field: 'acciones',
        label: 'Acciones',
        align: 'center',
      },
    ]

    return {
      listado,
      cerrar,
      tiposElementos,
      propietariosElementos,
      estadoElementos,
      tiposTension,
      acciones,
      materiales,
      columnas,
      botonVerImagen,
      botonVerCruceAmericano,
      botonVerPosteAnclaje1,
      botonVerPosteAnclaje2,
      configuracionColumnasProductos,
    }
  }
})
