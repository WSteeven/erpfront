import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { DetalleExamen } from './DetalleExamen'
import { EsquemaVacuna } from './EsquemaVacuna'

export const configuracionColumnasEsquemaVacunacion: ColumnConfig<EsquemaVacuna>[] = [
  {
    name: 'tipo_vacuna',
    field: 'tipo_vacuna',
    label: 'Vacuna',
    align: 'left',
    sortable: true
  },
  {
    name: 'dosis_aplicadas',
    field: 'dosis_aplicadas',
    label: 'Dosis aplicadas',
    align: 'left',
    sortable: true
  },
]
