// Dependencias
import { accionesActivos, autorizacionesTransacciones, estadosTransacciones, estadosInventarios, estadosControlStock, estadosCondicionesId, estadosCondicionesValue } from 'config/utils'
import { estadosCalificacionProveedor } from 'config/utils_compras_proveedores'
import { EstadoPrevisualizarTablaPDF } from '../application/EstadoPrevisualizarTablaPDF'
import { computed, defineComponent, ref, watchEffect, nextTick, Ref, watch } from 'vue'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Instanciable } from 'shared/entidad/domain/instanciable'
import { CustomActionTable } from '../domain/CustomActionTable'
import { getVisibleColumns, formatBytes } from 'shared/utils'
import { ColumnConfig } from '../domain/ColumnConfig'
import { TipoSeleccion } from 'config/utils'
import { offset } from 'config/utils_tablas'
import { exportFile } from 'quasar'

// Componentes
import PrevisualizarTablaPdf from 'components/tables/view/PrevisualizarTablaPdf.vue'
import TableFilters from 'components/tables/view/TableFilters.vue'
import BotonesPaginacion from './BotonesPaginacion.vue'
import EditarTablaModal from './EditarTablaModal.vue'
import EstadosSubtareas from './EstadosSubtareas.vue'
import CustomButtons from './CustomButtonsTable.vue'
import { ParamsType } from 'config/types'

