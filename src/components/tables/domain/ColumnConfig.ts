export interface ColumnConfig<T> {
  name: keyof T
  field: keyof T
  label: string
  align?: string
  sortable?: boolean
  visible?: boolean
}
