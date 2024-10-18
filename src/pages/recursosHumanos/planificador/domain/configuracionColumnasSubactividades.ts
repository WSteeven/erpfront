import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Subactividad } from 'recursosHumanos/planificador/domain/Subactividad'

export const configuracionColumnasSubactividades: ColumnConfig<Subactividad>[]=[
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
