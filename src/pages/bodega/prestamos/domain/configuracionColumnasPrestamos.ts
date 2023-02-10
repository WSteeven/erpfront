import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Prestamo } from './Prestamo'

export const configuracionColumnasPrestamos: ColumnConfig<Prestamo>[] = [
    {
        name: 'solicitante',
        field: 'solicitante',
        label: 'Solicitante',
        align: 'left',
        sortable: true
    },
    {
        name: 'fecha_salida',
        field: 'fecha_salida',
        label: 'Fecha Salida',
        align: 'left',
        sortable: true
    },
    {
        name: 'fecha_devolucion',
        field: 'fecha_devolucion',
        label: 'Fecha Devolución',
        align: 'left',
        sortable: true
    },
    {
        name: 'observacion',
        field: 'observacion',
        label: 'Observación',
        align: 'left',
        sortable: true
    },
    {
        name: 'per_entrega_recibe',//'per_entrega',
        field: 'per_entrega_recibe',//'per_entrega',
        label: 'Entrega/Recibe',
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