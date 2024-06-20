import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { Notificacion } from './Notificacion';

export const configuracionColumnasNotificaciones: ColumnConfig<Notificacion>[] = [
  {
    name: 'mensaje',
    field: 'mensaje',
    label: 'Notificación',
    align: 'left',
    sortable: true
  },
  {
    name: 'leida',
    field: 'leida',
    label: 'Leído',
    align: 'left',
    sortable: true
  },

]
