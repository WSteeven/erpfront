import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { CausaIntervencion } from './CausaIntervencion'

export const configuracionColumnasCausaIntervencion: ColumnConfig<CausaIntervencion>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
  },
]
