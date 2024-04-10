import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { DetalleExamen } from './DetalleExamen'

export const configuracionColumnasExamenes: ColumnConfig<DetalleExamen>[] = [
  {
    name: 'examen',
    field: 'examen',
    label: 'Examen',
    align: 'left',
    sortable: true,
  },
  {
    name: 'categoria',
    field: 'categoria',
    label: 'Categoría',
    align: 'left',
    sortable: true
  },
  {
    name: 'tipo_examen',
    field: 'tipo_examen',
    label: 'Tipo examen',
    align: 'left',
    sortable: true,
  },
]
