import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { TipoFotografia } from './TipoFotografia'

export const configuracionColumnasTipoFotografias: ColumnConfig<TipoFotografia>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
    sortable: true,
  },
  {
    name: 'tipo_trabajo',
    field: 'tipo_trabajo',
    label: 'Tipo de Trabajo',
    align: 'left',
    sortable: true,
  },
  {
    name: 'activo',
    field: 'activo',
    label: '¿Activo?',
    align: 'left',
    sortable: true,
  },
]
