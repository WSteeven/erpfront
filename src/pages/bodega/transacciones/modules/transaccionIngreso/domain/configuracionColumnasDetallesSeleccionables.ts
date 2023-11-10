import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { DetalleProducto } from 'pages/bodega/detalles_productos/domain/DetalleProducto'

export const configuracionColumnasDetallesProductosSeleccionables: ColumnConfig<DetalleProducto>[] = [
    {
        name: 'producto',
        field: 'producto',
        label: 'Producto',
        style: 'max-width: 300px; overflow: auto;',
        align: 'left',
        sortable: true
    },
    {
        name: 'descripcion',
        field: 'descripcion',
        label: 'Descripción',
        style: 'max-width: 600px; overflow: auto;',
        align: 'left',
        sortable: true
    },
    {
        name: 'id',
        field: 'id',
        label: 'Id Detalle',
        align: 'left',
        visible: false,
        editable: false,

    },
    {
        name: 'modelo',
        field: 'modelo',
        label: 'Modelo',
        align: 'left',
        sortable: true
    },
    {
        name: 'serial',
        field: 'serial',
        label: 'Serial',
        align: 'left',
        sortable: true
    },
    {
        name: 'fibra',
        field: 'fibra',
        label: 'Fibra',
        align: 'left',
        sortable: true
    },
    {
        name: 'puntas',
        field: 'puntas',
        label: 'Detalles Fibra',
        align: 'left',
        sortable: true
    },
    {
        name: 'adicionales',
        field: 'adicionales',
        label: 'Campos adicionales',
        align: 'left',
        sortable: true
    },

]
