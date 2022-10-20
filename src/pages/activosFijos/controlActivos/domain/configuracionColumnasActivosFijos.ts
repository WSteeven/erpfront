import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { ActivoFijo } from "./ActivoFijo";

export const configuracionColumnasActivosFijos: ColumnConfig<ActivoFijo>[]=[
    {
        name: 'empleado',
        field: 'empleado',
        label: 'Custodio',
        align: 'left',
        sortable: true
    },
    {
        name: 'detalle_id',
        field: 'detalle_id',
        label: 'Producto',
        align: 'left',
        sortable: true
    },
    {
        name: 'accion',
        field: 'accion',
        label: 'Acción',
        align: 'left',
        sortable: true
    },
    {
        name: 'fecha_desde',
        field: 'fecha_desde',
        label: 'Desde',
        align: 'left',
        sortable: true
    },
    {
        name: 'fecha_hasta',
        field: 'fecha_hasta',
        label: 'Hasta',
        align: 'left',
        sortable: true
    },
    {
        name: 'condicion',
        field: 'condicion',
        label: 'Estado del producto',
        align: 'left',
        sortable: true
    },
    {
        name: 'observacion',
        field: 'observacion',
        label: 'observacion',
        align: 'left',
        sortable: true
    },
    {
        name: 'sucursal',
        field: 'sucursal',
        label: 'Bodega',
        align: 'left',
        sortable: true
    },
    {
        name: 'lugar',
        field: 'lugar',
        label: 'lugar',
        align: 'left',
        sortable: true
    },
]