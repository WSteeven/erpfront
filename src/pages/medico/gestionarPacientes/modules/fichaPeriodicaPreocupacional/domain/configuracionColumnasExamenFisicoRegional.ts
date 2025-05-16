import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ExamenFisicoRegional } from '../../seccionesFichas/domain/ExamenFisicoRegional'

export const configuracionColumnasExamenFisicoRegional: ColumnConfig<ExamenFisicoRegional>[] = [
  {
    name: 'categoria_examen_fisico',
    field: 'categoria_examen_fisico',
    label: 'Categoria',
    align: 'left',
    sortable: true,
    editable: true,
  },
  {
    name: 'descripcion',
    field: 'descripcion',
    label: 'Descripción',
    align: 'left',
    sortable: true,
    editable: true,
  },
]
