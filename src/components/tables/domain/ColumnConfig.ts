type tipos = 'text' | 'number' | 'textarea' | 'select' | 'boolean' | 'date' | 'search' | 'imagen' | 'datetime'
type align = 'left' | 'center' | 'right'

export interface ColumnConfig<T> {
  id: number
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
  options?: any[]
  hint?: string,
  requerido?: boolean
  filtrar?: boolean
}
