// Dependencias
import {
  acciones,
  accionesActivos,
  autorizacionesTransacciones,
  estadosCondicionesId,
  estadosCondicionesValue,
  estadosControlStock,
  estadosInventarios,
  estadosTransacciones,
  TipoSeleccion
} from 'config/utils'
import { estadosCalificacionProveedor } from 'config/utils_compras_proveedores'
// import { VisibleModal } from '../application/VisibleModal'
import {
  computed,
  defineComponent,
  nextTick,
  ref,
  Ref,
  watch,
  watchEffect
} from 'vue'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Instanciable } from 'shared/entidad/domain/instanciable'
import { CustomActionTable } from '../domain/CustomActionTable'
import { formatBytes, getVisibleColumns } from 'shared/utils'
import { ColumnConfig } from '../domain/ColumnConfig'
import { offset } from 'config/utils_tablas'
import { ParamsType } from 'config/types'
import { exportFile } from 'quasar'

// Componentes
import PrevisualizarTablaPdf from 'components/tables/view/PrevisualizarTablaPdf.vue'
import TableFilters from 'components/tables/view/TableFilters.vue'
import BotonesPaginacion from './BotonesPaginacion.vue'
import EditarTablaModal from './EditarTablaModal.vue'
import EstadosSubtareas from './EstadosSubtareas.vue'
import CustomButtons from './CustomButtonsTable.vue'
import VisorArchivos from './VisorArchivos.vue'
import CampoAprobadoRRHH from './partials/CampoAprobadoRRHH.vue'
import CampoDescontable from './partials/CampoDescontable.vue'
import { VisibleModal } from '../application/VisibleModal'
import CampoBoleano from './partials/CampoBoleano.vue'
import EstadosPostulaciones from './EstadosPostulaciones.vue'
import ErrorComponent from 'components/ErrorComponent.vue'
import SelectorImagen from 'components/SelectorImagen.vue';

