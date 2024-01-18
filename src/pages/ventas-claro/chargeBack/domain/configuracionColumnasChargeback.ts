import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Chargeback } from "./Chargeback";

export const configuracionColumnasChargeback: ColumnConfig<Chargeback>[] = [
  {
    name: 'venta_info',
    field: 'venta_info',
    label: 'Orden Interna',
    align: 'left',
    sortable: true
  },
  {
    name: 'fecha',
    field: 'fecha',
    label: 'Fecha',
    align: 'left',
    sortable: true
  },
  {
    name: 'valor',
    field: 'valor',
    label: 'Valor',
    align: 'left',
    sortable: true
  },
  {
    name: 'tipo_chargeback_info',
    field: 'tipo_chargeback_info',
    label: 'Tipo Chargeback',
    align: 'left',
    sortable: true
  },
  {
    name: 'porcentaje',
    field: 'porcentaje',
    label: 'Porcentaje',
    align: 'left',
    sortable: true
  },
]
