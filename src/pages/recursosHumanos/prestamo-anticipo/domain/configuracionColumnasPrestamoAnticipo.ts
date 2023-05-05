import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { PrestamoAnticipo } from './PrestamoAnticipo'

export const configuracionColumnasPrestamoAnticipo: ColumnConfig<PrestamoAnticipo>[] = [
    {
        name: 'tipo_info',
        field: 'tipo_info',
        label: 'Tipo',
        align: 'left',
        sortable: true
    },
    {
      name: 'fecha',
      field: 'fecha',
      label: 'Fecha',
      align: 'left',
      sortable: true
  },
  {
    name: 'valor',
    field: 'valor',
    label: 'Valor',
    align: 'left',
    sortable: true
},
{
  name: 'forma_pago_info',
  field: 'forma_pago_info',
  label: 'Forma de pago',
  align: 'left',
  sortable: true
},
]
