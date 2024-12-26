import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Inspeccion } from './Inspeccion'

export const configuracionColumnasInspecciones: ColumnConfig<Inspeccion>[] = [
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
        name: 'descripcion',
        field: 'descripcion',
        label: 'Descripción',
        align: 'left',
        sortable: true
    },
    {
        name: 'responsable',
        field: 'responsable',
        label: 'Responsable',
        align: 'left',
        sortable: true
    },
    {
        name: 'fecha_inicio',
        field: 'fecha_inicio',
        label: 'Fecha de inicio',
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
        name: 'cantidad_incidentes',
        field: 'cantidad_incidentes',
        label: 'Cantidad de incidentes',
        align: 'left',
        sortable: true
    },
]
