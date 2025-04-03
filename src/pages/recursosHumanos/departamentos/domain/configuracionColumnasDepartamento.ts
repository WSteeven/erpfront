import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Departamento } from './Departamento'

export const configuracionColumnasDepartamento: ColumnConfig<Departamento>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
  },
  {
    name: 'responsable',
    field: 'responsable',
    label: 'Responsable',
    align: 'left',
  },
  {
    name: 'telefono',
    field: 'telefono',
    label: 'Teléfono',
    align: 'left',
  },
  {
    name: 'correo',
    field: 'correo',
    label: 'Correo',
    align: 'left',
  },
  {
    name: 'activo',
    field: 'activo',
    label: 'Activo',
    align: 'left',
  },
]