export default defineComponent({
  components: {
    SelectorImagen,
    ErrorComponent,
    PrevisualizarTablaPdf,
    EditarTablaModal,
    CustomButtons,
    CampoDescontable,
    CampoBoleano,
    CampoAprobadoRRHH,
    EstadosPostulaciones,
    EstadosSubtareas,
    BotonesPaginacion,
    TableFilters,
    VisorArchivos
  },
  props: {
    // eslint-disable-next-line vue/require-valid-default-prop
    v$: { type: Object, default: {}, required: false },
    keyError: { type: String, required: false },
    identificador: { type: Number, default: -1 },
    referencia: Object as () => Ref,
    entidad: {
      type: Object as Instanciable,
      required: false
    },
    titulo: {
      type: String,
      default: 'Listado'
    },
    separador: {
      type: String,
      default: 'horizontal'
    },
    configuracionColumnas: {
      type: Object as () => ColumnConfig<EntidadAuditable>[],
      required: true
    },
    desplegarDesde: {
      type: Number,
      default: 2
    },
    datos: {
      type: Array,
      required: true
    },
    permitirEditarCeldas: {
      type: Boolean,
      default: false
    },
    permitirConsultar: {
      type: Boolean,
      default: true
    },
    permitirEditar: {
      type: Boolean,
      default: true
    },
    permitirEliminar: {
      type: Boolean,
      default: true
    },
    primeraColumnaFija: {
      type: Boolean,
      default: false
    },
    tipoSeleccion: {
      type: String as () => TipoSeleccion,
      default: 'none'
    },
    ajustarCeldas: {
      type: Boolean,
      default: true
    },
    accion1: {
      type: Object as () => CustomActionTable,
      required: false
    },
    accion2: {
      type: Object as () => CustomActionTable,
      required: false
    },
    accion3: {
      type: Object as () => CustomActionTable,
      required: false
    },
    accion4: {
      type: Object as () => CustomActionTable,
      required: false
    },
    accion5: {
      type: Object as () => CustomActionTable,
      required: false
    },
    accion6: {
      type: Object as () => CustomActionTable,
      required: false
    },
    accion7: {
      type: Object as () => CustomActionTable,
      required: false
    },
    accion8: {
      type: Object as () => CustomActionTable,
      required: false
    },
    accion9: {
      type: Object as () => CustomActionTable,
      required: false
    },
    accion10: {
      type: Object as () => CustomActionTable,
      required: false
    },
    accion11: {
      type: Object as () => CustomActionTable,
      required: false
    },
    accion1Header: {
      type: Object as () => CustomActionTable,
      required: false
    },
    accion2Header: {
      type: Object as () => CustomActionTable,
      required: false
    },
    accion3Header: {
      type: Object as () => CustomActionTable,
      required: false
    },
    accion4Header: {
      type: Object as () => CustomActionTable,
      required: false
    },
    accion5Header: {
      type: Object as () => CustomActionTable,
      required: false
    },
    accion6Header: {
      type: Object as () => CustomActionTable,
      required: false
    },
    mostrarBotones: {
      type: Boolean,
      default: true
    },
    altoFijo: {
      type: Boolean,
      default: true
    },
    mostrarHeader: {
      type: Boolean,
      default: true
    },
    mostrarCantidadElementos: {
      type: Boolean,
      default: true
    },
    mostrarFooter: {
      type: Boolean,
      default: true
    },
    permitirEditarModal: {
      type: Boolean,
      default: false
    },
    modalMaximized: {
      type: Boolean,
      default: true
    },
    permitirBuscar: {
      type: Boolean,
      default: true
    },
    permitirFiltrar: {
      type: Boolean,
      default: false
    },
    estilos: {
      type: String,
      required: false
    },
    mostrarColumnasVisibles: {
      type: Boolean,
      default: true
    },
    editarFilaLocal: {
      type: Boolean,
      default: true
    },
    mostrarExportar: {
      type: Boolean,
      default: false
    },
    grid: {
      type: Boolean,
      default: true
    },
    disable: {
      type: Boolean,
      default: false
    },
    emitirAlSeleccionar: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'consultar',
    'editar',
    'eliminar',
    'accion1',
    'accion2',
    'accion3',
    'accion4',
    'accion5',
    'accion6',
    'accion7',
    'accion8',
    'accion9',
    'accion10',
    'accion11',
    'selected',
    'onScroll',
    'filtrar',
    'toggle-filtros',
    'guardar-fila',
    'guardar-fila-nueva',
    'update:selected',
    'fila-modificada',
    'cancelar-editar',
    'cancelar-consultar'
  ],
  setup(props, { emit }) {
    /************
     * Variables
     ************/
    // const grid = ref(false)
    const inFullscreen = ref(false)
    const fila = ref()
    const posicionFilaEditada = ref()
    const listado = ref()
    const refEditarModal = ref()
    const filter = ref()
    const selected = ref([])
    const visibleColumns = ref(getVisibleColumns(props.configuracionColumnas))
    const refTable = ref()
    const archivos = ref([])
    const accion = ref()

    /************
     * Observers
     ************/
    watchEffect(() => (listado.value = props.datos))
    /* watchEffect(() => {
      // const total = props.datos.length; // Cantidad total de elementos
      

      console.log(listado.value)
      
      listado.value = props.datos.map((item, index) => ({
        ...listado.value[index],
        table_index: index // Asigna un índice numérico a cada elemento
      }));
      console.log(listado.value)
    }) */

    const seleccionar = () => {
      emit('selected', selected.value)
      // emit('update:selected', selected.value);
    }

    // medico pendiente xq le da problema a mile al seleccionar
    if (props.emitirAlSeleccionar) {
      watch(selected, () => {
        console.log(selected.value)
        emit('selected', selected.value)
      })
    }

    /*const emitSelectedChange = () => {
      emit('update:selected', selected.value);
    };*/

    const visibleModalVisorArchivos = new VisibleModal()

    /************
     * Funciones
     ************/
    // Acciones tabla
    const consultar = (data: object) => emit('consultar', data)

    const abrirModalNuevoRegistro = (data: any) => {
      fila.value = data.entidad
      accion.value = acciones.nuevo
      refEditarModal.value.abrir()
    }

    const editar = (data: any) => {
      emit('editar', data)

      if (props.permitirEditarModal) {
        fila.value = data.entidad
        posicionFilaEditada.value = data.posicion
        accion.value = acciones.editar
        refEditarModal.value.abrir()
      }
    }

    const consultarEnModal = (data: any) => {
      fila.value = data.entidad
      // accion.value = acciones.nuevo
      refEditarModal.value.abrir({ accion: acciones.consultar })
    }

    // AQUI ME QUEDE
    const cancelar = () => {
      console.log(fila.value)
      if (fila.value.id) emit('cancelar-consultar')
      else emit('cancelar-editar', getIndex(fila.value))
    }

    const eliminar = (data: object) => {
      //  console.log('evento de eliminar: ', data)
      emit('eliminar', data)
    }

    function abrirModalEntidad(entidad, posicion) {
      fila.value = entidad
      posicionFilaEditada.value = posicion
      refEditarModal.value.abrir()
    }

    function abrirModalEditar(data: ParamsType) {
      if (props.entidad) {
        const filaVacia: EntidadAuditable = new props.entidad()
        if (data) filaVacia.hydrate(data)
        fila.value = filaVacia
        // console.log(fila.value)
        // posicionFilaEditada.value = listado.value.length
        refEditarModal.value.abrir()
      } else {
        console.log('Debe pasar un objeto Instanciable a la tabla')
      }
    }

    const verVisorArchivos = ({ posicion }) => {
      archivos.value = listado.value[posicion].archivos
      visibleModalVisorArchivos.abrir()
    }

    function previsualizarPdf() {
      // printTable.abrir()
    }

    function limpiarFila() {
      fila.value = null
    }

    const getIndex = data => {
      if (data.table_index)
        return listado.value.findIndex(
          (fila: any) => fila.table_index === data.table_index
        )
      else if (data.id)
        return props.datos.findIndex((fila: any) => fila.id === data.id)
      else return posicionFilaEditada.value
    }

    function guardarNuevaFila(data) {
      if (props.editarFilaLocal) listado.value.unshift(data)
      emit('guardar-fila-nueva', data)
      limpiarFila()
    }

    function guardarCambiosFila(data) {
      const posicion = getIndex(data)
      console.log(posicion, data)
      console.log(props.editarFilaLocal)
      console.log(posicionFilaEditada.value)

      const dataAnterior = listado.value[posicion]
      const dataNueva = { ...dataAnterior, ...data }

      console.log(dataNueva)
      if (props.editarFilaLocal) listado.value[posicion] = dataNueva
      emit('guardar-fila', data)
      limpiarFila()
    }

    const rows = computed(() => listado.value?.length - 1 ?? 0)

    const loading = ref(false)

    function onScroll({ to }) {
      if (!loading.value && to === rows.value) {
        loading.value = true

        setTimeout(() => {
          nextTick(() => {
            loading.value = false
            emit('onScroll')
          })
        }, 500)
      }
    }

    function extraerVisible(
      accion: CustomActionTable,
      propsTable: any
    ): boolean {
      if (accion && accion.visible && accion.hasOwnProperty('visible')) {
        return accion.visible({
          entidad: propsTable.row,
          posicion: propsTable.rowIndex
        })
      } else {
        return accion !== undefined ?? false
      }
    }

    function extraerDisable(
      accion: CustomActionTable,
      propsTable: any
    ): boolean {
      if (accion && accion.disable && accion.hasOwnProperty('disable')) {
        return accion.disable({
          entidad: propsTable.row,
          posicion: propsTable.rowIndex
        })
      } else {
        return accion !== undefined ?? false
      }
    }

    function extraerIcono(accion: CustomActionTable, propsTable: any) {
      return typeof accion?.icono === 'function'
        ? accion.icono({
            entidad: propsTable.row,
            posicion: propsTable.rowIndex
          })
        : accion?.icono
    }

    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: props.altoFijo ? 30 : 0
    })

    const pagesNumber = computed(() => {
      return Math.ceil(listado.value.length / pagination.value.rowsPerPage)
    })

    function resaltar(valor: string) {
      const tiposTrabajos = ['EMERGENCIA'] //, 'ASISTENCIA NODO CLIENTE', 'ASISTENCIA NODO NEDETEL']
      return tiposTrabajos.includes(valor)
    }

    const mostrarFiltros = ref(false)
    const tituloBotonFiltros = computed(() =>
      mostrarFiltros.value ? 'Ocultar filtros' : 'Mostrar filtros'
    )

    function filtrar() {
      console.log('consultar cien')
      console.log(filtros.value)

      refTableFilters.value.filtrar()

      // emit('filtrar', filtros.value)
    }

    const filtros = ref()

    function establecerFiltros(uri: string) {
      emit('filtrar', uri)
    }

    const refTableFilters = ref()

    function resetearFiltros() {
      refTableFilters.value.resetearFiltros()
    }

    function agregarFiltro() {
      refTableFilters.value.agregarFiltro()
    }

    function toggleFiltros() {
      mostrarFiltros.value = !mostrarFiltros.value
      listado.value = []
      emit('toggle-filtros', mostrarFiltros.value)
    }

    /**
     * No modificar esta función jamás en la vida.
     * Maricón el que modifique `exportTable`
     */
    function exportTable() {
      // naive encoding to csv format
      const content = [
        props.configuracionColumnas.map((col: any) => wrapCsvValue(col.label))
      ]
        .concat(
          props.datos.map((row: any) =>
            props.configuracionColumnas
              .map((col: any) =>
                wrapCsvValue(
                  typeof col.field === 'function'
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format,
                  row
                )
              )
              .join(',')
          )
        )
        .join('\r\n')

      const status = exportFile('table-export.csv', content, 'text/csv')

      if (status !== true) {
        /*$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning'
        })*/
        console.log('No se puede descargar...')
      }
    }

    function wrapCsvValue(val, formatFn?, row?) {
      let formatted = formatFn !== void 0 ? formatFn(val, row) : val

      formatted =
        formatted === void 0 || formatted === null ? '' : String(formatted)

      formatted = formatted.split('"').join('""')
      /**
       * Excel accepts \n and \r in strings, but some other CSV parsers do not
       * Uncomment the next two lines to escape new lines
       */
      // .split('\n').join('\\n')
      // .split('\r').join('\\r')

      return `"${formatted}"`
    }

    function extraerColor(accion: CustomActionTable, propsTable: any) {
      return typeof accion?.color === 'function'
        ? accion.color({
            entidad: propsTable.row,
            posicion: propsTable.rowIndex
          })
        : accion?.color
    }

    function guardarCeldaEditada(fila) {
      emit('fila-modificada', fila)
    }

    function clearSelection() {
      refTable.value.clearSelection()
    }

    return {
      refTable,
      refEditarModal,
      refTableFilters,
      resetearFiltros,
      agregarFiltro,
      establecerFiltros,
      filtrar,
      // grid,
      inFullscreen,
      editar,
      consultarEnModal,
      consultar,
      eliminar,
      filter,
      selected,
      visibleColumns,
      seleccionar,
      previsualizarPdf,
      fila,
      limpiarFila,
      guardarCambiosFila,
      guardarNuevaFila,
      listado,
      accionesActivos,
      autorizacionesTransacciones,
      estadosTransacciones,
      estadosInventarios,
      estadosCondicionesId,
      estadosCondicionesValue,
      estadosControlStock,
      //estados compras y proveedores
      estadosCalificacionProveedor,
      onScroll,
      loading,
      offset,
      extraerVisible,
      extraerIcono,
      pagesNumber,
      pagination,
      formatBytes,
      resaltar,
      mostrarFiltros,
      tituloBotonFiltros,
      abrirModalEntidad,
      abrirModalEditar,
      exportTable,
      toggleFiltros,
      extraerColor,
      guardarCeldaEditada,
      clearSelection,
      verVisorArchivos,
      archivos,
      visibleModalVisorArchivos,
      emitirFila: (accion, rowIndex: number) =>
        accion(listado.value[rowIndex], rowIndex),
      cancelar,
      abrirModalNuevoRegistro,
      accion,
      extraerDisable
    }
  }
})
