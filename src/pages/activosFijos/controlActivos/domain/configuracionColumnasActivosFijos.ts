import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { ActivoFijo } from "./ActivoFijo";

export const configuracionColumnasActivosFijos: ColumnConfig<ActivoFijo>[]=[
    {
        name: 'cantidad',
        field: 'cantidad',
        label: 'Cantidad',
        align: 'left',
        sortable: true
    },
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
        sortable: true,
        style: 'width:100px'
    },
    {
        name: 'condicion',
        field: 'condicion',
        label: 'Estado del activo',
        align: 'left',
        sortable: true,
        // style: 'color: red;' //cada celda es un td
    },
    {
        name: 'observacion',
        field: 'observacion',
        label: 'Observacion',
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
    /* {
        name: 'lugar',
        field: 'lugar',
        label: 'lugar',
        align: 'left',
        sortable: true
    }, */
]