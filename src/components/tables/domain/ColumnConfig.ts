import { SelectOption } from './SelectOption'

type tipos = 'float' | 'text' | 'number' | 'textarea' | 'select' | 'boolean' | 'date' | 'search' | 'imagen' | 'datetime' | 'toggle' | 'select_multiple' // | 'file'
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
  visible?: boolean
  print?: boolean
  style?: string
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
  accion?: funcion<T>
}
