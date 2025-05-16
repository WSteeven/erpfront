import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Ingreso } from 'trabajoSocial/economia_familiar/domain/EconomiaFamiliar'

export const configuracionColumnasIngresos: ColumnConfig<Ingreso>[] = [
  {
    name: 'nombres_apellidos',
    field: 'nombres_apellidos',
    label: 'Nombre y Apellido',
    align: 'left',
    editable: true,
    sortable: true
  },
  {
    name: 'ocupacion',
    field: 'ocupacion',
    label: 'Ocupación',
    align: 'left',
    editable: true
  },
  {
    name: 'ingreso_mensual',
    field: 'ingreso_mensual',
    label: 'Ingreso Mensual',
    align: 'left',
    type: 'number',
    sortable: true,
    editable: true
  }
]
