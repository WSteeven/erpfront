import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Pedido } from "./Pedido";

export const configuracionColumnasPedidos: ColumnConfig<Pedido>[]=[
    {
        name: 'justificacion',
        field: 'justificacion',
        label: 'Justificación',
        align: 'left',
        sortable: true
    },
    {
        name: 'fecha_limite',
        field: 'fecha_limite',
        label: 'Fecha límite',
        align: 'left',
        sortable: true
    },
    {
        name: 'solicitante',
        field: 'solicitante',
        label: 'Solicitante',
        align: 'left',
        sortable: true
    },
    {
        name: 'autorizacion',
        field: 'autorizacion',
        label: 'Autorización',
        align: 'left',
        sortable: true
    },
    {
        name: 'per_autoriza',
        field: 'per_autoriza',
        label: 'Autoriza',
        align: 'left',
        sortable: true
    },
    {
        name: 'tarea',
        field: 'tarea',
        label: 'Tarea',
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
        name: 'estado',
        field: 'estado',
        label: 'Estado',
        align: 'left',
        sortable: true
    },
]