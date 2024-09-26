import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Grupo } from './Grupo'

export const configuracionColumnasGrupo: ColumnConfig<Grupo>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
  },
  {
    name: 'region',
    field: 'region',
    label: 'Región',
    align: 'left',
  },
  {
    name: 'coordinador',
    field: 'coordinador',
    label: 'Coordinador',
    align: 'left',
  },
  {
    name: 'cant_empleados',
    field: 'cant_empleados',
    label: 'Cant. Miembros',
    align: 'left',
  },
  {
    name: 'activo',
    field: 'activo',
    label: 'Activo',
    align: 'left',
  },
]
