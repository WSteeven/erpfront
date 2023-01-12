// Dependencias
import { configuracionColumnasMaterialOcupado } from '../domain/configuracionColumnasMaterialOcupado'
import { configuracionColumnasProductos } from 'pages/bodega/productos/domain/configuracionColumnasProductos'
import { tiposElementos, propietariosElementos, estadoElementos, tiposTension, acciones } from 'config/utils'
import { useTendidoStore } from 'stores/tendido'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
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
import { useAuthenticationStore } from 'stores/authentication'

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
    const { guardar, editar, consultar, setValidador } = props.mixinModal.useComportamiento()
    const { entidad: registroTendido, disabled, accion } = props.mixinModal.useReferencias()
    const { onBeforeGuardar, onConsultado, onBeforeModificar } = props.mixinModal.useHooks()

    const tendidoStore = useTendidoStore()
    const trabajoAsignadoStore = useTrabajoAsignadoStore()
    const authenticationStore = useAuthenticationStore()
    accion.value = tendidoStore.accion

    if (tendidoStore.idRegistroTendido) consultar({ id: tendidoStore.idRegistroTendido })
    else registroTendido.numero_elemento = tendidoStore.numeroElemento

    // Reglas de validacion
    const reglas = {
      coordenada_del_elemento_latitud: { required },
      coordenada_del_elemento_longitud: { required },
      imagen_elemento: { required },
      propietario_elemento: { required },
      numero_elemento: { required },
      codigo_elemento: { required },
      estado_elemento: { required },
      tipo_elemento: { required },
      progresiva_entrada: { required },
      progresiva_salida: { required },
    }

    const v$ = useVuelidate(reglas, registroTendido)
    setValidador(v$.value)

    const configuracionColumnasMaterialOcupadoAccion = [...configuracionColumnasMaterialOcupado,
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
          registroTendido.listadoProductosSeleccionados.splice(posicion, 1))
    }

    const botonEditarCantidad: CustomActionTable = {
      titulo: 'Cantidad utilizada',
      icono: 'bi-pencil',
      color: 'secondary',
      visible: () => accion.value !== acciones.consultar,
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
        registroTendido.coordenada_del_elemento_latitud = ubicacion.coords.latitude
        registroTendido.coordenada_del_elemento_longitud = ubicacion.coords.longitude
      })
    }

    function ubicacionCoordenadaAmericano() {
      obtenerUbicacion((ubicacion) => {
        registroTendido.coordenada_cruce_americano_latitud = ubicacion.coords.latitude
        registroTendido.coordenada_cruce_americano_longitud = ubicacion.coords.longitude
      })
    }

    function ubicacionCoordenadaPosteAnclaje1() {
      obtenerUbicacion((ubicacion) => {
        registroTendido.coordenada_poste_anclaje1_latitud = ubicacion.coords.latitude
        registroTendido.coordenada_poste_anclaje1_longitud = ubicacion.coords.longitude
      })
    }

    function ubicacionCoordenadaPosteAnclaje2() {
      obtenerUbicacion((ubicacion) => {
        registroTendido.coordenada_poste_anclaje2_latitud = ubicacion.coords.latitude
        registroTendido.coordenada_poste_anclaje2_longitud = ubicacion.coords.longitude
      })
    }

    const materiales: any = ref([])

    async function obtenerMateriales() {
      const axios = AxiosHttpRepository.getInstance()
      const ruta = axios.getEndpoint(endpoints.materiales_despachados_sin_bobina, { tarea: tendidoStore.idTarea, grupo: authenticationStore.user.grupo_id })
      const response: AxiosResponse = await axios.get(ruta)
      materiales.value = response.data.results
    }

    function ajustarCantidadesUtilizadas() {
      const materialesOcupados = registroTendido.materiales_ocupados
      // console.log(materialesOcupados[0])

      for (let i = 0; i < materiales.value.length; i++) {
        const indexOcupado = obtenerIndice(materialesOcupados, materiales.value[i].detalle_producto_id)
        if (indexOcupado >= 0) {
          materiales.value[i].cantidad_utilizada = materialesOcupados[indexOcupado].cantidad_utilizada
        }
      }
    }

    function obtenerIndice(listadoBuscar, id) {
      return listadoBuscar.findIndex((item) => item.detalle_producto_id === id)
    }

    if (accion.value === acciones.nuevo) obtenerMateriales()

    // Hooks
    onConsultado(() => obtenerMateriales().then(() => ajustarCantidadesUtilizadas()))

    onBeforeModificar(() => registroTendido.materiales_ocupados = filtrarMaterialesOcupados())

    onBeforeGuardar(() => {
      registroTendido.tendido = tendidoStore.idTendido
      registroTendido.materiales_ocupados = filtrarMaterialesOcupados()
      registroTendido.subtarea = trabajoAsignadoStore.idSubtareaSeleccionada
    })

    function filtrarMaterialesOcupados() {
      return materiales.value.filter((material: any) => material.hasOwnProperty('cantidad_utilizada') && material.cantidad_utilizada > 0)
    }

    return {
      disabled,
      registroTendido,
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
      configuracionColumnasMaterialOcupadoAccion,
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
