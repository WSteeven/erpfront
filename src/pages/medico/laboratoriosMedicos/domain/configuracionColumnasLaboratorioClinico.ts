import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { LaboratorioClinico } from './LaboratorioClinico'

export const configuracionColumnasLaboratorioClinico: ColumnConfig<LaboratorioClinico>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
    sortable: true
  },
  {
    name: 'canton',
    field: 'canton',
    label: 'Cantón',
    align: 'left',
    sortable: true
  },
  {
    name: 'direccion',
    field: 'direccion',
    label: 'Dirección',
    align: 'left',
    sortable: true
  },
  {
    name: 'celular',
    field: 'celular',
    label: 'Celular',
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
    name: 'activo',
    field: 'activo',
    label: 'Activo',
    align: 'left',
    sortable: true
  },
]
