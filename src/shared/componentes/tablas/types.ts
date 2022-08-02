import {
  ColDef,
  Column,
  ColumnApi,
  GridApi,
  ICellRendererFunc,
  MenuItemDef,
  RowNode,
  ValueGetterParams,
} from "ag-grid-community"

// Configuracion de la tabla
export class ConfigTabla<T> {
  columnas: ColumnConfig<T>[] = []
  obtenerMenu?:
    | ((
        params: ArgumentosMenu
      ) => (MenuItemDef | ItemMenuTabla<T> | string)[] | void)
    | MenuTabla<T>
  configuracion_columnas?: ConfiguracionColumnasTabla<T>

  constructor(columnas?: ColumnConfig<T>[]) {
    if (columnas) this.columnas = columnas
  }
}

// 1) Columnas
export interface ColumnConfig<T> {
  label: string
  field: keyof T
  editable: boolean
  hide: boolean
  type: TypeColumn
  operation?: string
  width?: number
  align?: AlignColumn
  headerTooltip?: string | null
  cellStyle?: any
  sortable?: boolean
}

export type AlignColumn = "center" | "right" | "left"
export type TypeColumn =
  | "decimal"
  | "integer"
  | "text"
  | "boolean"
  | "select"
  | "date"

// 2) Obtener menu
export interface ArgumentosMenu {
  defaultItems: string[] | undefined
  column: Column
  node: RowNode
  value: any
  api: GridApi | null | undefined
  columnApi: ColumnApi | null | undefined
  context: any
}

export class ItemMenuTabla<T> {
  name: string
  disabled?: boolean
  shortcut?: string
  action?: () => void
  checked?: boolean
  icon?: HTMLElement | string
  subMenu?: (MenuItemDef | string)[] | MenuTabla<T>
  cssClasses?: string[]
  tooltip?: string

  constructor(name: string) {
    this.name = name
  }
}

export interface MenuTabla<T> {
  obtener: (params: ArgumentosMenu) => (ItemMenuTabla<T> | StaticMenuItems)[]
}

export type StaticMenuItems = "separator"

// 3) Configuracion columnas
export type ConfiguracionColumnasTabla<T, L = any> = {
  [Key in keyof T]?: ConfigColumnaTabla<T, L>
}

export class ConfigColumnaTabla<T, L = any> {
  editarValor?: (
    event: ArgumentosCambioCelda<T>,
    eventArgs: any
  ) => Promise<void>
  formato?: (params: ValueGetterParams) => any
  tabPermitido?: boolean | ((params: ArgumentosComponente<T>) => boolean)
  validar?: boolean | ((params: ArgumentosComponente<T>) => boolean)
  configuracionListado?: ConfiguracionListado<T, L>
  configuracionNumerica?: ConfiguracionNumerica<T>
  configuracionFecha?: ConfiguracionFecha<T>
  customRender?: ICellRendererFunc | string
  configuracionCheck?: ConfiguracionCheck<T>
}

// Evento generado cuando se cambia el contenido de una celda y se presiona Enter
export interface ArgumentosCambioCelda<T> {
  api: GridApi
  colDef: ColDef
  column: Column
  columnApi: ColumnApi
  context: any
  data: T
  newValue: any
  node: RowNode
  oldNode: number
}

export interface ArgumentosComponente<T, L = any> {
  params: ParametrosComponente<T, L>
  value: any
  valueFormatted: any
  getValue: () => any
  setValue: (value: any) => void
  formatValue: (value: any) => any
  data: T
  node: RowNode
  colDef: ColDef
  column: Column
  rowIndex: number
  api: GridApi
  columnApi: ColumnApi
  context: any
}

export interface ParametrosComponente<T, L> {
  columna: ColumnConfig<T>
  config: ConfigColumnaTabla<T, L>
}

// 1) Configuracion select
export class ConfiguracionListado<T, L> {
  listado: L[]
  showFields: (keyof L)[]
  obligatorio: boolean
  onChange?: (params: ArgumentosComponente<T, L>) => void
  disabled?: (params: ArgumentosComponente<T>) => boolean

  constructor(listado: L[], showFields: (keyof L)[], obligatorio = false) {
    this.listado = listado
    this.showFields = showFields
    this.obligatorio = obligatorio
  }
}

// 2) Configuracion input number
export class ConfiguracionNumerica<T> {
  minimo?: number | ((params: ArgumentosComponente<T>) => number | null)
  maximo?: number | ((params: ArgumentosComponente<T>) => number | null)

  constructor(
    minimo: number | ((params: ArgumentosComponente<T>) => number | null),
    maximo: number | ((params: ArgumentosComponente<T>) => number | null)
  ) {
    this.minimo = minimo
    this.maximo = maximo
  }
}

export interface Listable {
  id: number | null
}

// 3) Configuracion check
export class ConfiguracionCheck<T> {
  disabled: (params: ArgumentosComponente<T>) => boolean

  constructor(disabled: (params: ArgumentosComponente<T>) => boolean) {
    this.disabled = disabled
  }
}

// 4) Configuracion input date
export class ConfiguracionFecha<T> {
  disabled?: (params: ArgumentosComponente<T>) => boolean
}
