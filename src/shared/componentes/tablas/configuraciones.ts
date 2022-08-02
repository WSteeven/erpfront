/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ColDef,
  EditableCallbackParams,
  ValueGetterParams,
} from "ag-grid-community"
import moment from "moment"
import {
  AlignColumn,
  ArgumentosCambioCelda,
  ArgumentosComponente,
  ColumnConfig,
  ConfigColumnaTabla,
  ConfigTabla,
  ConfiguracionColumnasTabla,
  TypeColumn,
} from "./types"

function evaluarCellRender<T, L>(
  configuracion: ConfigColumnaTabla<T, L> | undefined
) {
  return configuracion ? configuracion.customRender : undefined
}

/**
 * Filtro personalizado para celdas de tipo date
 */
function evaluarFilterParams<T>({type}: ColumnConfig<T>) {
  if (type === "date") {
    return function () {
      return {
        comparator: (filtro: string, target: string) => {
          const fechaFiltro = moment(filtro)
          const value = moment(target)
          if (fechaFiltro.isSame(value)) return 0
          if (value.isBefore(fechaFiltro)) return -1
          if (value.isAfter(fechaFiltro)) return 1
        },
        browserDatePicker: true,
      }
    }
  }
  return null
}

/**
 * Componentes de edicion para cada tipo de field
 */
const DEFAULT_EDITOR_FRAMEWORK = null
const editorFramework: {[Key in TypeColumn]: string | null} = {
  date: "dateCell",
  decimal: "numericCell",
  integer: "numericCell",
  select: "selectCell",
  text: DEFAULT_EDITOR_FRAMEWORK,
  boolean: "renderCheck",
}

function evaluarEditorFramework<T>({type}: ColumnConfig<T>) {
  return editorFramework[type]
    ? editorFramework[type]
    : DEFAULT_EDITOR_FRAMEWORK
}

/**
 * Componentes de visualizacion para cada tipo de field
 */
const DEFAULT_RENDER_FRAMEWORK = null
const renderFramework: {[Key in TypeColumn]: string | null} = {
  date: "renderDate",
  decimal: "renderNumeric",
  integer: "renderNumeric",
  select: "renderSelect",
  text: DEFAULT_RENDER_FRAMEWORK,
  boolean: "renderCheck",
}

function evaluarRenderFramework<T>({type}: ColumnConfig<T>) {
  return renderFramework[type]
    ? renderFramework[type]
    : DEFAULT_RENDER_FRAMEWORK
}

/**
 * devuelve el value segun el formato configurado
 */
function evaluarGetter<T, L>(
  params: ValueGetterParams,
  configuracion: ConfigColumnaTabla<T, L> | undefined
) {
  if (configuracion && configuracion.formato)
    return configuracion.formato(params)
  return params.colDef.field ? params.data[params.colDef.field] : ""
}

/**
 * devuelve los estilos para la celda a renderizar
 */
function evaluarClass<T>(columna: ColumnConfig<T>) {
  return [
    evaluarAlineacion(columna.align),
    !columna.editable ? "bg-disabled" : "",
  ]
}

/**
 * alineacion de cada celda
 */
const ALINEACION_DEFECTO = ""
const alineacionCeldas: {[Key in AlignColumn]: string} = {
  center: "text-center",
  right: "text-right",
  left: "text-left",
}

function evaluarAlineacion(alineacion: AlignColumn | undefined) {
  return alineacion ? alineacionCeldas[alineacion] : ALINEACION_DEFECTO
}

/**
 * devuelve los filtros por el tipo de dato en celda
 */
const DEFAULT_FILTER = "agTextColumnFilter"
const filtrosCelda: {[Key in TypeColumn]: string} = {
  date: "agDateColumnFilter",
  decimal: "agNumberColumnFilter",
  integer: "agNumberColumnFilter",
  select: DEFAULT_FILTER,
  text: DEFAULT_FILTER,
  boolean: "agSetColumnFilter",
}

function evaluarFilter<T>({type}: ColumnConfig<T>) {
  return filtrosCelda[type] ? filtrosCelda[type] : DEFAULT_FILTER
}

