import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { MultaConductor } from './MultaConductor';

export const configuracionColumnasMultasConductores: ColumnConfig<MultaConductor>[] = [
    {
        name: 'empleado',
        field: 'empleado',
        label: 'Conductor',
        align: 'left',
        sortable: true
    },
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
        name: 'descontable',
        field: 'descontable',
        label: 'Se descuenta',
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
        name: 'fecha_pago',
        field: 'fecha_pago',
        label: 'fecha_pago',
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