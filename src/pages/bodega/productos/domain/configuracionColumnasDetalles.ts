
import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { DetalleProducto } from 'pages/bodega/detalles_productos/domain/DetalleProducto'

export const configuracionColumnasDetallesProductos: ColumnConfig<DetalleProducto>[] = [
    {
        name: 'descripcion',
        field: 'descripcion',
        label: 'Descripción',
        align: 'left',
        sortable: true
    },
    {
        name: 'modelo_id',
        field: 'modelo_id',
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
        name: 'precio_compra',
        field: 'precio_compra',
        label: 'P. Compra',
        align: 'left',
        sortable: true
    },
    {
        name: 'computadora',
        field: 'computadora',
        label: 'Caracteristicas',
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
]