function evaluarEditable<T, L>(
  {editable}: ColumnConfig<T>,
  config: ConfiguracionColumnasTabla<T, L>[keyof T],
  params: EditableCallbackParams
) {
  const inhabilitados: boolean[] = []
  if (config?.configuracionFecha?.disabled) {
    const result = config?.configuracionFecha?.disabled(
      params as ArgumentosComponente<T, L>
    )
    inhabilitados.push(result)
  }
  if (config?.configuracionCheck?.disabled) {
    const result = config?.configuracionCheck?.disabled(
      params as ArgumentosComponente<T, L>
    )
    inhabilitados.push(result)
  }
  if (config?.configuracionListado?.disabled) {
    const result = config?.configuracionListado?.disabled(
      params as ArgumentosComponente<T, L>
    )
    inhabilitados.push(result)
  }

  return editable && inhabilitados.every((elem) => !elem)
}

function getCurrentConfig<T>(
  params: ArgumentosCambioCelda<T>
): ConfigColumnaTabla<T> {
  return params.colDef.field
    ? params.context.configuraciones
      ? params.context.configuraciones[params.colDef.field] || {}
      : {}
    : {}
}

function editarCelda<T>(params: ArgumentosCambioCelda<T>, eventArgs: any) {
  const configuracion: ConfigColumnaTabla<any> = getCurrentConfig(params)

  if (configuracion.editarValor) {
    configuracion.editarValor(params, eventArgs)
  }
}

function crearColumnas<T, L>(config: ConfigTabla<T>, eventArgs: any) {
  const configuraciones: ConfiguracionColumnasTabla<T, L> =
    config.configuracion_columnas || {}

  const colDefs: ColDef[] = []

  // Columna para mover fila
  colDefs.push({
    headerName: "",
    headerClass: "cell-header-center",
    cellClass: "text-center cell-block",
    cellRenderer: "agGroupCellRenderer",
    field: "",
    maxWidth: 40,
    editable: false,
    rowDrag: true,
    headerTooltip: "Mover fila",
    sortable: false,
  })

  // Columnas para datos
  for (const columna of config.columnas) {
    let configuracion = configuraciones[columna.field]
    if (configuracion === undefined) {
      configuracion = new ConfigColumnaTabla<T, L>()
    }

    const def: ColDef = {
      headerName: columna.label,
      field: columna.field.toString(),
      editable: (params) => evaluarEditable(columna, configuracion, params),
      hide: columna.hide,
      aggFunc: columna.operation || null,
      width: columna.width || 100,
      menuTabs: ["filterMenuTab", "columnsMenuTab"],
      headerTooltip: undefined,
      filter: evaluarFilter(columna),
      flex: 1,
      resizable: true,
      valueGetter: (params) => evaluarGetter<T, L>(params, configuracion),
      filterParams: evaluarFilterParams(columna),
      cellClass: evaluarClass(columna),
      cellStyle: columna.cellStyle,
      sortable: columna.sortable || columna.sortable === undefined,
      /* onCellValueChanged: (event: ArgumentosCambioCelda<T>) =>
        editarCelda(event, eventArgs), */
    }
    const cellRender = evaluarCellRender(configuracion)
    if (cellRender) def.cellRenderer = cellRender

    if (!cellRender) {
      // renders custom
      def.cellEditorFramework = evaluarEditorFramework(columna)
      def.cellRendererFramework = evaluarRenderFramework(columna)
      // argumentos
      def.cellEditorParams = {
        params: {
          columna,
          config: configuracion,
        },
      }
      def.cellRendererParams = {
        params: {
          columna,
          config: configuracion,
        },
      }
    }

    if (columna.headerTooltip) def.headerTooltip = columna.headerTooltip

    colDefs.push(def)
  }

  return colDefs
}

export function mapearConfiguracion<T = any, L = any>(
  config: ConfigTabla<T>,
  eventArgs: any
): any {
  const columnas = crearColumnas<T, L>(config, eventArgs)

  return {columnas}
}
