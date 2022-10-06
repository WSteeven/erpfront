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
        label: 'precio_compra',
        align: 'left',
        sortable: true
    },
    {
        name: 'tipo_fibra',
        field: 'tipo_fibra',
        label: 'tipo_fibra',
        align: 'left',
        sortable: true
    },
    {
        name: 'hilos',
        field: 'hilos',
        label: 'hilo',
        align: 'left',
        sortable: true
    },
    {
        name: 'punta_inicial',
        field: 'punta_inicial',
        label: 'punta_inicial',
        align: 'left',
        sortable: true
    },
    {
        name: 'punta_final',
        field: 'punta_final',
        label: 'punta_final',
        align: 'left',
        sortable: true
    },
    {
        name: 'custodia',
        field: 'custodia',
        label: 'custodia',
        align: 'left',
        sortable: true
    },

]