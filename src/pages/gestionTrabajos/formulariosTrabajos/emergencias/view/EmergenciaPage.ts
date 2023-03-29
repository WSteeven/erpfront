// Dependencias
import { configuracionColumnasMaterialOcupadoFormulario } from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/configuracionColumnasMaterialOcupadoFormulario'
import { regiones, atenciones, tiposIntervenciones, accionesTabla, acciones } from 'config/utils'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { computed, defineComponent, Ref, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { apiConfig, endpoints } from 'config/api'
import { AxiosResponse } from 'axios'

// Componentes
import TrabajoRealizado from 'pages/gestionTrabajos/formulariosTrabajos/trabajosRealizados/view/TablaTrabajoRealizadoPage.vue'
import TablaObservaciones from 'gestionTrabajos/formulariosTrabajos/tablaObservaciones/view/TablaObservacion.vue'
import TablaDevolucionProducto from 'components/tables/view/TablaDevolucionProducto.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

// Logica y controladores
import { MaterialOcupadoFormulario } from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/MaterialOcupadoFormulario'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ProductoController } from 'pages/bodega/productos/infraestructure/ProductoController'
import { EmergenciaController } from '../infraestructure/EmergenciaController'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import { Emergencia } from '../domain/Emergencia'
import { MaterialEmpleadoController } from 'pages/gestionTrabajos/miBodega/infraestructure/MaterialEmpleadoController'
import { useAuthenticationStore } from 'stores/authentication'
import { descargarArchivo, imprimirArchivo } from 'shared/utils'

export default defineComponent({
  components: {
    EssentialTable,
    SelectorImagen,
    ButtonSubmits,
    TablaDevolucionProducto,
    TrabajoRealizado,
    TablaObservaciones,
  },
  emits: ['cerrar-modal'],
  setup(props, { emit }) {
    /*********
     * Stores
     *********/
    const trabajoAsignadoStore = useTrabajoAsignadoStore()
    const authenticationStore = useAuthenticationStore()

    /********
    * Mixin
    *********/
    const mixin = new ContenedorSimpleMixin(Emergencia, new EmergenciaController())
    const { entidad: emergencia, accion, listadosAuxiliares } = mixin.useReferencias()
    const { consultar, guardar, editar, reestablecer, setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
    const { onBeforeGuardar, onConsultado, onBeforeModificar, onGuardado, onModificado } = mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        productos: new ProductoController(),
      })
    })

    /************
     * Variables
     ************/
    const refTrabajos = ref()
    const refObservaciones = ref()
    const utilizarMateriales = ref(false)
    const existeMaterialesDevolucion = ref(false)
    const existeObservaciones = ref(false)
    const usarStock = ref(false)
    const columnasMaterial = [...configuracionColumnasMaterialOcupadoFormulario, accionesTabla]
    const { prompt } = useNotificaciones()
    const codigoSubtarea = trabajoAsignadoStore.codigoSubtarea
    const materiales: Ref<MaterialOcupadoFormulario[]> = ref([])
    const materialesStock: Ref<MaterialOcupadoFormulario[]> = ref([])
    const materialEmpleadoController = new MaterialEmpleadoController()
    const esLider = authenticationStore.esTecnicoLider
    const esCoordinador = authenticationStore.esCoordinador
    // const causasIntervencion = computed(() => causaIntervencion.filter((causa: CausaIntervencion) => causa.categoria === emergencia.tipo_intervencion))
    // const { notificarCorrecto } = useNotificaciones()

    /************
     * Init
     ************/
    // obtenerFormularioEmergencia()
    // console.log(trabajoAsignadoStore.idEmergencia)
    if (trabajoAsignadoStore.idEmergencia) {
      consultar({ id: trabajoAsignadoStore.idEmergencia })
      accion.value = acciones.editar
    }
    obtenerMateriales()
    obtenerMaterialesStock()

    /****************
     * Botones tabla
     ****************/
    const botonEditarCantidad: CustomActionTable = {
      titulo: 'Cantidad utilizada',
      icono: 'bi-pencil-square',
      color: 'primary',
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

    const botonEditarCantidadStock: CustomActionTable = {
      titulo: 'Cantidad utilizada',
      icono: 'bi-pencil-square',
      color: 'primary',
      accion: ({ entidad, posicion }) => {
        const config: CustomActionPrompt = {
          titulo: 'Confirmación',
          mensaje: 'Ingresa la cantidad',
          defecto: materialesStock.value[posicion].cantidad_utilizada,
          tipo: 'number',
          validacion: (val) => val >= 0 && val <= entidad.stock_actual,
          accion: (data) => materialesStock.value[posicion].cantidad_utilizada = data
        }

        prompt(config)
      },
    }

    /*************
    * Validaciones
    **************/
    const reglas = {
      // regional: { required },
    }

    const v$ = useVuelidate(reglas, emergencia)
    setValidador(v$.value)

    /************
    * Funciones
    *************/
    /* async function obtenerFormularioEmergencia() {
      await listar({ subtarea_id: trabajoAsignadoStore.idSubtareaSeleccionada })
      notificarCorrecto('Formulario iniciado exitosamente!')
      console.log(listado.value)
      if (listado.value.length) {
        emergencia.hydrate(listado.value[0])
        accion.value = acciones.editar
      }
    } */
    function obtenerIdEmpleadoResponsable() {
      if (esLider) return authenticationStore.user.id
      if (esCoordinador) return trabajoAsignadoStore.idEmpleadoResponsable
    }



    async function obtenerMateriales() {
      const axios = AxiosHttpRepository.getInstance()
      const ruta = axios.getEndpoint(endpoints.materiales_despachados_sin_bobina, { subtarea_id: trabajoAsignadoStore.idSubtareaSeleccionada, empleado_id: obtenerIdEmpleadoResponsable() })
      const response: AxiosResponse = await axios.get(ruta)
      materiales.value = response.data.results
    }

    async function obtenerMaterialesStock() {
      const { result } = await materialEmpleadoController.listar()
      materialesStock.value = result
    }

    function filtrarMaterialesOcupados() {
      return materiales.value.filter((material: any) => material.hasOwnProperty('cantidad_utilizada') && material.cantidad_utilizada > 0)
    }

    function ajustarCantidadesUtilizadas() {
      const materialesOcupados = emergencia.materiales_ocupados

      for (let i = 0; i < materiales.value.length; i++) {
        const indexOcupado = obtenerIndice(materialesOcupados, materiales.value[i].detalle_producto_id)
        if (indexOcupado >= 0) {
          if (accion.value === acciones.consultar) materiales.value[i].stock_actual = materialesOcupados[indexOcupado].stock_actual
          materiales.value[i].cantidad_utilizada = materialesOcupados[indexOcupado].cantidad_utilizada
        }
      }
    }

    function obtenerIndice(listadoBuscar, id) {
      return listadoBuscar.findIndex((item) => item.detalle_producto_id === id)
    }

    async function descargarExcel() {
      const axios = AxiosHttpRepository.getInstance()
      const ruta = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.exportExcelSeguimiento) + '/' + emergencia.id
      console.log(ruta)
      // const response: any = await consultar({ id: trabajoAsignadoStore.idEmergencia }, { export: 'excel' })
      //const response: Axios
      // console.log(response)
      // descargarArchivo(response, 'titulo', 'xlsx')
      imprimirArchivo(ruta, 'GET', 'blob', 'xlsx', 'reporte_hoy_')
    }

    /********
    * Hooks
    *********/
    onConsultado(() => {
      obtenerMateriales().then(() => ajustarCantidadesUtilizadas())
      existeObservaciones.value = !!emergencia.observaciones.length
      existeMaterialesDevolucion.value = !!emergencia.materiales_devolucion.length
      console.log(existeObservaciones.value)
    })

    onBeforeGuardar(() => {
      emergencia.materiales_ocupados = filtrarMaterialesOcupados()
      emergencia.subtarea = trabajoAsignadoStore.idSubtareaSeleccionada
    })

    onBeforeModificar(() => {
      emergencia.materiales_ocupados = filtrarMaterialesOcupados()
      emergencia.subtarea = trabajoAsignadoStore.idSubtareaSeleccionada
    })

    onGuardado(() => emit('cerrar-modal'))
    onModificado(() => {
      emit('cerrar-modal', false)
    })

    return {
      v$,
      refTrabajos,
      refObservaciones,
      emergencia,
      accion,
      // causasIntervencion,
      utilizarMateriales,
      existeMaterialesDevolucion,
      existeObservaciones,
      usarStock,
      columnasMaterial,
      materiales,
      materialesStock,
      botonEditarCantidad,
      botonEditarCantidadStock,
      regiones,
      atenciones,
      tiposIntervenciones,
      guardar,
      editar,
      reestablecer,
      emit,
      listadosAuxiliares,
      codigoSubtarea,
      esLider,
      esCoordinador,
      descargarExcel,
    }
  }
})
