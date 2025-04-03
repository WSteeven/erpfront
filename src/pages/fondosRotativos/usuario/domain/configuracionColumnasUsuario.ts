import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { Usuario } from './Usuario';

export const configuracionColumnasUsuario: ColumnConfig<Usuario>[] = [
  {
    name: 'name',
    field: 'name',
    label: 'Nombre',
    align: 'left',
    sortable: true
  },
  {
    name: 'email',
    field: 'email',
    label: 'E-mail',
    align: 'left',
    sortable: true
  },
  {
    name: 'password',
    field: 'password',
    label: 'Contraseña',
    align: 'left',
    sortable: true
  },
]
