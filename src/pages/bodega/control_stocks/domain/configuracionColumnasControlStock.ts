import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { ControlStock } from "./ControlStock";

export const configuracionColumnasControlStock: ColumnConfig<ControlStock>[]=[
    {
        name: 'sucursal_id',
        field: 'sucursal_id',
        label: 'sucursal',
        align: 'left',
        sortable: true
    },
    {
        name: 'detalle_id',
        field: 'detalle_id',
        label: 'detalle',
        align: 'left',
        sortable: true
    },
    {
        name: 'cliente_id',
        field: 'cliente_id',
        label: 'Cliente',
        align: 'left',
        sortable: true
    },
    {
        name: 'minimo',
        field: 'minimo',
        label: 'minimo',
        align: 'left',
        sortable: true
    },
    {
        name: 'reorden',
        field: 'reorden',
        label: 'reorden',
        align: 'left',
        sortable: true
    },
    {
        name: 'estado',
        field: 'estado',
        label: 'estado',
        align: 'left',
        sortable: true
    },
]