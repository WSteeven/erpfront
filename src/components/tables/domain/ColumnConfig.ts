import { SelectOption } from './SelectOption'

type tipos = 'float' | 'text' | 'number' | 'textarea' | 'select' | 'boolean' | 'date' | 'search' | 'imagen' | 'datetime' | 'toggle' | 'select_multiple' | 'checkbox' | 'voice'
type align = 'left' | 'center' | 'right'
type operadores = '<' | '<=' | '>' | '>=' | 'start' | 'end' | 'like' | '!=' | '='

type funcion<T> = (entidad: T, rowIndex: number) => void

export interface ColumnConfig<T> {
  id?: number
  name: keyof T
  field: keyof T
  label: string
  min?: number
  max?: number
  align?: align
  sortable?: boolean
  visible?: boolean // oculta tanto en tabla como en modal de editar
  visibleModal?: boolean
  print?: boolean
  style?: string
  headerStyle?: string
  type?: tipos
  error?: boolean
  editable?: boolean
  options?: SelectOption[]
  hint?: string,
  requerido?: boolean
  filtrar?: boolean
  default?: boolean
  placeholder?: string
  // accept?: string
  filtro?: (val, update) => void
  operador?: operadores,
  accion?: funcion<T>,
  table_index?: number // Para saber en que posición de la tabla se encuentra
  disableModal?: boolean
  disableTable?: boolean
  columnClass?: string
}
