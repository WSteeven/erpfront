import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { CausaIntervencion } from './CausaIntervencion'

export const configuracionColumnasCausaIntervencion: ColumnConfig<CausaIntervencion>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Causa de intervención',
    align: 'left',
  },
  {
    name: 'tipo_trabajo',
    field: 'tipo_trabajo',
    label: 'Tipo de trabajo',
    align: 'left',
  },
  {
    name: 'cliente',
    field: 'cliente',
    label: 'Cliente',
    align: 'left',
  },
  {
    name: 'activo',
    field: 'activo',
    label: 'Activo',
    align: 'left',
  },
]
