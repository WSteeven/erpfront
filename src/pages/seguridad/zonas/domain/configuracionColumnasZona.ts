import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Zona } from './Zona'

export const configuracionColumnasZona: ColumnConfig<Zona>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
  },
  {
    name: 'descripcion',
    field: 'descripcion',
    label: 'Descripción',
    align: 'left',
  },
  {
    name: 'direccion',
    field: 'direccion',
    label: 'Dirección',
    align: 'left',
  },
  {
    name: 'coordenadas',
    field: 'coordenadas',
    label: 'Coordenadas',
    align: 'left',
  },
  {
    name: 'activo',
    field: 'activo',
    label: 'Activo',
    align: 'left',
  }
]