export default defineComponent({
  components: {
    PrevisualizarTablaPdf,
    EditarTablaModal,
    CustomButtons,
    EstadosSubtareas,
    BotonesPaginacion,
    TableFilters,
  },
  props: {
    referencia: Object as () => Ref,
    entidad: {
      type: Object as Instanciable,
      required: false,
    },
    titulo: {
      type: String,
      default: 'Listado',
    },
    separador: {
      type: String,
      default: 'horizontal',
    },
    configuracionColumnas: {
      type: Object as () => ColumnConfig<EntidadAuditable>[],
      required: true,
    },
    datos: {
      type: Array,
      required: true,
    },
    permitirEditarCeldas: {
      type: Boolean,
      default: false,
    },
    permitirConsultar: {
      type: Boolean,
      default: true,
    },
    permitirEditar: {
      type: Boolean,
      default: true,
    },
    permitirEliminar: {
      type: Boolean,
      default: true,
    },
    primeraColumnaFija: {
      type: Boolean,
      default: false,
    },
    tipoSeleccion: {
      type: String as () => TipoSeleccion,
      default: 'none',
    },
    ajustarCeldas: {
      type: Boolean,
      default: false,
    },
    accion1: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion2: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion3: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion4: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion5: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion6: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion7: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion8: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion9: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion10: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion1Header: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion2Header: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion3Header: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion4Header: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion5Header: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    accion6Header: {
      type: Object as () => CustomActionTable,
      required: false,
    },
    mostrarBotones: {
      type: Boolean,
      default: true,
    },
    altoFijo: {
      type: Boolean,
      default: true,
    },
    mostrarHeader: {
      type: Boolean,
      default: true,
    },
    mostrarCantidadElementos: {
      type: Boolean,
      default: true,
    },
    mostrarFooter: {
      type: Boolean,
      default: true,
    },
    permitirEditarModal: {
      type: Boolean,
      default: false,
    },
    modalMaximized: {
      type: Boolean,
      default: true,
    },
    permitirBuscar: {
      type: Boolean,
      default: true,
    },
    permitirFiltrar: {
      type: Boolean,
      default: false,
    },
    estilos: {
      type: String,
      required: false,
    },
    mostrarColumnasVisibles: {
      type: Boolean,
      default: true,
    },
    editarFilaLocal: {
      type: Boolean,
      default: true,
    },
    mostrarExportar: {
      type: Boolean,
      default: false,
    },
    grid: {
      type: Boolean,
      default: true,
    },
    disable: {
      type: Boolean,
      default: false,
    }
  },
  emits: ['consultar', 'editar', 'eliminar', 'accion1', 'accion2', 'accion3', 'accion4', 'accion5', 'accion6', 'accion7', 'accion8', 'accion9', 'accion10', 'selected', 'onScroll', 'filtrar', 'toggle-filtros', 'guardar-fila', 'update:selected', 'fila-modificada'],
  setup(props, { emit }) {
    // const grid = ref(false)
    const inFullscreen = ref(false)
    const fila = ref()
    const posicionFilaEditada = ref()
    const listado = ref()
    const refEditarModal = ref()

    watchEffect(() => listado.value = props.datos)

    // Acciones tabla
    const consultar = (data: object) => emit('consultar', data)
    const editar = (data: any) => {
      // const { entidad, posicion } = data

      emit('editar', data)

      if (props.permitirEditarModal) {
        console.log(fila.value)
        fila.value = data.entidad
        console.log(fila.value)
        posicionFilaEditada.value = data.posicion
        // console.log(posicionFilaEditada.value)
        refEditarModal.value.abrir()
      }
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
        posicionFilaEditada.value = listado.value.length
        refEditarModal.value.abrir()
      } else {
        console.log('Debe pasar un objeto Instanciable a la tabla')
      }
    }

    // Variables
    const filter = ref()
    const selected = ref([])
    const visibleColumns = ref(getVisibleColumns(props.configuracionColumnas))
    const refTable = ref()

    // Observers
    const seleccionar = () => {
      emit('selected', selected.value)
      // emit('update:selected', selected.value);
    }

    // medico pendiente xq le da problema a mile al seleccionar
    /*watch(selected, () => {
      console.log(selected.value)
      emit('selected', selected.value)
    }) */

    /*const emitSelectedChange = () => {
      emit('update:selected', selected.value);
    };*/

    const printTable = new EstadoPrevisualizarTablaPDF()

    function previsualizarPdf() {
      printTable.abrirVistaPrevia()
    }

    function limpiarFila() {
      fila.value = null
    }

    function guardarFila(data) {
      // console.log(data)
      const posicion = props.datos.findIndex(
        (fila: any) => fila.id === data.id
      )
      // console.log(posicion)

      if (props.editarFilaLocal) listado.value[posicion] = data
      limpiarFila()
      emit('guardar-fila', data)
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

    function extraerVisible(accion: CustomActionTable, propsTable: any): boolean {
      if (accion && accion.visible && accion.hasOwnProperty('visible')) {
        return accion.visible({
          entidad: propsTable.row,
          posicion: propsTable.rowIndex,
        })
      } else {
        return accion !== undefined ?? false
      }
    }

    function extraerIcono(accion: CustomActionTable, propsTable: any) {
      return typeof accion?.icono === 'function'
        ? accion.icono({
          entidad: propsTable.row,
          posicion: propsTable.rowIndex,
        }) : accion?.icono
    }

    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: props.altoFijo ? 15 : 0,
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
      mostrarFiltros.value ? "Ocultar filtros" : "Mostrar filtros"
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

    // exportar CSV
    function exportTable() {
      // naive encoding to csv format
      const content = [props.configuracionColumnas.map((col: any) => wrapCsvValue(col.label))].concat(
        props.datos.map((row: any) => props.configuracionColumnas.map((col: any) => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format,
          row
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'table-export.csv',
        content,
        'text/csv'
      )

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
      let formatted = formatFn !== void 0
        ? formatFn(val, row)
        : val

      formatted = formatted === void 0 || formatted === null
        ? ''
        : String(formatted)

      formatted = formatted.split('"').join('""')
      /**
       * Excel accepts \n and \r in strings, but some other CSV parsers do not
       * Uncomment the next two lines to escape new lines
       */
      // .split('\n').join('\\n')
      // .split('\r').join('\\r')

      return `"${formatted}"`
    }

    function extraerColor(accion?: CustomActionTable) {
      return typeof accion?.color === 'function'
        ? accion.color()
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
      consultar,
      eliminar,
      filter,
      selected,
      visibleColumns,
      seleccionar,
      previsualizarPdf,
      printTable,
      fila,
      limpiarFila,
      guardarFila,
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
    }
  },
})
