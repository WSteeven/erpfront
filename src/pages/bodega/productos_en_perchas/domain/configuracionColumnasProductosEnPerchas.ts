import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { ProductoEnPercha } from "./ProductoEnPercha";

export const configuracionColumnasProductosEnPerchas: ColumnConfig<ProductoEnPercha>[]=[
    {
        name: 'inventario',
        field: 'inventario',
        label: 'Item',
        align: 'left',
        sortable: true
    },
    {
        name: 'stock',
        field: 'stock',
        label: 'Cantidad',
        align: 'left',
        sortable: true
    },
    {
        name: 'ubicacion',
        field: 'ubicacion',
        label: 'Ubicación',
        align: 'left',
        sortable: true
    },
]