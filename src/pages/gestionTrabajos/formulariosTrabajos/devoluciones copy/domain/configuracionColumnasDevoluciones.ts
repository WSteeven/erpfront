import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Devolucion } from './Devolucion'

export const configuracionColumnasDevoluciones: ColumnConfig<Devolucion>[] = [
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
        style: 'max-width: 300px; overflow: auto;',
        align: 'left',
        sortable: true
    },
    {
        name: 'canton',
        field: 'canton',
        label: 'Cantón',
        align: 'left',
        sortable: true
    },
    {
        name: 'estado_bodega',
        field: 'estado_bodega',
        label: 'Procesada en bodega',
        align: 'left',
        sortable: true
    },
]
