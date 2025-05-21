import {ColumnConfig} from 'components/tables/domain/ColumnConfig';
import {BaseComision} from 'pages/ventas-claro/estadisticas/basesComisiones/domain/BaseComision';

export const configuracionColumnasBaseComision: ColumnConfig<BaseComision>[]=[
    {
        name: 'modalidad',
        field: 'modalidad',
        label: 'Modalidad',
        align: 'left',
        sortable: true
    },
]