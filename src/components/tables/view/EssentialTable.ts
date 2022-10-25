import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { CustomActionTable } from '../domain/CustomActionTable'
import { ColumnConfig } from '../domain/ColumnConfig'
import { getVisibleColumns } from 'shared/utils'
import { exportFile, useQuasar } from 'quasar'
import { TipoSeleccion } from 'config/utils'
import { computed, defineComponent, ref, watch, watchEffect } from 'vue'
import { EstadoPrevisualizarTablaPDF } from '../application/EstadoPrevisualizarTablaPDF'
import {accionesActivos, autorizacionesTransacciones, estadosTransacciones} from 'config/utils'
// Componentes
import PrevisualizarTablaPdf from 'components/tables/view/PrevisualizarTablaPdf.vue'
import EditarTablaModal from './EditarTablaModal.vue'

export default defineComponent({
  components: {
    PrevisualizarTablaPdf,
    EditarTablaModal,
  },
  props: {
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
    agregarElemento: {
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
    }
  },
  emits: ['consultar', 'editar', 'eliminar', 'accion1', 'accion2', 'selected'],
  setup(props, { emit }) {
    const grid = ref(false)
    const inFullscreen = ref(false)
    const fila = ref()
    const listado = ref()

    watchEffect(() => {
      console.log('HOLA')
      listado.value = props.datos
    })

    // Acciones tabla
    const consultar = (data: object) => emit('consultar', data)
    const editar = (data: any) => {
      emit('editar', data)

      if (props.permitirEditarModal) {
        fila.value = data.entidad
        filaEditada.value = data.posicion
      }
    }
    const eliminar = (data: object) => emit('eliminar', data)
    //const accion1 = (data: object) => emit('accion1', data)

    // Variables
    const filter = ref(null)
    const selected = ref([])
    const visibleColumns = ref(getVisibleColumns(props.configuracionColumnas))

    // Observers
    // watch(selected, () => emit('selected', selected.value))
    const seleccionar = () => emit('selected', selected.value)

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

    const filaEditada = ref()

    function guardarFila(data) {
      listado.value.splice(filaEditada.value, 1, data)
      limpiarFila()
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
      estadosTransacciones
    }
  },
})