//Dependencias
import { computed, defineComponent, ref } from 'vue'
import { configuracionColumnasOrdenesReparaciones } from '../domain/configuracionColumnasOrdenesReparacion'

//Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import ErrorComponent from 'components/ErrorComponent.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { OrdenReparacion } from '../domain/OrdenReparacion'
import { OrdenReparacionController } from '../infraestructure/OrdenReparacionController'
import { useNotificaciones } from 'shared/notificaciones'
import { tabOptionsOrdenesReparaciones } from 'config/vehiculos.utils'
import { useAuthenticationStore } from 'stores/authentication'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { ServicioController } from 'pages/controlVehiculos/servicios/infraestructure/ServicioController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { obtenerFechaActual, ordenarLista } from 'shared/utils'
import { acciones, autorizaciones, maskFecha } from 'config/utils'
import { AsignacionVehiculoController } from 'pages/controlVehiculos/asignarVehiculos/infraestructure/AsignacionVehiculoController'
import { TransferenciaVehiculoController } from 'pages/controlVehiculos/transferenciaVehiculos/infraestructure/TransferenciaVehiculoController'
import { recargarGenerico } from 'shared/funcionesActualizacionListados'
import { VehiculoController } from 'pages/controlVehiculos/vehiculos/infraestructure/VehiculoController'
import { useQuasar } from 'quasar'
import { useNotificacionStore } from 'stores/notificacion'
import { useCargandoStore } from 'stores/cargando'
import { ConductorController } from 'pages/controlVehiculos/conductores/infraestructure/ConductorController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { AxiosResponse } from 'axios'

