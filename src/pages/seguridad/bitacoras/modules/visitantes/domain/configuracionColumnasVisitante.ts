import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Visitante } from './Visitante'

export const configuracionColumnasVisitante: ColumnConfig<Visitante>[] = [
  {
    name: 'nombre_completo',
    field: 'nombre_completo',
    label: 'Nombre completo',
    align: 'left',
    disableModal: true,
  },
]
