import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasExamenes: ColumnConfig<any>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
    sortable: true
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
    sortable: true
  },
]
