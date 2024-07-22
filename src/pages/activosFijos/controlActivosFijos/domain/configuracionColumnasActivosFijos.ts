import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ActivoFijo } from './ActivoFijo'

export const configuracionColumnasActivosFijos: ColumnConfig<ActivoFijo>[] = [
    {
        name: 'detalle_producto_id',
        field: 'detalle_producto_id',
        label: 'Id. Detalle',
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
        name: 'egresos',
        field: 'egresos',
        label: 'Salidas(egresos)',
        align: 'left',
        sortable: true
    },
    {
        name: 'diferencia',
        field: 'diferencia',
        label: 'Diferencia',
        align: 'left',
        sortable: true
    },
]