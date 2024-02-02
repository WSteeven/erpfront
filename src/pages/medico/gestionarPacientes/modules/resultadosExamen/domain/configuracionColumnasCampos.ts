import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasCampos: ColumnConfig<any>[] = [
  {
    name: 'campo',
    field: 'campo',
    label: 'Campo',
    align: 'left',
    sortable: true
  },
  {
    name: 'valor',
    field: 'valor',
    label: 'Valor',
    align: 'left',
    sortable: true,
    editable: true,
  },
  {
    name: 'unidad_medida',
    field: 'unidad_medida',
    label: 'Unidad medida',
    align: 'left',
    sortable: true
  },
  {
    name: 'rango_superior',
    field: 'rango_superior',
    label: 'Rango superior',
    align: 'left',
    sortable: true
  },
  {
    name: 'rango_inferior',
    field: 'rango_inferior',
    label: 'Rango inferior',
    align: 'left',
    sortable: true
  },
]
