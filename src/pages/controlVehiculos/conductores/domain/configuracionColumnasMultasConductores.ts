import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { MultaConductor } from '../modules/multas/domain/MultaConductor';

export const configuracionColumnasMultasConductores: ColumnConfig<MultaConductor>[] = [
    {
        name: 'fecha_infraccion',
        field: 'fecha_infraccion',
        label: 'Fecha Infraccion',
        align: 'left',
        sortable: true
    },
    {
        name: 'placa',
        field: 'placa',
        label: 'Placa',
        align: 'left',
        sortable: true,
        editable: false,
    },
    {
        name: 'puntos',
        field: 'puntos',
        label: 'Puntos',
        align: 'left',
        sortable: true
    },
    {
        name: 'total',
        field: 'total',
        label: 'T. a Pagar',
        align: 'left',
        sortable: true
    },
    {
        name: 'estado',
        field: 'estado',
        label: 'Estado',
        align: 'left',
        type: 'toggle',
        sortable: true
    },
    {
        name: 'fecha_pago',
        field: 'fecha_pago',
        label: 'Fecha pago',
        align: 'left',
        sortable: true
    },
    {
        name: 'comentario',
        field: 'comentario',
        label: 'Comentario',
        align: 'left',
    },
]