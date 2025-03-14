import { ColumnConfig } from 'components/tables/domain/ColumnConfig';

export const configuracionColumnasCriteriosCalificacionesConCalificacion: ColumnConfig<any>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre',
        align: 'left',
        sortable: true
    },
    {
        name: 'comentario',
        field: 'comentario',
        label: 'Comentario',
        align: 'left',
        sortable: true
    },
    {
        name: 'peso',
        field: 'peso',
        label: 'Peso (%)',
        align: 'center',
        type: 'number',
        sortable: true,
        editable: true,
    },
    {
        name: 'puntaje',
        field: 'puntaje',
        label: 'Puntaje',
        align: 'center',
        editable: false,
        sortable: true

    },
    {
        name: 'calificacion',
        field: 'calificacion',
        label: 'Calificacion',
        align: 'center',
        sortable: true
    },
]
