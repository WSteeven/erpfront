import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { EscenarioVentaJP } from "./EscenarioVentaJP";

export const configuracionColumnasEscenarioVentaJP: ColumnConfig<EscenarioVentaJP>[] = [
  {
    name: 'mes',
    field: 'mes',
    label: 'Mes',
    align: 'left',
    sortable: true
  },
  {
    name: 'apoyo_das_fijos',
    field: 'apoyo_das_fijos',
    label: 'Apoyo Das Fijos',
    align: 'left',
    sortable: true
  },
  {
    name: 'vendedores',
    field: 'vendedores',
    label: 'Vendedores',
    align: 'left',
    sortable: true
  },
  {
    name: 'total_ventas_adicionales',
    field: 'total_ventas_adicionales',
    label: 'Total de ventas adicionales',
    align: 'left',
    sortable: true
  },
  {
    name: 'arpu_prom',
    field: 'arpu_prom',
    label: 'Arpu Promedio',
    align: 'left',
    sortable: true
  },
  {
    name: 'altas',
    field: 'altas',
    label: 'Altas',
    align: 'left',
    sortable: true
  },
  {
    name: 'bajas',
    field: 'bajas',
    label: 'Bajas',
    align: 'left',
    sortable: true
  },
  {
    name: 'neta',
    field: 'neta',
    label: 'Neta',
    align: 'left',
    sortable: true
  },
  {
    name: 'stock',
    field: 'stock',
    label: 'Stock',
    align: 'left',
    sortable: true
  },
  {
    name: 'stock_que_factura',
    field: 'stock_que_factura',
    label: 'Stock que factura',
    align: 'left',
    sortable: true
  },


]
