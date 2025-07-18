import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Sucursal } from './Sucursal'

export const configuracionColumnasSucursales: ColumnConfig<Sucursal>[] = [
  {
    name: 'id',
    field: 'id',
    label: 'N°',
    align: 'left',
    sortable: true
  },
  {
    name: 'lugar',
    field: 'lugar',
    label: 'Lugar',
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
    name: 'correo',
    field: 'correo',
    label: 'Correo',
    align: 'left',
    sortable: true
  },
  {
    name: 'cliente',
    field: 'cliente',
    label: 'Propietario',
    align: 'left',
    sortable: true
  },
  {
    name: 'extension',
    field: 'extension',
    label: 'Extensión',
    align: 'left',
    sortable: true
  },
  {
    name: 'activo',
    field: 'activo',
    label: 'Estado',
    align: 'left',
    sortable: true
  }
]
