import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { TransferenciaActivoFijo } from './TransferenciaActivoFijo'

export const configuracionColumnasTransferenciasActivosFijos: ColumnConfig<TransferenciaActivoFijo>[] = [
    {
        name: 'id',
        field: 'id',
        label: 'N°',
        align: 'left',
        sortable: true
    },
    {
        name: 'justificacion',
        field: 'justificacion',
        label: 'Justificación',
        style: 'max-width: 300px; overflow: auto;',
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
        name: 'autorizador',
        field: 'autorizador',
        label: 'Autoriza',
        align: 'left',
        sortable: true
    },
    {
        name: 'empleado_origen',
        field: 'empleado_origen',
        label: 'Empleado origen',
        sortable: true
    },
    {
        name: 'empleado_destino',
        field: 'empleado_destino',
        label: 'Empleado destino',
        sortable: true
    },
]
