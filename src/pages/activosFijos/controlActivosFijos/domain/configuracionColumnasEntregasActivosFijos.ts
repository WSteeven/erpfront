import { ColumnConfig } from 'components/tables/domain/ColumnConfig'

export const configuracionColumnasEntregasActivosFijos: ColumnConfig<any>[] = [
    {
        name: 'fecha_hora_entrega',
        field: 'fecha_hora_entrega',
        label: 'Fecha y hora de entrega',
        align: 'left',
        sortable: true
    },
    {
        name: 'cantidad',
        field: 'cantidad',
        label: 'Cantidad',
        align: 'left',
        sortable: true
    },
    {
        name: 'condicion',
        field: 'condicion',
        label: 'Condición',
        align: 'left',
        sortable: true
    },
    {
        name: 'ciudad',
        field: 'ciudad',
        label: 'Ciudad',
        align: 'left',
        sortable: true
    },
    {
        name: 'responsable',
        field: 'responsable',
        label: 'Responsable',
        align: 'left',
        sortable: true,
    },
    {
        name: 'codigo_permiso_traslado',
        field: 'codigo_permiso_traslado',
        label: 'Código de permiso para traslado (SINCOAR)',
        align: 'left',
        sortable: true,
    },
]