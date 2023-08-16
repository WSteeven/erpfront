import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { TipoTrabajo } from './TipoTrabajo'

export const configuracionColumnasTiposTrabajos: ColumnConfig<TipoTrabajo>[] = [
  {
    name: 'cliente',
    field: 'cliente',
    label: 'Cliente corporativo',
    align: 'left',
    sortable: true,
  },
  {
    name: 'descripcion',
    field: 'descripcion',
    label: 'Nombre de trabajo',
    align: 'left',
    sortable: true,
  },
  {
    name: 'activo',
    field: 'activo',
    label: 'Activo',
    align: 'left',
    sortable: true,
  },
]
