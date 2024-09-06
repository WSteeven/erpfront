import { SelectOption } from "./SelectOption"

type tipos = 'text' | 'number' | 'textarea' | 'select' | 'boolean' | 'date' | 'search' | 'imagen' | 'datetime' | 'toggle' | 'select_multiple'
type align = 'left' | 'center' | 'right'
type operadores = '<' | '<=' | '>' | '>=' | 'start' | 'end' | 'like' | '!='

export interface ColumnConfig<T> {
  id?: number
  name: keyof T
  field: keyof T
  label: string
  align?: align
  sortable?: boolean
  visible?: boolean
  print?: boolean
  style?: string
  type?: tipos
  editable?: boolean
  options?: SelectOption[]
  hint?: string,
  requerido?: boolean
  filtrar?: boolean
  default?: boolean
  placeholder?: string
  filtro?: (val, update) => void
  operador?: operadores
}
