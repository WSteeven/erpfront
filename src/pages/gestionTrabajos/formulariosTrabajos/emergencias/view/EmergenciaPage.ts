// Dependencias
import { configuracionColumnasMaterialOcupadoFormulario } from 'gestionTrabajos/formulariosTrabajos/emergencias/domain/configuracionColumnasMaterialOcupadoFormulario'
import { regiones, atenciones, tiposIntervenciones, accionesTabla, acciones, estadosTrabajos } from 'config/utils'
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
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'

export default defineComponent({
  components: {
    EssentialTable,
    SelectorImagen,
    ButtonSubmits,
    TablaDevolucionProducto,
    TrabajoRealizado,
    TablaObservaciones,
  },
  props: {
    mixinModal: {
      type: Object as () => ContenedorSimpleMixin<Subtarea>,
      required: true,
    },
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

    const { listar: listarSubtareas } = props.mixinModal.useComportamiento()

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
    const usarMaterialTarea = ref(false)
    const usarStock = ref(false)
    const columnasMaterial = [...configuracionColumnasMaterialOcupadoFormulario, accionesTabla]
    const { prompt } = useNotificaciones()
    const codigoSubtarea = trabajoAsignadoStore.codigoSubtarea
    const materialesTarea: Ref<MaterialOcupadoFormulario[]> = ref([])
    const materialesStock: Ref<MaterialOcupadoFormulario[]> = ref([])
    const materialEmpleadoController = new MaterialEmpleadoController()
    const esLider = authenticationStore.esTecnicoLider
    const esCoordinador = authenticationStore.esCoordinador

    /************
     * Init
     ************/
    if (trabajoAsignadoStore.idEmergencia) {
      consultar({ id: trabajoAsignadoStore.idEmergencia })
      accion.value = acciones.editar
    }

    obtenerMaterialesTarea()
    obtenerMaterialesStock()

    /****************
     * Botones tabla
     ****************/
    const botonEditarCantidadTarea: CustomActionTable = {
      titulo: 'Cantidad utilizada',
      icono: 'bi-pencil-square',
      color: 'primary',
      accion: ({ entidad, posicion }) => {
        const config: CustomActionPrompt = {
          titulo: 'Confirmación',
          mensaje: 'Ingresa la cantidad',
          defecto: materialesTarea.value[posicion].cantidad_utilizada,
          tipo: 'number',
          validacion: (val) => val >= 0 && (accion.value === acciones.nuevo ? val <= entidad.stock_actual : true),
          accion: (data) => materialesTarea.value[posicion].cantidad_utilizada = data
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
          validacion: (val) => val >= 0 && (accion.value === acciones.nuevo ? val <= entidad.stock_actual : true),
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
    function obtenerIdEmpleadoResponsable() {
      if (esLider) return authenticationStore.user.id
      else return trabajoAsignadoStore.idEmpleadoResponsable
    }



    async function obtenerMaterialesTarea() {
      const axios = AxiosHttpRepository.getInstance()
      const ruta = axios.getEndpoint(endpoints.materiales_empleado_tarea, { tarea_id: trabajoAsignadoStore.idTareaSeleccionada, empleado_id: obtenerIdEmpleadoResponsable() })
      const response: AxiosResponse = await axios.get(ruta)
      materialesTarea.value = response.data.results
    }

    async function obtenerMaterialesStock() {
      const { result } = await materialEmpleadoController.listar({ empleado_id: obtenerIdEmpleadoResponsable() })
      materialesStock.value = result
    }

    function filtrarMaterialesTareaOcupados() {
      return materialesTarea.value.filter((material: any) => material.hasOwnProperty('cantidad_utilizada')) // && material.cantidad_utilizada > 0)
    }

    function filtrarMaterialesStockOcupados() {
      return materialesStock.value.filter((material: any) => material.hasOwnProperty('cantidad_utilizada')) // && material.cantidad_utilizada > 0)
    }

    function ajustarCantidadesMaterialTareaUtilizadas() {
      const materialesTareaOcupados = emergencia.materiales_tarea_ocupados

      for (let i = 0; i < materialesTarea.value.length; i++) {
        const indexOcupado = obtenerIndice(materialesTareaOcupados, materialesTarea.value[i].detalle_producto_id)
        if (indexOcupado >= 0) {
          if (accion.value === acciones.consultar) materialesTarea.value[i].stock_actual = materialesTareaOcupados[indexOcupado].stock_actual
          materialesTarea.value[i].cantidad_utilizada = materialesTareaOcupados[indexOcupado].cantidad_utilizada
          materialesTarea.value[i].cantidad_old = materialesTareaOcupados[indexOcupado].cantidad_utilizada
        }
      }
    }

    function ajustarCantidadesMaterialStockUtilizadas() {
      const materialesStockOcupados = emergencia.materiales_stock_ocupados

      for (let i = 0; i < materialesStock.value.length; i++) {
        const indexOcupado = obtenerIndice(materialesStockOcupados, materialesStock.value[i].detalle_producto_id)
        if (indexOcupado >= 0) {
          if (accion.value === acciones.consultar) materialesStock.value[i].stock_actual = materialesStockOcupados[indexOcupado].stock_actual
          materialesStock.value[i].cantidad_utilizada = materialesStockOcupados[indexOcupado].cantidad_utilizada
          materialesStock.value[i].cantidad_old = materialesStockOcupados[indexOcupado].cantidad_utilizada
        }
      }
    }

    function obtenerIndice(listadoBuscar, id) {
      return listadoBuscar.findIndex((item) => item.detalle_producto_id === id)
    }

    async function descargarExcel() {
      const axios = AxiosHttpRepository.getInstance()
      const ruta = apiConfig.URL_BASE + '/' + axios.getEndpoint(endpoints.exportExcelSeguimiento) + '/' + emergencia.id
      imprimirArchivo(ruta, 'GET', 'blob', 'xlsx', 'reporte_hoy_')
    }

    function guardarSeguimiento() {
      guardar(emergencia, true, { empleado_id: obtenerIdEmpleadoResponsable(), tarea_id: trabajoAsignadoStore.idTareaSeleccionada })
    }

    function editarSeguimiento() {
      editar(emergencia, true, { empleado_id: obtenerIdEmpleadoResponsable(), tarea_id: trabajoAsignadoStore.idTareaSeleccionada })
    }

    /********
    * Hooks
    *********/
    onConsultado(async () => {
      await obtenerMaterialesTarea().then(() => ajustarCantidadesMaterialTareaUtilizadas())
      await obtenerMaterialesStock().then(() => ajustarCantidadesMaterialStockUtilizadas())
      existeObservaciones.value = !!emergencia.observaciones.length
      existeMaterialesDevolucion.value = !!emergencia.materiales_devolucion.length
      // console.log(existeObservaciones.value)
      usarMaterialTarea.value = materialesTarea.value.some((material: MaterialOcupadoFormulario) => material.cantidad_utilizada)
      usarStock.value = materialesStock.value.some((material: MaterialOcupadoFormulario) => material.cantidad_utilizada)
      console.log(usarMaterialTarea.value)
    })

    onBeforeGuardar(() => {
      emergencia.materiales_tarea_ocupados = filtrarMaterialesTareaOcupados()
      emergencia.materiales_stock_ocupados = filtrarMaterialesStockOcupados()
      emergencia.subtarea = trabajoAsignadoStore.idSubtareaSeleccionada
    })

    onBeforeModificar(() => {
      emergencia.materiales_tarea_ocupados = filtrarMaterialesTareaOcupados()
      emergencia.materiales_stock_ocupados = filtrarMaterialesStockOcupados()
      emergencia.subtarea = trabajoAsignadoStore.idSubtareaSeleccionada
    })

    onGuardado(() => {
      listarSubtareas({ estado: estadosTrabajos.EJECUTANDO })
      emit('cerrar-modal', false)
    })

    onModificado(() => {
      emit('cerrar-modal', false)
    })

    return {
      v$,
      refTrabajos,
      refObservaciones,
      emergencia,
      accion,
      guardarSeguimiento,
      editarSeguimiento,
      utilizarMateriales,
      existeMaterialesDevolucion,
      existeObservaciones,
      usarStock,
      usarMaterialTarea,
      columnasMaterial,
      materialesTarea,
      materialesStock,
      botonEditarCantidadTarea,
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
