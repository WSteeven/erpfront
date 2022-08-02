<!-- preventDefaultOnContextMenu="true" -->
<!-- :tab-to-next-cell="tabToNextCell" -->
<!-- :on-cell-context-menu="mostrarContextMenu" -->
<!-- :suppress-keyboard-event="suppressKeyboardEvent" -->
<!-- v-on="$attrs" -->
<!-- v-bind="$attrs" -->
<template>
  <!-- {{ elem }} -->
  <ag-grid-vue
    :column-defs="columnas"
    :row-data="elementos"
    :get-context-menu-items="mostrarContextMenu"
    :grid-options="gridOptions"
    :locale-text="idioma"
    :row-drag-managed="true"
    :stop-editing-when-cells-loses-focus="true"
    :style="estilosComputed"
    :navigate-to-next-cell="navigateToNextCell"
    class="ag-theme-alpine"
    @grid-ready="onGridReady"
  ></ag-grid-vue>
</template>

<script lang="ts">
import RenderCheck from "@componentes/tablas/componentes/render/renderCheck.vue"
import "ag-grid-enterprise"
import {computed, defineComponent, reactive, ref, UnwrapRef} from "vue"
import {
  SuppressKeyboardEventParams,
  GridOptions,
  NavigateToNextCellParams,
} from "ag-grid-community"
import {AgGridVue} from "ag-grid-vue3"
import {mapearConfiguracion} from "./configuraciones"
import {
  idioma,
  numberKeyMap,
  keyMap,
  tipoSeleccion,
} from "@config/aggrid.config"
import {ConfigTabla} from "./types"
// import {registrarRenders} from "./componentes/render"
import {registrarEditors} from "./componentes/editor"

