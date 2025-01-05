import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ValorCargadoRol } from 'recursosHumanos/valoresCargadosRolEmpleadoMensual/domain/ValorCargadoRol'

export const configuracionColumnasValoresCargadosRoles: ColumnConfig<ValorCargadoRol>[]=[
  {
    name: 'empleado',
    field: 'empleado',
    label: 'Empleado',
    align: 'left',
    sortable: true
  },
  {
    name: 'mes',
    field: 'mes',
    label: 'Mes',
    align: 'left',
    sortable: true
  },
  {
    name: 'tipo',
    field: 'tipo',
    label: 'Tipo',
    align: 'left',
    sortable: true
  },
  {
    name: 'monto',
    field: 'monto',
    label: 'Monto',
    align: 'left',
    sortable: true
  },
  {
    name: 'model_type',
    field: 'model_type',
    label: 'Referencia',
    align: 'left',
    sortable: true
  },
]
