type tipos = 'text' | 'number' | 'textarea'

export interface ColumnConfig<T> {
  name: keyof T
  field: keyof T
  label: string
  align?: string
  sortable?: boolean
  visible?: boolean
  print?: boolean
  style?: string
  input_type?: tipos
}
