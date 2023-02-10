// Dependencias
import { configuracionColumnasProductos } from 'pages/bodega/productos/domain/configuracionColumnasProductos'
import { tiposElementos, propietariosElementos, estadoElementos, tiposTension, acciones } from 'config/utils'
import { configuracionColumnasResumenTendido } from '../domain/configuracionColumnasResumenTendido'
import { useTendidoStore } from 'stores/tendido'
import { computed, defineComponent, ref } from 'vue'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { RegistroTendidoController } from '../../registrosTendidos/infraestructure/RegistroTendidoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { RegistroTendido } from '../../registrosTendidos/domain/RegistroTendido'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'

export default defineComponent({
  emits: ['cerrar-modal'],
  components: {
    EssentialTable,
  },
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(RegistroTendido, new RegistroTendidoController())
    const { listado } = mixin.useReferencias()
    const { listar } = mixin.useComportamiento()

    const tendidoStore = useTendidoStore()

    listar({ tendido: tendidoStore.idTendido })

    const botonVerImagen: CustomActionTable = {
      titulo: 'Ver elemento',
      icono: 'bi-image',
      color: 'primary',
      accion: ({ entidad }) => {
        window.open(entidad.imagen_elemento, '_blank')
      },
    }

    const botonVerCruceAmericano: CustomActionTable = {
      titulo: 'Ver cruce americano',
      icono: 'bi-image-fill',
      color: 'secondary',
      visible: ({ entidad }) => entidad.imagen_cruce_americano,
      accion: ({ entidad }) => {
        window.open(entidad.imagen_cruce_americano, '_blank')
      },
    }

    const botonVerPosteAnclaje1: CustomActionTable = {
      titulo: 'Ver poste anclaje 1',
      icono: 'bi-image-fill',
      color: 'secondary',
      visible: ({ entidad }) => entidad.imagen_poste_anclaje1,
      accion: ({ entidad }) => {
        window.open(entidad.imagen_poste_anclaje1, '_blank')
      },
    }

    const botonVerPosteAnclaje2: CustomActionTable = {
      titulo: 'Ver poste anclaje 2',
      icono: 'bi-image-fill',
      color: 'secondary',
      visible: ({ entidad }) => entidad.imagen_poste_anclaje2,
      accion: ({ entidad }) => {
        window.open(entidad.imagen_poste_anclaje2, '_blank')
      },
    }

    function cerrar() {
      emit('cerrar-modal')
    }

    const materiales: any = ref([])
    const colsMateriales = ref([])

    async function obtenerMateriales() {
      const axios = AxiosHttpRepository.getInstance()
      const ruta = axios.getEndpoint(endpoints.materiales_despachados_sin_bobina, { tarea: 2, grupo: 1 })
      const response: AxiosResponse = await axios.get(ruta)
      materiales.value = response.data.results
      colsMateriales.value = generarConfiguracionColumnas()
      console.log('Materiales para columnas')
      console.log(colsMateriales.value)
    }

    function generarConfiguracionColumnas() {
      return materiales.value.map((material) => {
        return {
          name: material.detalle.replace(/\s+/g, ''),
          field: material.detalle.replace(/\s+/g, ''),
          label: material.detalle,
          align: 'center',
        }
      })
    }

    obtenerMateriales()

    const columnas = computed(() => [
      ...configuracionColumnasResumenTendido,
      {
        name: 'acciones',
        field: 'acciones',
        label: 'Acciones',
        align: 'center',
      },
      ...colsMateriales.value,
    ])

    /* const objMaterialesString = listado.value.map(entidad => entidad.materiales_ocupados.map(material => '{' + material.detalle + ': ' + material.cantidad_utilizada + '}'))
    console.log(objMaterialesString)
    const objMateriales = JSON.parse(objMaterialesString)
    console.log(objMateriales) */

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
      colsMateriales,
    }
  }
})
