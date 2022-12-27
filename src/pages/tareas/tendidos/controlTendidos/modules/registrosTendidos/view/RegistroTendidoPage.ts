// Dependencias
import { configuracionColumnasProductosSeleccionados } from 'pages/bodega/transacciones/modules/transaccionContent/domain/configuracionColumnasProductosSeleccionados'
import { configuracionColumnasProductos } from 'pages/bodega/productos/domain/configuracionColumnasProductos'
import { tiposElementos, propietariosElementos, estadoElementos, tiposTension, acciones } from 'config/utils'
import { useTendidoStore } from 'stores/tendido'
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { defineComponent, ref } from 'vue'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { RegistroTendido } from '../domain/RegistroTendido'

export default defineComponent({
  props: {
    mixinModal: {
      type: Object as () => ContenedorSimpleMixin<any>,
      required: true,
    },
  },
  emits: ['cerrar-modal'],
  components: {
    SelectorImagen,
    EssentialTable,
  },
  setup(props, { emit }) {
    const { guardar, editar, setValidador } = props.mixinModal.useComportamiento()
    const { entidad: tendido } = props.mixinModal.useReferencias()
    const { onBeforeGuardar } = props.mixinModal.useHooks()

    const tendidoStore = useTendidoStore()
    const accion = tendidoStore.accion

    // Reglas de validacion
    const reglas = {
      coordenada_del_elemento_latitud: { required },
      coordenada_del_elemento_longitud: { required },
      // imagen: { required },
      propietario_elemento: { required },
      numero_elemento: { required },
      codigo_elemento: { required },
      estado_elemento: { required },
      tipo_elemento: { required },
      progresiva_entrada: { required },
      progresiva_salida: { required },
    }

    const v$ = useVuelidate(reglas, tendido)
    setValidador(v$.value)

    const configuracionColumnasProductosSeleccionadosAccion = [...configuracionColumnasProductosSeleccionados,
    {
      name: 'acciones',
      field: 'acciones',
      label: 'Acciones',
      align: 'center'
    }]

    const { confirmar, prompt } = useNotificaciones()

    function eliminar({ posicion }) {
      confirmar('¿Esta seguro de continuar?',
        () =>
          tendido.listadoProductosSeleccionados.splice(posicion, 1))
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
          validacion: (val) => val > 0 && val <= entidad.cantidad_despachada,
          accion: (data) => materiales.value[posicion].cantidad_utilizada = data
        }

        prompt(config)
      },
    }

    async function guardarDatos(entidad: RegistroTendido) {
      try {
        await guardar(entidad, false)
        emit('cerrar-modal')
      } catch (e) { }
    }


    async function editarDatos(entidad: RegistroTendido) {
      try {
        await editar(entidad, false)
        emit('cerrar-modal')
      } catch (e) { }
    }

    function cerrar() {
      emit('cerrar-modal')
    }

    function obtenerUbicacion(onUbicacionConcedida) {

      const onErrorDeUbicacion = err => {
        console.log('Error obteniendo ubicación: ', err)
      }

      const opcionesDeSolicitud = {
        enableHighAccuracy: true, // Alta precisión
        maximumAge: 0, // No queremos caché
        timeout: 5000 // Esperar solo 5 segundos
      }

      navigator.geolocation.getCurrentPosition(onUbicacionConcedida, onErrorDeUbicacion, opcionesDeSolicitud)
    }

    function ubicacionCoordenadaElemento() {
      obtenerUbicacion((ubicacion) => {
        tendido.coordenada_del_elemento_latitud = ubicacion.coords.latitude
        tendido.coordenada_del_elemento_longitud = ubicacion.coords.longitude
      })
    }

    function ubicacionCoordenadaAmericano() {
      obtenerUbicacion((ubicacion) => {
        tendido.coordenada_cruce_americano_latitud = ubicacion.coords.latitude
        tendido.coordenada_cruce_americano_longitud = ubicacion.coords.longitude
      })
    }

    function ubicacionCoordenadaPosteAnclaje1() {
      obtenerUbicacion((ubicacion) => {
        tendido.coordenada_poste_anclaje1_latitud = ubicacion.coords.latitude
        tendido.coordenada_poste_anclaje1_longitud = ubicacion.coords.longitude
      })
    }

    function ubicacionCoordenadaPosteAnclaje2() {
      obtenerUbicacion((ubicacion) => {
        tendido.coordenada_poste_anclaje2_latitud = ubicacion.coords.latitude
        tendido.coordenada_poste_anclaje2_longitud = ubicacion.coords.longitude
      })
    }


    const materiales: any = ref([])
    async function obtenerMateriales() {
      const axios = AxiosHttpRepository.getInstance()
      const ruta = axios.getEndpoint(endpoints.materiales_despachados_sin_bobina) + '2'
      const response: AxiosResponse = await axios.get(ruta)
      console.log(response)
      materiales.value = response.data.results
    }

    obtenerMateriales()

    onBeforeGuardar(() => {
      tendido.tendido = tendidoStore.idTendido
    })

    return {
      tendido,
      guardarDatos,
      editarDatos,
      cerrar,
      tiposElementos,
      propietariosElementos,
      estadoElementos,
      tiposTension,
      v$,
      accion,
      acciones,
      materiales,
      configuracionColumnasProductosSeleccionadosAccion,
      configuracionColumnasProductosSeleccionados,
      eliminar,
      botonEditarCantidad,
      obtenerUbicacion,
      ubicacionCoordenadaElemento,
      ubicacionCoordenadaAmericano,
      ubicacionCoordenadaPosteAnclaje1,
      ubicacionCoordenadaPosteAnclaje2,
      configuracionColumnasProductos,
    }
  }
})
