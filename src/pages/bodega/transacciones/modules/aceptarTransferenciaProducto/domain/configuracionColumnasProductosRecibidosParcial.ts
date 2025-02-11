import { ColumnConfig } from 'components/tables/domain/ColumnConfig';

export const configuracionColumnasProductosRecibidosParcial: ColumnConfig<any>[] = [
    {
        name: 'producto',
        field: 'producto',
        label: 'Producto',
        style: 'max-width:300px; overflow: auto;',
        align: 'left',
        sortable: true,
        editable: false,
        visible: true
    },
    {
        name: 'descripcion',
        field: 'descripcion',
        label: 'Descripción',
        style: 'max-width:300px; overflow: auto;',
        align: 'left',
        sortable: true,
        editable: false,
        visible: true
    },
    {
        name: 'categoria',
        field: 'categoria',
        label: 'Categoria',
        align: 'left',
        sortable: true,
        editable: false,
        visible: true
    },
    {
        name: 'serial',
        field: 'serial',
        label: 'Serial',
        align: 'left',
        sortable: true,
        editable: false,
        visible: true
    },
    {
        name: 'cantidad',
        field: 'cantidad',
        label: 'Cantidad enviada',
        align: 'left',
        sortable: false,
        editable: false,
    },
    {
        name: 'recibido',
        field: 'recibido',
        label: 'Cantidad recibida',
        align: 'left',
        sortable: false,
        editable: false,
    },
    {
        name: 'acciones',
        field: 'acciones',
        label: 'Acciones',
        align: 'center',
    },
]