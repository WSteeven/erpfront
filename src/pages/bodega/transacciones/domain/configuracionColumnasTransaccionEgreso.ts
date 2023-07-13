import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Transaccion } from './Transaccion'

export const configuracionColumnasTransaccionEgreso: ColumnConfig<Transaccion>[] = [
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
        sortable: true,
    },
    {
        name: 'justificacion',
        field: 'justificacion',
        label: 'Justificación',
        style: 'max-width: 300px; overflow: auto;',
        align: 'left',
        sortable: true,
    },
    {
        name: 'responsable',
        field: 'responsable',
        label: 'Responsable',
        align: 'left',
        sortable: true,
    },
    {
        name: 'pedido',
        field: 'pedido',
        label: 'Pedido',
        align: 'left',
        sortable: true,
    },
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
        sortable: true,
    },
    {
        name: 'autorizacion',
        field: 'autorizacion',
        label: 'Autorización',
        align: 'left',
        sortable: true,
    },
    {
        name: 'firmada',
        field: 'firmada',
        label: '¿Firmada?',
        align: 'left',
        sortable: true,
    },
    {
        name: 'estado_comprobante',
        field: 'estado_comprobante',
        label: 'Estado del comprobante',
        align: 'center',
        sortable: true,
    }
]
