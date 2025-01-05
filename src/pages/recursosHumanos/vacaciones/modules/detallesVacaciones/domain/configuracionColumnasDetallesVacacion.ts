import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { DetalleVacacion } from 'recursosHumanos/vacaciones/modules/detallesVacaciones/domain/DetalleVacacion'

export const configuracionColumnasDetallesVacacion: ColumnConfig<DetalleVacacion>[]=[
  {
    name: 'vacacionable_id',
    field: 'vacacionable_id',
    label: 'Referencia ID',
    align: 'left',
    sortable: true,
  },
  {
    name: 'vacacionable_type',
    field: 'vacacionable_type',
    label: 'Referencia',
    align: 'left',
    sortable: true,
  },
  {
    name: 'fecha_inicio',
    field: 'fecha_inicio',
    label: 'F. Inicio',
    align: 'left',
    sortable: true,
  },
  {
    name: 'fecha_fin',
    field: 'fecha_fin',
    label: 'F. Fin',
    align: 'left',
    sortable: true,
  },
  {
    name: 'dias_utilizados',
    field: 'dias_utilizados',
    label: 'Días Utilizados',
    align: 'left',
    sortable: true,
  },

  {
    name: 'observacion',
    field: 'observacion',
    label: 'Observaciones',
    align: 'left',
    sortable: true,
  }
]
