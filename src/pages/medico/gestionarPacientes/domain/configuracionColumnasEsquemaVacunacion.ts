import { EsquemaVacuna } from '../modules/esquemaVacunacion/domain/EsquemaVacuna'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasEsquemaVacunacion: ColumnConfig<EsquemaVacuna>[] = [
  {
    name: 'tipo_vacuna',
    field: 'tipo_vacuna',
    label: 'Tipo de vacuna',
    align: 'left',
    sortable: true
  },
  {
    name: 'dosis_totales',
    field: 'dosis_totales',
    label: 'Dosis totales',
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
