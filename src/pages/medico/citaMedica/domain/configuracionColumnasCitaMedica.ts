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
    name: 'created_at',
    field: 'created_at',
    label: 'Fecha y hora de solicitud',
    align: 'left',
    sortable: true,
  },
]
