import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { PrendaZona } from './PrendaZona'

export const configuracionColumnasPrendaZona: ColumnConfig<PrendaZona>[] = [
  {
    name: 'zona',
    field: 'zona',
    label: 'Zona',
    align: 'left',
  },
  {
    name: 'tiene_restricciones',
    field: 'tiene_restricciones',
    label: 'Tiene restricciones',
    align: 'left',
  },
]
