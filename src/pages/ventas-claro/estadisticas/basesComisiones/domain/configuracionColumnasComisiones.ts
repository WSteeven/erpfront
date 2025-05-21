import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasComisiones: ColumnConfig<any>[] = [
  {
    name: 'desde',
    field: 'desde',
    label: 'Desde',
    align: 'left',
    editable: true
  },
  {
    name: 'hasta',
    field: 'hasta',
    label: 'Hasta',
    align: 'left',
    editable: true
  },
  {
    name: 'comision',
    field: 'comision',
    label: 'Comisión (%)',
    align: 'left',
    editable: true
  }
]