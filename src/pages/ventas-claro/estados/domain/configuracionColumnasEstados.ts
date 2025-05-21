import {ColumnConfig} from 'components/tables/domain/ColumnConfig';
import {Estado} from 'pages/ventas-claro/estados/domain/Estado';

export const configuracionColumnasEstados: ColumnConfig<Estado>[]=[
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre',
        align: 'left',
        sortable: true,
    }
    ,{
        name: 'abreviatura',
        field: 'abreviatura',
        label: 'Abreviatura',
        align: 'left',
        sortable: true,
    },{
        name: 'tipo',
        field: 'tipo',
        label: 'Tipo',
        align: 'left',
        sortable: true,
    }
]