export default defineComponent({
  components: {
    ErrorComponent,
    NoOptionComponent,
    TabLayoutFilterTabs2,
    GestorArchivos
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      OrdenReparacion,
      new OrdenReparacionController()
    )
    const {
      entidad: orden,
      disabled,
      listadosAuxiliares,
      accion
    } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, listar } =
      mixin.useComportamiento()
    const { onReestablecer, onConsultado, onGuardado, onModificado } =
      mixin.useHooks()
    const {
      prompt,
      notificarCorrecto,
      notificarAdvertencia,
    } = useNotificaciones()
    /****************************************
     * Stores
     ****************************************/
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const cargando = new StatusEssentialLoading()
    const store = useAuthenticationStore()

    const visibleParaAdmin = computed(()=>['1', '2'].includes(tabActual.value) && store.esAdministradorVehiculos)

    const refArchivo = ref()
    const idOrden = ref()
    const tabActual = ref('1')
    const usuarioDefault = ref()

    const {
      empleados,
      filtrarEmpleados,
      servicios,
      filtrarServicios,
      vehiculos,
      filtrarVehiculos
    } = useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      usuarioDefault.value = await obtenerVehiculoAsignado()
      await obtenerListados({
        empleados: new ConductorController(),
        servicios: {
          controller: new ServicioController(),
          params: { tipo: 'CORRECTIVO', estado: 1 }
        },
        vehiculos: new VehiculoController()
        // vehiculos: store.esMecanicoGeneral ? new VehiculoController() : [],
      })
      empleados.value = listadosAuxiliares.empleados
      servicios.value = listadosAuxiliares.servicios
      vehiculos.value = listadosAuxiliares.vehiculos
      cargarDatosDefecto()
    })

    //Reglas de validacion
    const reglas = {
      solicitante: { required },
      vehiculo: { required },
      fecha: { required },
      autorizacion: { required },
      observacion: { required }
    }
    const v$ = useVuelidate(reglas, orden)
    setValidador(v$.value)

    /****************************************
     * HOOKS
     ****************************************/
    //Estos metodos funcionan si no se usa el keep alive
    onReestablecer(() => {
      setTimeout(() => {
        refArchivo.value.limpiarListado()
        refArchivo.value.quiero_subir_archivos = false
      }, 300)
      cargarDatosDefecto()
    })
    onConsultado(() => {
      setTimeout(() => {
        refArchivo.value.listarArchivosAlmacenados(orden.id)
      }, 1)
    })
    onGuardado((id: number) => {
      idOrden.value = id
      setTimeout(() => subirArchivos(), 1)
    })
    onModificado((id: number) => {
      idOrden.value = id
      setTimeout(() => subirArchivos(), 1)
    })

    /****************************************
     * Funciones
     ****************************************/
    async function filtrarOrdenesReparaciones(tab: string) {
      tabActual.value = tab
      await listar({ autorizacion_id: tab })
    }

    async function subirArchivos() {
      await refArchivo.value.subir()
    }

    /**
     * La función obtiene el vehículo asignado para el usuario actual con un estado específico.
     * @returns La función `obtenerVehiculoAsignado` está devolviendo el primer elemento del array
     * `resultado` de la respuesta del método `listar` en la clase `AsignacionVehiculoController`.
     */
    async function obtenerVehiculoAsignado() {
      const response = await new AsignacionVehiculoController().listar({
        filtro: 1,
        responsable_id: store.user.id,
        estado: 'ACEPTADO'
      })
      // console.log(response)
      if (response.result.length == 0) {
        const response = await new TransferenciaVehiculoController().listar({
          filtro: 1,
          responsable_id: store.user.id,
          estado: 'ACEPTADO'
        })
        // console.log(response)
        return response.result[0]
      } else {
        return response.result[0]
      }
    }

    function cargarDatosDefecto() {
      if (usuarioDefault.value) {
        orden.vehiculo = usuarioDefault.value.vehiculo
        orden.solicitante_id = usuarioDefault.value.responsable_id
        orden.solicitante = usuarioDefault.value.responsable
        orden.autorizacion = 1
      } else {
        if (store.esMecanicoGeneral) {
          orden.solicitante_id = store.user.id
          orden.solicitante = store.nombreUsuario
          orden.autorizacion = 2
        } else {
          orden.autorizacion = 1
        }
      }
      orden.fecha = obtenerFechaActual(maskFecha)
    }

    async function recargarVehiculos() {
      await recargarGenerico(
        listadosAuxiliares,
        'vehiculos',
        vehiculos,
        new VehiculoController()
      )
    }

    async function guardarValorReparacion(id, valor) {
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const url =
          apiConfig.URL_BASE +
          '/' +
          axios.getEndpoint(endpoints.ordenes_reparaciones) +
          '/registrar-valor-reparacion/' +
          id
        const response: AxiosResponse = await axios.post(url, {
          valor_reparacion: valor
        })
        if (response.status === 200) {
          notificarCorrecto(response.data.mensaje)
          return response.data.modelo
        } else notificarAdvertencia(response.data.mensaje)
      } catch (e) {
        console.error(e)
      } finally {
        cargando.desactivar()
      }
    }

    /****************************************
     * Botones de tabla
     ****************************************/
    const btnValorReparacion: CustomActionTable = {
      titulo: 'Valor Reparación',
      icono: 'bi-cash',
      accion: ({ entidad }) => {
        const data: CustomActionPrompt = {
          titulo: 'Valor de la reparación',
          mensaje: 'Ingrese el valor de la reparación',
          validacion: val => {
            const patron = /^(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+)?$/
            return patron.test(val)
          },
          requerido: true,
          accion: async data => {
            const result = await guardarValorReparacion(entidad.id, data)
            console.log(result)
            entidad.valor_reparacion = result.valor_reparacion
          }
        }
        prompt(data)
      },
      visible: () => visibleParaAdmin.value
      // visible: () => ['1', '2'].includes(tabActual.value) && store.esAdministradorVehiculos
    }

    return {
      mixin,
      orden,
      disabled,
      v$,
      accion,
      acciones,
      tabOptionsOrdenesReparaciones,
      configuracionColumnas: configuracionColumnasOrdenesReparaciones,

      tabActual,
      store,
      refArchivo,
      idOrden,
      maskFecha,
      visibleParaAdmin,

      //listados
      empleados,
      filtrarEmpleados,
      servicios,
      filtrarServicios,
      vehiculos,
      filtrarVehiculos,
      autorizaciones,

      //funciones
      ordenarLista,
      filtrarOrdenesReparaciones,
      recargarVehiculos,

      //botones de tabla
      btnValorReparacion
    }
  }
})
