import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Categoria } from './Categoria'

export const configuracionColumnasCategorias: ColumnConfig<Categoria>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Categoría',
    align: 'left',
    sortable: true
  },
  {
    name: 'activo',
    field: 'activo',
    label: 'Activo',
    align: 'left',
    sortable: true
  },
]