export default defineComponent({
  props: {
    selectionType: {
      type: String,
      default: tipoSeleccion.NINGUNA,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    configuracion: {
      type: Object as () => ConfigTabla<any>,
      required: true,
    },
    elementos: {
      type: Array,
      required: true,
    },
    estilos: {
      type: Object,
      default: () => {
        return {
          width: "auto",
          height: "75%",
        }
      },
    },
    opcionesMenu: Array,
    eventArgs: {
      type: Object,
      required: false,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      default: () => {},
    },
  },
  // eslint-disable-next-line vue/no-unused-components
  components: {AgGridVue, renderCheck: RenderCheck},
  emits: [
    "double-click",
    "selected-items",
    "cell-editing-stopped",
    "siguientePaginacion",
    "enter-cell",
  ],
  setup(props, {emit}) {
    let ejecutarConsulta = true
    let gridApi: UnwrapRef<any> = null
    // let columnApi = ref(null)

    // init
    const onGridReady = (params: any) => {
      gridApi = params.api
      // columnApi = params.columnApi
    }

    // registrarRenders()
    registrarEditors()

    const gridOptions: GridOptions = reactive({
      rowSelection: props.selectionType,
      singleClickEdit: true,
      onRowDoubleClicked,
      onSelectionChanged,
      onCellEditingStopped,
      onBodyScroll,
      // context: {configuraciones: props.configuracion.configuracion_columnas},
    })

    function onRowDoubleClicked() {
      emit("double-click", gridApi.getSelectedRows())
    }

    function onSelectionChanged() {
      emit("selected-items", gridApi.getSelectedRows())
    }

    function onCellEditingStopped() {
      emit("cell-editing-stopped", gridApi.getSelectedRows())
    }

    function onBodyScroll() {
      const indiceVisible = gridApi.getLastDisplayedRow()
      if (
        indiceVisible === props.elementos.length - 1 &&
        props.elementos.length >= 100
      ) {
        if (ejecutarConsulta) {
          emit("siguientePaginacion")
          ejecutarConsulta = false
        }
      } else if (indiceVisible < props.elementos.length - 20) {
        ejecutarConsulta = true
      }
    }

    const {columnas} = mapearConfiguracion(props.configuracion, props.eventArgs)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mostrarContextMenu = function (params: any) {
      if (props.configuracion.obtenerMenu && params.node) {
        if (typeof props.configuracion.obtenerMenu === "function") {
          return props.configuracion.obtenerMenu(params)
        } else return props.configuracion.obtenerMenu.obtener(params)
      }
      return []
    }

    function navigateToNextCell(params: NavigateToNextCellParams) {
      const api = obtenerAPI()
      const previousCell = params.previousCellPosition
      const suggestedNextCell = params.nextCellPosition
      const direction = keyMap[params.key]

      switch (direction) {
        case numberKeyMap.KEY_DOWN:
          api.forEachNode(function (node) {
            if (previousCell.rowIndex + 1 === node.rowIndex) {
              node.setSelected(true)
            }
          })
          return suggestedNextCell
        case numberKeyMap.KEY_UP:
          api.forEachNode(function (node) {
            if (previousCell.rowIndex - 1 === node.rowIndex) {
              node.setSelected(true)
            }
          })
          return suggestedNextCell
        case numberKeyMap.KEY_LEFT:
        case numberKeyMap.KEY_RIGHT:
          if (!suggestedNextCell) throw "Next cell void."
          return suggestedNextCell
        default:
          throw "this will never happen, navigation is always one of the 4 keys above"
      }
    }
    function suppressKeyboardEvent(params: SuppressKeyboardEventParams) {
      const key = params.event.keyCode
      if (key === numberKeyMap.ENTER) {
        emit("enter-cell", [params.node.data])
      }
      return false
    }

    const obtenerAPI = () => {
      if (!gridOptions.api) throw new Error("Grid API unloaded.")
      return gridOptions.api
    }
    const obtenerColumnAPI = () => {
      if (!gridOptions.columnApi) throw new Error("Grid API unloaded.")
      return gridOptions.columnApi
    }

    const focusPrimerColumnaTabla = function () {
      const api = obtenerAPI()
      const cols = obtenerColumnAPI().getAllDisplayedColumns()
      const firstCol = cols.find((column) => column.getColDef().editable)
      if (firstCol) {
        api.ensureIndexVisible(0)
        api.ensureColumnVisible(firstCol)
        api.setFocusedCell(0, firstCol)
      }
    }

    const actualizar = function () {
      obtenerAPI().refreshCells({
        force: true,
        suppressFlash: true,
      })
    }

    const focusCelda = function (rowIndex: number, columna: string) {
      obtenerAPI().setFocusedCell(rowIndex, columna)
    }
    const editarCelda = function (rowIndex: number, columna: string) {
      obtenerAPI().setFocusedCell(rowIndex, columna)
      obtenerAPI().startEditingCell({
        rowIndex: rowIndex,
        colKey: columna,
      })
    }

    const filtrarTabla = function (value: any) {
      obtenerAPI().setQuickFilter(value)
    }

    const ocultarColumna = (field: string, hide: boolean) => {
      if (gridOptions.columnApi)
        gridOptions.columnApi.setColumnVisible(field, !hide)
    }

    const obtenerNodosSeleccionados = () => {
      if (gridOptions.api) return gridOptions.api.getSelectedNodes()
      else return []
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const seleccionarObject = (arrayNodes: any, evento: string) => {
      /* context.emit(
        evento,
        props.selectionType === "multiple"
          ? arrayNodes.map((elem: RowNode) => elem.data)
          : arrayNodes.data
          ? arrayNodes.data
          : arrayNodes[0].data
      ) */
    }

    const agregarElementosSeleccionados = () => {
      seleccionarObject(obtenerNodosSeleccionados(), "agregarSeleccionados")
      deseleccionarElementos()
    }

    const quitarElementosSeleccionados = () => {
      seleccionarObject(obtenerNodosSeleccionados(), "quitarSeleccionados")
      deseleccionarElementos()
    }

    const deseleccionarElementos = () => {
      obtenerAPI().clearRangeSelection()
      obtenerAPI().deselectAll()
    }

    const focusFila = (index: number) => {
      const api = obtenerAPI()
      const rowNode = api.getDisplayedRowAtIndex(index)
      if (rowNode) {
        rowNode.setSelected(true, true)
        api.ensureIndexVisible(index)

        const firstCol = gridOptions.columnApi?.getAllDisplayedColumns()[index]
        if (firstCol) {
          api.ensureColumnVisible(firstCol)
          api.setFocusedCell(0, firstCol)
          api.setFocusedCell(0, firstCol)
        }
      }
    }

    let filas = 1
    const expandido = ref(false)
    const estilosComputed = computed(() => {
      if (expandido.value) return {width: "100%", height: `${filas}px`}
      else return props.estilos
    })

    const expandir = () => {
      filas = gridOptions.api ? gridOptions.api.getDisplayedRowCount() + 1 : 2
      filas = 28 * filas + 18
      expandido.value = true
    }

    return {
      gridOptions,
      // modules,
      columnas,
      idioma,
      estilosComputed,
      // listeners
      mostrarContextMenu,
      // tabToNextCell,
      navigateToNextCell,
      suppressKeyboardEvent,
      // comportamiento
      focusPrimerColumnaTabla,
      actualizar,
      focusCelda,
      editarCelda,
      filtrarTabla,
      ocultarColumna,
      deseleccionarElementos,
      focusFila,
      expandir,
      // componente listado doble
      agregarElementosSeleccionados,
      quitarElementosSeleccionados,
      // mios
      onGridReady,
    }
  },
})
</script>
