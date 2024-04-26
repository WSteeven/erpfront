import { EsquemaVacuna } from '../modules/esquemaVacunacion/domain/EsquemaVacuna'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasEsquemaVacunacionDetallado: ColumnConfig<EsquemaVacuna>[] = [
  {
    name: 'tipo_vacuna',
    field: 'tipo_vacuna',
    label: 'Tipo de vacuna',
    align: 'left',
    sortable: true
  },
  {
    name: 'fecha',
    field: 'fecha',
    label: 'Fecha de aplicación',
    align: 'left',
    sortable: true
  },
  {
    name: 'fecha_caducidad',
    field: 'fecha_caducidad',
    label: 'Fecha de caducidad',
    align: 'left',
    sortable: true
  },
  {
    name: 'es_dosis_unica',
    field: 'es_dosis_unica',
    label: 'Es dosis única',
  },
  {
    name: 'observacion',
    field: 'observacion',
    label: 'Observación',
    align: 'left',
    sortable: true
  },
  {
    name: 'responsable_vacunacion',
    field: 'responsable_vacunacion',
    label: 'Responsable de vacunación',
    align: 'left',
    sortable: true
  },
  {
    name: 'lote',
    field: 'lote',
    label: 'Lote',
    align: 'left',
    sortable: true
  },
]
