import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { TipoLicencia } from './TipoLicencia'

export const configuracionColumnasTipoLicencia: ColumnConfig<TipoLicencia>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Tipo de Licencia',
        align: 'left',
        sortable: true
    },
    {
      name: 'num_dias',
      field: 'num_dias',
      label: 'Días Licencia',
      align: 'left',
      sortable: true
  },
  {
    name: 'estado',
    field: 'estado',
    label: 'Estado',
    align: 'left',
    sortable: true
},
]
