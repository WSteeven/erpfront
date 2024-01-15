import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Alimentacion } from './Alimentacion'

export const configuracionColumnasAlimentacion: ColumnConfig<Alimentacion>[] =
  [
    {
      name: 'nombre',
      field: 'nombre',
      label: 'Nombre',
      align: 'left',
      sortable: true,
    },
    {
      name: 'mes',
      field: 'mes',
      label: 'Mes',
      align: 'left',
      sortable: true,
    },

  ]
