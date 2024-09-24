import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { SeguimientoConsumoActivoFijo } from './SeguimientoConsumoActivoFijo';

// En seguimiento
export const configuracionColumnasSeguimientoConsumoActivoFijo: ColumnConfig<SeguimientoConsumoActivoFijo>[] = [
    {
        name: 'created_at',
        field: 'created_at',
        label: 'Fecha y hora de registro',
        align: 'left',
        sortable: true
    },
    {
        name: 'cantidad_utilizada',
        field: 'cantidad_utilizada',
        label: 'Cantidad utilizada',
        align: 'left',
        sortable: true
    },
    {
        name: 'detalle_producto',
        field: 'detalle_producto',
        label: 'Detalle de producto',
        align: 'left',
        sortable: true
    },
    {
        name: 'serie',
        field: 'serie',
        label: 'Serie',
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
        name: 'categoria_motivo_consumo',
        field: 'categoria_motivo_consumo',
        label: 'Categoría motivo consumo',
        align: 'left',
        sortable: true
    },
    {
        name: 'motivo_consumo',
        field: 'motivo_consumo',
        label: 'Motivo de consumo',
        align: 'left',
        sortable: true
    },
    {
        name: 'se_reporto_sicosep',
        field: 'se_reporto_sicosep',
        label: 'Se reportó sicosep',
        align: 'left',
        sortable: true
    },
    {
        name: 'observacion',
        field: 'observacion',
        label: 'Observación',
        align: 'left',
        sortable: true
    },
]
