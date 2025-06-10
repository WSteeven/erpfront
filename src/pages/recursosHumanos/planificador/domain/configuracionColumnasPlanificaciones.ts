import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Planificador } from 'recursosHumanos/planificador/domain/Planificador'

export const configuracionColumnasPlanificaciones: ColumnConfig<Planificador>[]=[
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
  },
  {
    name: 'empleado',
    field: 'empleado',
    label: 'Empleado Responsable',
    align: 'left',
  },
  {
    name: 'completado',
    field: 'completado',
    label: '% Completado',
    align: 'center',
  }
]
