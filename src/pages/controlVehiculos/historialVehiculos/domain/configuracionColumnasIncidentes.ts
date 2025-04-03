import { ColumnConfig } from 'components/tables/domain/ColumnConfig';

export const configuracionColumnasIncidentes: ColumnConfig<any>[] = [
    {
        name: 'fecha',
        field: 'fecha',
        label: 'Fecha',
        align: 'left',
        sortable: true,
    },
    {
        name: 'persona_reporta',
        field: 'persona_reporta',
        label: 'Persona Reporta',
        align: 'left',
        sortable: true,
    },
    {
        name: 'tipo',
        field: 'tipo',
        label: 'Tipo',
        align: 'left',
        sortable: true,
    },
    {
        name: 'gravedad',
        field: 'gravedad',
        label: 'Gravedad',
        align: 'left',
        sortable: true,
    },
    {
        name: 'descripcion',
        field: 'descripcion',
        label: 'Descripción',
        align: 'left',
    },
    {
        name: 'aplica_seguro',
        field: 'aplica_seguro',
        label: '¿Aplica Seguro?',
        align: 'left',
        sortable: true,
    },
]