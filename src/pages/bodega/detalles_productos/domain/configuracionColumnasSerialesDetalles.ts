import { ColumnConfig } from 'components/tables/domain/ColumnConfig';

export const configuracionColumnasSerialesDetalles: ColumnConfig<any>[] = [
    {
        name: 'id',
        field: 'id',
        label: 'id',
        align: 'center',
        visible: false,
        editable: false,
    },
    {
        name: 'serial',
        field: 'serial',
        label: 'Serial',
        sortable: false,
        align: 'left',
    },
    {
        name: 'acciones',
        field: 'acciones',
        label: 'Acciones',
        style: 'max-width: 50px; overflow: auto;',
        align: 'center',
    }
]