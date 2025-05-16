import { ColumnConfig } from 'components/tables/domain/ColumnConfig';

export const configuracionColumnasProductosSeleccionadosDespachadoParciales: ColumnConfig<any>[] = [
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
        name: 'condiciones',
        field: 'condiciones',
        label: 'Estado del producto',
        align: 'left',
        sortable: false,
        editable: false,
    },
    {
        name: 'cantidad',
        field: 'cantidad',
        label: 'Cantidad',
        align: 'left',
        sortable: false,
        editable: false,
    },
    {
        name: 'recibido',
        field: 'recibido',
        label: 'Recibido',
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