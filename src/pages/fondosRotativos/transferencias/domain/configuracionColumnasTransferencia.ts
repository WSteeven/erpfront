import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Transferencia } from "./Transferencia";

export const configuracionColumnasTransferencia: ColumnConfig<Transferencia>[] = [
  {
    name: 'fecha',
    field: 'fecha',
    label: 'Fecha',
    align: 'left',
    sortable: true
  },
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
    name: 'cuenta',
    field: 'cuenta',
    label: 'Cuenta',
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
  {
    name:'estado_info',
    field:'estado_info',
    label:'Estado',
    align: 'left',
    sortable: true
  },  {
    name:'es_devolucion',
    field:'es_devolucion',
    label:'Es Devolucion',
    align: 'left',
    sortable: true
  }

]
