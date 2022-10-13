import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { DetalleProducto } from "./DetalleProducto";

export const configuracionColumnasDetallesProductos: ColumnConfig<DetalleProducto>[]=[
    {
        name: 'producto',
        field: 'producto',
        label: 'Producto',
        align: 'left',
        sortable: true
    },
    {
        name: 'descripcion',
        field: 'descripcion',
        label: 'descripcion',
        align: 'left',
        sortable: true
    },
    {
        name: 'modelo',
        field: 'modelo',
        label: 'modelo',
        align: 'left',
        sortable: true
    },
    {
        name: 'serial',
        field: 'serial',
        label: 'serial',
        align: 'left',
        sortable: true
    },
    {
        name: 'precio_compra',
        field: 'precio_compra',
        label: 'P. Compra',
        align: 'left',
        sortable: true
    },
    {
        name: 'tipo_fibra',
        field: 'tipo_fibra',
        label: 'Tipo F.',
        align: 'left',
        sortable: true
    },
    {
        name: 'hilos',
        field: 'hilos',
        label: 'Hilo',
        align: 'left',
        sortable: true
    },
    {
        name: 'punta_inicial',
        field: 'punta_inicial',
        label: 'P. Inicial',
        align: 'left',
        sortable: true
    },
    {
        name: 'punta_final',
        field: 'punta_final',
        label: 'P. Final',
        align: 'left',
        sortable: true
    },
    {
        name: 'custodia',
        field: 'custodia',
        label: 'Custodia',
        align: 'left',
        sortable: true
    },

]