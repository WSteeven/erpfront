import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Transferencia } from "./Transferencia";

export const configuracionColumnasTransferencia: ColumnConfig<Transferencia>[] = [
  {
    name: 'usuario_envia_info',
    field: 'usuario_envia_info',
    label: 'Enviado por',
    align: 'left',
    sortable: true
  },
  {
    name: 'usuario_recive_info',
    field: 'usuario_recive_info',
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
