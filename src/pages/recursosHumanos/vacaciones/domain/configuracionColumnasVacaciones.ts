import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Vacacion } from 'recursosHumanos/vacaciones/domain/Vacacion'

export const configuracionColumnasVacaciones: ColumnConfig<Vacacion>[]=[
  {
    name: 'empleado',
    field: 'empleado',
    label: 'Empleado',
    align: 'left',
    sortable: true,
  },
  {
    name: 'periodo',
    field: 'periodo',
    label: 'Período',
    align: 'left',
    sortable: true,
  },
  {
    name: 'dias',
    field: 'dias',
    label: 'Días Vacaciones',
    align: 'left',
    sortable: true,
  },
  {
    name: 'opto_pago',
    field: 'opto_pago',
    label: '¿Opto pago?',
    align: 'left',
    sortable: true,
  },
  {
    name: 'completadas',
    field: 'completadas',
    label: 'Completadas',
    align: 'left',
    sortable: true,
  },
  {
    name: 'dias_tomados',
    field: 'dias_tomados',
    label: 'Días Tomados',
    align: 'left',
    sortable: true,
  },
  {
    name: 'dias_disponibles',
    field: 'dias_disponibles',
    label: 'Días Disponibles',
    align: 'left',
    sortable: true,
  },
]
