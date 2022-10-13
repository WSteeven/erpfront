import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Inventario } from "./Inventario";

export const configuracionColumnasInventarios: ColumnConfig<Inventario>[]=[
    {
        name: 'detalle_id',
        field: 'detalle_id',
        label: 'Producto',
        align: 'left',
        sortable: true
    },
    {
        name: 'cliente_id',
        field: 'cliente_id',
        label: 'Propietario',
        align: 'left',
        sortable: true
    },
    {
        name: 'sucursal_id',
        field: 'sucursal_id',
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