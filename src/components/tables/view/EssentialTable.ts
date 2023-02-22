// Dependencias
import { accionesActivos, autorizacionesTransacciones, estadosTransacciones, estadosInventarios, estadosControlStock, estadosCondicionesId, estadosCondicionesValue } from 'config/utils'
import { EstadoPrevisualizarTablaPDF } from '../application/EstadoPrevisualizarTablaPDF'
import { computed, defineComponent, ref, watchEffect, nextTick, Ref } from 'vue'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Instanciable } from 'shared/entidad/domain/instanciable'
import { CustomActionTable } from '../domain/CustomActionTable'
import { TipoSeleccion, estadosSubtareas } from 'config/utils'
import { ColumnConfig } from '../domain/ColumnConfig'
import { getVisibleColumns, formatBytes } from 'shared/utils'
import { offset } from 'config/utils_tablas'

// Componentes
import PrevisualizarTablaPdf from 'components/tables/view/PrevisualizarTablaPdf.vue'
import EditarTablaModal from './EditarTablaModal.vue'
import CustomButtons from './CustomButtonsTable.vue'
import EstadosSubtareas from './EstadosSubtareas.vue'
import BotonesPaginacion from './BotonesPaginacion.vue'
import TableFilters from 'components/tables/view/TableFilters.vue'

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
      type: Object as () => Instanciable,
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
    estilos: {
      type: String,
      required: false,
    }
  },
  emits: ['consultar', 'editar', 'eliminar', 'accion1', 'accion2', 'accion3', 'accion4', 'accion5', 'accion6', 'accion7', 'accion8', 'selected', 'onScroll', 'filtrarTodos'],
  setup(props, { emit }) {
    const grid = ref(false)
    const inFullscreen = ref(false)
    const fila = ref()
    const filaEditada = ref()
    const listado = ref()

    watchEffect(() => listado.value = props.datos)

    // Acciones tabla
    const consultar = (data: object) => emit('consultar', data)
    const editar = (data: any) => {
      const { entidad, posicion } = data

      emit('editar', data)

      if (props.permitirEditarModal) {
        fila.value = data.entidad
        filaEditada.value = data.posicion
      }
    }
    const eliminar = (data: object) => emit('eliminar', data)

    // Variables
    const filter = ref()
    const selected = ref([])
    const visibleColumns = ref(getVisibleColumns(props.configuracionColumnas))

    // Observers
    const seleccionar = () => {
      emit('selected', selected.value)
    }

    const printTable = new EstadoPrevisualizarTablaPDF()

    function previsualizarPdf() {
      printTable.abrirVistaPrevia()
    }

    function limpiarFila() {
      fila.value = null
    }

    function guardarFila(data) {
      // console.log('data recibida para actualizar', data)
      listado.value.splice(filaEditada.value, 1, data)
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

    function consultarCien() {
      console.log('consultar cien')
    }

    function consultarTodos() {
      console.log('En essential table antes de filtrar todos')
      // filtros.search = busqueda.value === "" ? null : busqueda.value
      // listar({...filtros, ...filtrosBusqueda.value}, false)
      console.log(filtros.value)
      emit('filtrarTodos', filtros.value)
    }

    const filtros = ref()

    function establecerFiltros(filtrosEditados) {
      console.log('Estableciendo filtros')
      console.log(filtrosEditados)
      filtros.value = filtrosEditados
    }

    const refTableFilters = ref()
    function resetearFiltros() {
      refTableFilters.value.resetearFiltros()
    }

    return {
      refTableFilters,
      resetearFiltros,
      establecerFiltros,
      consultarCien,
      consultarTodos,
      grid,
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
      estadosSubtareas,
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
    }
  },
})
