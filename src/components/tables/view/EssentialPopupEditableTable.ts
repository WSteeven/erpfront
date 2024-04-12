// Dependencias
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { computed, defineComponent, nextTick, ref, watchEffect } from 'vue'
import { ColumnConfig } from '../domain/ColumnConfig'
import { getVisibleColumns, formatBytes } from 'shared/utils'
import { TipoSeleccion, TipoSeparador } from 'config/utils'
import { offset } from 'config/utils_tablas'
import { CustomActionTable } from '../domain/CustomActionTable'
import exportFile from 'quasar/src/utils/export-file.js'

// Componentes
import CustomButtons from './CustomButtonsTable.vue'
import BotonesPaginacion from './BotonesPaginacion.vue'
import EditarTablaModal from './EditarTablaModal.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import TableFilters from './TableFilters2.vue'

export default defineComponent({
  components: { CustomButtons, BotonesPaginacion, EditarTablaModal, SelectorImagen, TableFilters },
  props: {
    configuracionColumnas: {
      type: Object as () => ColumnConfig<EntidadAuditable>[],
      required: true,
    },
    datos: {
      type: Array,
      required: true,
    },
    titulo: {
      type: String,
      default: 'Listado',
    },
    separador: {
      type: String as () => TipoSeparador,
      default: 'horizontal',
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
    permitirBuscar: {
      type: Boolean,
      default: true,
    },
    mostrarCantidadElementos: {
      type: Boolean,
      default: true,
    },
    mostrarColumnasVisibles: {
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
    altoFijo: {
      type: Boolean,
      default: true,
    },
    mostrarHeader: {
      type: Boolean,
      default: true,
    },
    mostrarFooter: {
      type: Boolean,
      default: true,
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
    mostrarExportar: {
      type: Boolean,
      default: false,
    },
    tipoSeleccion: {
      type: String as () => TipoSeleccion,
      default: 'none',
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
    permitirEditarCeldas: {
      type: Boolean,
      default: true,
    },
    editarFilaLocal: {
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
    grid: {
      type: Boolean,
      default: true,
    },

  },
  emits: [
    'selected',
    'toggle-filtros',
    'filtrar',
    'consultar',
    'editar',
    'eliminar',
    'fila-modificada',
    'onScroll',
    'guardar-fila',
  ],
  setup(props, { emit }) {
    const referencia = ref()
    const listado = ref()
    const filter = ref()
    const filtros = ref()
    const refEditarModal = ref()
    const fila = ref()
    const posicionFilaEditada = ref()
    const refTableFilters = ref()
    const inFullscreen = ref(false)
    const mostrarFiltros = ref(false)
    const visibleColumns = ref(getVisibleColumns(props.configuracionColumnas))
    const selected = ref([])
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: props.altoFijo ? 15 : 0,
    })

    watchEffect(() => listado.value = props.datos)

    const rows = computed(() => listado.value.length - 1 ?? 0)
    const pagesNumber = computed(() => {
      return Math.ceil(listado.value.length / pagination.value.rowsPerPage)
    })

    const loading = ref(false)

    //Observers
    const seleccionar = () => emit('selected', selected.value)
    const tituloBotonFiltros = computed(() =>
      mostrarFiltros.value ? 'Ocultar filtros' : 'Mostrar filtros'
    )

    // Acciones tabla
    const consultar = (data: object) => emit('consultar', data)
    const editar = (data: any) => {
      emit('editar', data)

      if (props.permitirEditarModal) {
        fila.value = data.entidad
        posicionFilaEditada.value = data.posicion
        refEditarModal.value.abrir()
      }
    }
    const eliminar = (data: object) => emit('eliminar', data)

    //Funciones
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

    function guardarCeldaEditada(fila) {
      emit('fila-modificada', fila)
    }
    function extraerVisible(
      accion: CustomActionTable,
      propsTable: any
    ): boolean {
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
        })
        : accion?.icono
    }
    function filtrar() {
      console.log('consultar cien')
      console.log(filtros.value)

      refTableFilters.value.filtrar()
    }
    function agregarFiltro() {
      refTableFilters.value.agregarFiltro()
    }
    function establecerFiltros(uri: string) {
      emit('filtrar', uri)
    }
    function toggleFiltros() {
      mostrarFiltros.value = !mostrarFiltros.value
      listado.value = []
      emit('toggle-filtros', mostrarFiltros.value)
    }

    // exportar CSV
    function exportTable() {
      // naive encoding to csv format
      const content = [
        props.configuracionColumnas.map((col: any) => wrapCsvValue(col.label)),
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

    return {
      refEditarModal,
      referencia,
      refTableFilters,
      filter,
      visibleColumns,
      selected,
      inFullscreen,
      mostrarFiltros,
      offset,
      pagesNumber,
      pagination,
      seleccionar,
      extraerVisible,
      extraerIcono,
      filtrar,
      agregarFiltro,
      toggleFiltros,
      listado,
      exportTable,
      tituloBotonFiltros,
      establecerFiltros,
      formatBytes,
      consultar,
      editar,
      eliminar,
      guardarCeldaEditada,
      fila,
      guardarFila,
      limpiarFila,
      onScroll,
    }
  },
})
