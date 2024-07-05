import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { AutorizarTransferencia } from './AutorizarTransferencia';


export const configuracionColumnasAutorizarTransferencia: ColumnConfig<AutorizarTransferencia>[] = [
  {
    name: 'usuario_envia_info',
    field: 'usuario_envia_info',
    label: 'Enviado por',
    align: 'left',
    sortable: true
  },
  {
    name: 'usuario_recibe_info',
    field: 'usuario_recibe_info',
    label: 'Recibido por',
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
    name: 'motivo',
    field: 'motivo',
    label: 'Motivo',
    align: 'left',
    sortable: true
  },

]
