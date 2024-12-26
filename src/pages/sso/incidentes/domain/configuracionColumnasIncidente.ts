import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Incidente } from './Incidente'

export const configuracionColumnasIncidente: ColumnConfig<Incidente>[] = [
    {
        name: 'id',
        field: 'id',
        label: 'Id',
        align: 'left',
        sortable: true
    },
    {
        name: 'titulo',
        field: 'titulo',
        label: 'Titulo',
        align: 'left',
        sortable: true
    },
    {
        name: 'created_at',
        field: 'created_at',
        label: 'Fecha de incidente',
        align: 'left',
        sortable: true
    },
    {
        name: 'tipo_incidente',
        field: 'tipo_incidente',
        label: 'Tipo de incidente',
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
    {
        name: 'empleado_involucrado',
        field: 'empleado_involucrado',
        label: 'Empleado involucrado',
        align: 'left',
        sortable: true
    },
    {
        name: 'inspeccion',
        field: 'inspeccion',
        label: 'Inspección',
        align: 'left',
        sortable: true
    },
]
