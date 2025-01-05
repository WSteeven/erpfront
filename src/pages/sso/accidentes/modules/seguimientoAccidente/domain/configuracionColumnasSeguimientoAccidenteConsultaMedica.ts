import { SeguimientoAccidenteConsultaMedica } from './SeguimientoAccidenteConsultaMedica'
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasSeguimientoAccidenteConsultaMedica: ColumnConfig<SeguimientoAccidenteConsultaMedica>[] = [
  {
    name: 'empleado',
    field: 'empleado',
    label: 'Empleado',
    align: 'left',
    sortable: true
  },
  {
    name: 'telefono',
    field: 'telefono',
    label: 'Telefono',
    align: 'left',
    sortable: true
  },
  {
    name: 'grupo',
    field: 'grupo',
    label: 'Grupo',
    align: 'left',
    sortable: true
  },
  {
    name: 'cargo',
    field: 'cargo',
    label: 'Cargo',
    align: 'left',
    sortable: true
  },
  {
    name: 'dias_descanso',
    field: 'dias_descanso',
    label: 'Días de descanso',
    align: 'left',
    sortable: true
  },
  {
    name: 'dado_alta',
    field: 'dado_alta',
    label: 'Dado de alta',
    align: 'left',
    sortable: true
  },
]
