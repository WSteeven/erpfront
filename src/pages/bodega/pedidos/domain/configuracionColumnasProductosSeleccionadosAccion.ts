import { ColumnConfig } from 'components/tables/domain/ColumnConfig';

export const configuracionColumnasProductosSeleccionadosAccion: ColumnConfig<any>[] = [
    {
        name: 'producto',
        field: 'producto',
        label: 'Producto',
        align: 'left',
        sortable: true,
    },
    {
        name: 'descripcion',
        field: 'descripcion',
        label: 'Descripción',
        align: 'left',
        sortable: true,
    },
    {
        name: 'categoria',
        field: 'categoria',
        label: 'Categoria',
        align: 'left',
        sortable: true,
    },
    {
        name: 'cantidad',
        field: 'cantidad',
        label: 'Cantidad',
        align: 'left',
        sortable: false,
    },
    {
        name: 'acciones',
        field: 'acciones',
        label: 'Acciones',
        align: 'right',
        sortable: false,
    }
]

