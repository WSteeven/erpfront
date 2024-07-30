import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ActivoFijo } from './ActivoFijo'

export const configuracionColumnasActivosFijos: ColumnConfig<ActivoFijo>[] = [
    {
        name: 'codigo_inventario',
        field: 'codigo_inventario',
        label: 'Cód. Inventario',
        align: 'left',
        sortable: true
    },
    {
        name: 'descripcion',
        field: 'descripcion',
        label: 'Activo fijo',
        align: 'left',
        sortable: true
    },
    {
        name: 'cliente',
        field: 'cliente',
        label: 'Cliente',
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
        name: 'fecha_caducidad',
        field: 'fecha_caducidad',
        label: 'Fecha de caducidad',
        align: 'left',
        sortable: true
    },
    {
        name: 'unidad_medida',
        field: 'unidad_medida',
        label: 'Unidad de medida',
        align: 'left',
        sortable: true,
    },
    {
        name: 'etiqueta_personalizada',
        field: 'etiqueta_personalizada',
        label: 'Etiqueta personalizada',
        align: 'left',
        sortable: true,
    },
    {
        name: 'egresos',
        field: 'egresos',
        label: 'Salidas(egresos)',
        align: 'left',
        sortable: true
    },
]