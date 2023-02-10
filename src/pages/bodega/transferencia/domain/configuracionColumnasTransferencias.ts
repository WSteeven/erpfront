import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Transferencia } from './Transferencia'

export const configuracionColumnasTransferencias: ColumnConfig<Transferencia>[] = [
    {
        name: 'id',
        field: 'id',
        label: 'N°',
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
        name: 'sucursal_salida',
        field: 'sucursal_salida',
        label: 'Desde',
        align: 'left',
        sortable: true,
    },
    {
        name: 'sucursal_destino',
        field: 'sucursal_destino',
        label: 'Hasta',
        align: 'left',
        sortable: true,
    },
    {
        name: 'estado',
        field: 'estado',
        label: 'Estado',
        align: 'left',
        sortable: true,
    }
]
