import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Inventario } from "./Inventario";

export const configuracionColumnasInventarios: ColumnConfig<Inventario>[]=[
    {
        name: 'detalle',
        field: 'detalle',
        label: 'Producto',
        align: 'left',
        sortable: true
    },
    {
        name: 'cliente',
        field: 'cliente',
        label: 'Propietario',
        align: 'left',
        sortable: true
    },
    {
        name: 'sucursal',
        field: 'sucursal',
        label: 'Sucursal',
        align: 'left',
        sortable: true
    },
    {
        name: 'cantidad',
        field: 'cantidad',
        label: 'Cantidad',
        align: 'left',
        sortable: true
    },
    {
        name: 'prestados',
        field: 'prestados',
        label: 'Prestados',
        align: 'left',
        sortable: true
    },
    {
        name: 'condicion',
        field: 'condicion',
        label: 'Condicion',
        align: 'left',
        sortable: true
    },
    {
        name: 'estado',
        field: 'estado',
        label: 'Estado',
        align: 'left',
        sortable: true
    },
]