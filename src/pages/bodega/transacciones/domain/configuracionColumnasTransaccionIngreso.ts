import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Transaccion } from './Transaccion'

export const configuracionColumnasTransaccionIngreso: ColumnConfig<Transaccion>[] = [
    {
        name: 'id',
        field: 'id',
        label: 'N°',
        align: 'left',
        sortable: true,
    },
    {
        name: 'created_at',
        field: 'created_at',
        label: 'Fecha',
        align: 'left',
        sortable: true,
    },
    {
        name: 'solicitante',
        field: 'solicitante',
        label: 'Solicitante',
        align: 'left',
        style: 'max-width:250px; overflow: auto;',
        sortable: true,
    },
    {
        name: 'justificacion',
        field: 'justificacion',
        label: 'Justificación',
        align: 'left',
        style: 'max-width:300px; overflow: auto;',
        sortable: true,
    },
    /*{
        name: 'comprobante',
        field: 'comprobante',
        label: 'Factura',
        align: 'left',
        sortable: true,
    },
    {
        name: 'fecha_limite',
        field: 'fecha_limite',
        label: 'Fecha límite',
        align: 'left',
        sortable: true,
    }, */
    {
        name: 'motivo',
        field: 'motivo',
        label: 'Motivo',
        align: 'left',
        sortable: true,
    },
    {
        name: 'sucursal',
        field: 'sucursal',
        label: 'Sucursal',
        align: 'left',
        sortable: true,
    },
    {
        name: 'per_autoriza',
        field: 'per_autoriza',
        label: 'Autoriza',
        align: 'left',
        style: 'max-width:250px; overflow: auto;',
        sortable: true,
    },
    {
        name: 'tarea',
        field: 'tarea',
        label: 'Tarea',
        align: 'left',
        style: 'max-width:200px; overflow: auto;',
        sortable: true,
    },
    /* {
        name: 'autorizacion',
        field: 'autorizacion',
        label: 'Autorización',
        align: 'left',
        sortable: true,
    }, */
    /* {
        name: 'tipo',
        field: 'tipo',
        label: 'Tipo',
        align: 'left',
        sortable: true,
    }, */
    {
        name: 'estado',
        field: 'estado',
        label: 'Estado',
        align: 'left',
        sortable: true,
    }
]
