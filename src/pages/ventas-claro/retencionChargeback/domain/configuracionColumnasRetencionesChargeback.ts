import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { Retencion } from './Retencion';

export const configuracionColumnasRetencionesChargebacks: ColumnConfig<Retencion>[] = [
    {
        name: 'vendedor_info',
        field: 'vendedor_info',
        label: 'Vendedor',
        align: 'left',
        sortable: true
    },
    {
        name: 'venta_info',
        field: 'venta_info',
        label: 'Venta',
        align: 'left',
        sortable: false
    },
    {
        name: 'fecha_retencion',
        field: 'fecha_retencion',
        label: 'Fecha de Retención',
        align: 'left',
        sortable: true
    },
    {
        name: 'valor_retenido',
        field: 'valor_retenido',
        label: 'Valor Retenido',
        align: 'left',
        sortable: true
    },
    {
        name: 'pagado',
        field: 'pagado',
        label: 'Pagado',
        align: 'left',
        sortable: true
    },
]