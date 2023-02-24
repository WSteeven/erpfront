import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { TipoElemento } from './TipoElemento'

export const configuracionColumnasTiposElementos: ColumnConfig<TipoElemento>[] =
  [
    {
      name: 'nombre',
      field: 'nombre',
      label: 'Nombre',
      align: 'left',
      sortable: true,
    },
  ]
