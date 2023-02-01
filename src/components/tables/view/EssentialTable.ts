// Dependencias
import { accionesActivos, autorizacionesTransacciones, estadosTransacciones, estadosInventarios, estadosControlStock, estadosCondicionesId, estadosCondicionesValue } from 'config/utils'
import { EstadoPrevisualizarTablaPDF } from '../application/EstadoPrevisualizarTablaPDF'
import { computed, defineComponent, ref, watchEffect, nextTick, reactive, Ref } from 'vue'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Instanciable } from 'shared/entidad/domain/instanciable'
import { CustomActionTable } from '../domain/CustomActionTable'
import { TipoSeleccion, estadosSubtareas } from 'config/utils'
import { ColumnConfig } from '../domain/ColumnConfig'
import { getVisibleColumns, formatBytes } from 'shared/utils'
import { exportFile, useQuasar } from 'quasar'
import { offset } from 'config/utils_tablas'

// Componentes
import PrevisualizarTablaPdf from 'components/tables/view/PrevisualizarTablaPdf.vue'
import EditarTablaModal from './EditarTablaModal.vue'
import CustomButtons from './CustomButtonsTable.vue'
import EstadosSubtareas from './EstadosSubtareas.vue'
import BotonesPaginacion from './BotonesPaginacion.vue'

export default defineComponent({
  components: {
    PrevisualizarTablaPdf,
    EditarTablaModal,
    CustomButtons,
    EstadosSubtareas,
    BotonesPaginacion,
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
      default: false,
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
  emits: ['consultar', 'editar', 'eliminar', 'accion1', 'accion2', 'accion3', 'accion4', 'accion5', 'accion6', 'accion7', 'selected', 'onScroll'],
  setup(props, { emit }) {
    const grid = ref(false)
    const inFullscreen = ref(false)
    const fila = ref() //props.entidad ? ref(new props.entidad()) : null
    const filaEditada = ref()
    const listado = ref()

    watchEffect(() => listado.value = props.datos)

    // Acciones tabla
    const consultar = (data: object) => emit('consultar', data)
    const editar = (data: any) => {
      const { entidad, posicion } = data

      emit('editar', data)

      /* if (props.permitirEditarModal && props.entidad) {
        fila.value = reactive(new props.entidad())
        fila.value.hydrate(entidad)
        posicionFila.value = posicion
        abrirModal()
        // console.log('..abriendo modal')
      } */
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
    const $q = useQuasar()

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

    function exportTable() {
      // naive encoding to csv format
      const content = [
        props.configuracionColumnas.map((col) => wrapCsvValue(col.label)),
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

      const status = exportFile(
        'table-export.csv',
        '\ufeff' + content,
        'text/csv'
      )

      if (status !== true) {
        $q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning',
        })
      }
    }

    const printTable = new EstadoPrevisualizarTablaPDF()

    function previsualizarPdf() {
      printTable.abrirVistaPrevia()
    }

    function limpiarFila() {
      fila.value = null
    }

    const posicionFila = ref()

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
      rowsPerPage: 12,
    })

    const pagesNumber = computed(() => {
      return Math.ceil(listado.value.length / pagination.value.rowsPerPage)
    })

    function resaltar(valor: string) {
      const tiposTrabajos = ['EMERGENCIA'] //, 'ASISTENCIA NODO CLIENTE', 'ASISTENCIA NODO NEDETEL']
      return tiposTrabajos.includes(valor)
    }

    return {
      grid,
      inFullscreen,
      editar,
      consultar,
      eliminar,
      exportTable,
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
    }
  },
})
