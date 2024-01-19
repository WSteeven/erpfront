import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { ProductoVentas } from "./ProductoVentas";

export const configuracionColumnasProductoVentas: ColumnConfig<ProductoVentas>[] = [
  {
    name: 'plan_info',
    field: 'plan_info',
    label: 'Plan',
    align: 'left',
    sortable: true
  },
  {
    name: 'bundle',
    field: 'bundle',
    label: 'Bundle',
    align: 'left',
    sortable: true
  },
  {
    name: 'precio',
    field: 'precio',
    label: 'Precio',
    align: 'left',
    sortable: true
  },
  {
    name: 'activo',
    field: 'activo',
    label: 'Estado',
    align: 'left',
    sortable: true
  },
]
