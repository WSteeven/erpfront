type tipos = 'text' | 'number' | 'textarea' | 'select' | 'boolean' | 'date' | 'search'

export interface ColumnConfig<T> {
  name: keyof T
  field: keyof T
  label: string
  align?: string
  sortable?: boolean
  visible?: boolean
  print?: boolean
  style?: string
  type?: tipos
  editable?: boolean
  options?: any[]
  // filtrar?: boolean
}
