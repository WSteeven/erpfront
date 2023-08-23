import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { OrdenCompra } from "./OrdenCompra";
import { DetalleProducto } from "pages/bodega/detalles_productos/domain/DetalleProducto";

export const configuracionColumnasDetallesProductosSeleccionados: ColumnConfig<any>[] = [
  {
    name: 'id',
    field: 'id',
    label: 'N°',
    align: 'left',
    sortable: true,
  },
  {
    name: 'producto',
    field: 'producto',
    label: 'Producto',
    align: 'left',
    sortable: true,
  },
  {
    name: 'descripcion',
    field: 'descripcion',
    label: 'Descripción',
    align: 'left',
    sortable: true,
  },

] 