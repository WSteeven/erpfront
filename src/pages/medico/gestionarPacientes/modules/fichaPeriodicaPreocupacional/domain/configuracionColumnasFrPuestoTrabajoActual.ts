import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasFrPuestoTrabajoActual: ColumnConfig<any>[] = [
  {
    name: 'puesto_trabajo',
    field: 'puesto_trabajo',
    label: 'Puesto de trabajo / Área',
    align: 'left',
    sortable: true,
    editable: true,
  },
  {
    name: 'actividad',
    field: 'actividad',
    label: 'Actividades',
    align: 'left',
    sortable: true,
    editable: true,
  },
  {
    name: 'medidas_preventivas',
    field: 'medidas_preventivas',
    label: 'Medidas preventivas',
    align: 'left',
    sortable: true,
    editable: true,
  },
]
