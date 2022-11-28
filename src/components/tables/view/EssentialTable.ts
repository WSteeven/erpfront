// Dependencias
import { accionesActivos, autorizacionesTransacciones, estadosTransacciones, estadosInventarios, estadosControlStock } from 'config/utils'
import { EstadoPrevisualizarTablaPDF } from '../application/EstadoPrevisualizarTablaPDF'
import { computed, defineComponent, ref, watchEffect, nextTick, reactive } from 'vue'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Instanciable } from 'shared/entidad/domain/instanciable'
import { CustomActionTable } from '../domain/CustomActionTable'
import { TipoSeleccion, estadosSubtareas } from 'config/utils'
import { ColumnConfig } from '../domain/ColumnConfig'
import { getVisibleColumns } from 'shared/utils'
import { exportFile, useQuasar } from 'quasar'
import { offset } from 'config/utils_tablas'

// Componentes
import PrevisualizarTablaPdf from 'components/tables/view/PrevisualizarTablaPdf.vue'
import EditarTablaModal from './EditarTablaModal.vue'
import CustomButtons from './CustomButtonsTable.vue'

export default defineComponent({
  components: {
    PrevisualizarTablaPdf,
    EditarTablaModal,
    CustomButtons,
  },
  props: {
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
  emits: ['consultar', 'editar', 'eliminar', 'accion1', 'accion2', 'accion3', 'accion4', 'accion5', 'selected', 'onScroll'],
  setup(props, { emit }) {
    const grid = ref(false)
    const inFullscreen = ref(false)
    const fila = props.entidad ? ref(new props.entidad()) : null
    const listado = ref()

    watchEffect(() => {
      listado.value = props.datos
    })

    // Acciones tabla
    const consultar = (data: object) => emit('consultar', data)
    const editar = (data: any) => {
      const { entidad, posicion } = data

      emit('editar', data)

      if (props.permitirEditarModal && props.entidad) {
        fila.value = reactive(new props.entidad())
        fila.value.hydrate(entidad)
        posicionFila.value = posicion
        abrirModal()
        console.log('..abriendo modal')
      }
    }
    const eliminar = (data: object) => emit('eliminar', data)

    // Variables
    const filter = ref(null)
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
      if (props.entidad) fila.value.hydrate(new props.entidad())
    }

    const posicionFila = ref()

    function guardarFila(data) {
      fila.value.hydrate(data)
      listado.value.splice(posicionFila.value, 1, fila.value)
      cerrarModa()
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

    const abierto = ref(false)

    function abrirModal() {
      abierto.value = true
    }

    function cerrarModa() {
      abierto.value = false
    }

    /*function abrir() {
      
    }*/

    return {
      abierto,
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
      estadosControlStock,
      estadosSubtareas,
      onScroll,
      loading,
      offset,
      altoFijo: props.altoFijo,
      abrirModal,
    }
  },
})