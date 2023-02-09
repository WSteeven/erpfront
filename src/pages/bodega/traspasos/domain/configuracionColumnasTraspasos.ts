import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Traspaso } from './Traspaso'

export const configuracionColumnasTraspasos: ColumnConfig<Traspaso>[] = [
    {
        name: 'solicitante',
        field: 'solicitante',
        label: 'Creado por',
        align: 'left',
        sortable: true
    },
    {
        name: 'justificacion',
        field: 'justificacion',
        label: 'Justificación',
        align: 'left',
        sortable: true
    },
    {
        name: 'desde_cliente',
        field: 'desde_cliente',
        label: 'Desde',
        align: 'left',
        sortable: true
    },
    {
        name: 'hasta_cliente',
        field: 'hasta_cliente',
        label: 'Hasta',
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