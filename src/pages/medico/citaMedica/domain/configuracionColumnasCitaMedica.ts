import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { CitaMedica } from './CitaMedica'

export const configuracionColumnasCitaMedica: ColumnConfig<CitaMedica>[] = [
  {
    name: 'paciente',
    field: 'paciente',
    label: 'Paciente',
    align: 'left',
    sortable: true,
  },
  {
    name: 'sintomas',
    field: 'sintomas',
    label: 'Sintomas',
    align: 'left',
    sortable: true,
  },
  {
    name: 'fecha_hora_solicitud',
    field: 'fecha_hora_solicitud',
    label: 'Fecha y hora de solicitud',
    align: 'left',
    sortable: true,
  },
]
