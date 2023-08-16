import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Pedido } from './Pedido'

export const configuracionColumnasPedidos: ColumnConfig<Pedido>[] = [
    {
        name: 'id',
        field: 'id',
        label: 'N°',
        align: 'left',
        sortable: true
    },
    {
        name: 'created_at',
        field: 'created_at',
        label: 'Fecha',
        align: 'left',
        sortable: true,
        style: 'width:100px'
    },
    {
        name: 'justificacion',
        field: 'justificacion',
        label: 'Justificación',
        align: 'left',
        sortable: true,
        style: 'max-width:300px; overflow: auto;'
    },
    {
        name: 'solicitante',
        field: 'solicitante',
        label: 'Solicitante',
        style: 'max-width:250px; overflow: auto;',
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
        style: 'max-width:250px; overflow: auto;',
        align: 'left',
        sortable: true
    },
    // {
    //     name: 'tarea',
    //     field: 'tarea',
    //     label: 'Tarea',
    //     align: 'left',
    //     sortable: true
    // },
    {
        name: 'responsable',
        field: 'responsable',
        label: 'Responsable',
        style: 'max-width:250px; overflow: auto;',
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
        label: 'Estado de despacho',
        align: 'left',
        sortable: true
    },
]