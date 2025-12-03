import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Cargo } from './Cargo'

export const configuracionColumnasCargos: ColumnConfig<Cargo>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Cargo',
    align: 'left',
    sortable: true
  },
  {
    name: 'area',
    field: 'area',
    label: 'Area',
    align: 'left',
    sortable: true
  },
  {
    name: 'estado',
    field: 'estado',
    label: 'Estado',
    align: 'left',
    sortable: true
  },
  {
    name: 'aprobado_rrhh',
    field: 'aprobado_rrhh',
    label: 'Aprobado',
    align: 'left',
    sortable: true
  }
]
