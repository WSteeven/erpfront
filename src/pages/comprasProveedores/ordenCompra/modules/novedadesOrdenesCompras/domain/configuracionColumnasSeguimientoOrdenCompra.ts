import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import NovedadOrdenCompra from './SeguimientoOrdenCompra';

export const configuracionColumnasSeguimientoOrdenCompra: ColumnConfig<NovedadOrdenCompra>[] = [
    {
        name: 'fecha_hora',
        field: 'fecha_hora',
        label: 'Fecha hora',
        align: 'left',
        type: 'text',
        sortable: true,
        editable: false,
    },
    {
        name: 'actividad',
        field: 'actividad',
        label: 'Novedad',
        align: 'left',
        type: 'text',
        hint: 'Obligatorio',
        requerido: true,
    },
    {
        name: 'observacion',
        field: 'observacion',
        label: 'Observación',
        align: 'left',
        type: 'text',
        hint: 'Opcional',
    },
    {
        name: 'fotografia',
        field: 'fotografia',
        label: 'Fotografia',
        align: 'left',
        type: 'imagen',
        visible: false,
        hint: 'Opcional',
    },
]