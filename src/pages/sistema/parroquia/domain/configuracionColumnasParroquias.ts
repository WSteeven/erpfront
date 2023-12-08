import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Parroquia } from './Parroquia'

export const configuracionColumnasParroquias: ColumnConfig<Parroquia>[] = [
  {
    name: 'provincia',
    field: 'provincia',
    label: 'Provincia',
    align: 'left',
    sortable: true,
  },
  {
    name: 'canton',
    field: 'canton',
    label: 'Cantón',
    align: 'left',
    sortable: true,
  },
  {
    name: 'parroquia',
    field: 'parroquia',
    label: 'Parroquia',
    align: 'left',
    sortable: true,
  },
]

