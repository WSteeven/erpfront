import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { TipoEvento } from './TipoEvento'

export const configuracionColumnasTipoEvento: ColumnConfig<TipoEvento>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Tipo de Evento',
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
