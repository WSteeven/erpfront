import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ActivoFijo } from './ActivoFijo'

export const configuracionColumnasActivosFijos: ColumnConfig<ActivoFijo>[] = [
    {
        name: 'codigo',
        field: 'codigo',
        label: 'Código',
        align: 'left',
        sortable: true
    },
    {
        name: 'codigo_personalizado',
        field: 'codigo_personalizado',
        label: 'Código personalizado',
        align: 'left',
        sortable: true,
    },
    {
        name: 'codigo_sistema_anterior',
        field: 'codigo_sistema_anterior',
        label: 'Código sistema anterior',
        align: 'left',
        sortable: true,
    },
    {
        name: 'descripcion',
        field: 'descripcion',
        label: 'Activo fijo',
        align: 'left',
        sortable: true,
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
    /* {
        name: 'fecha_caducidad',
        field: 'fecha_caducidad',
        label: 'Fecha de caducidad',
        align: 'left',
        sortable: true
    }, */
    {
        name: 'unidad_medida',
        field: 'unidad_medida',
        label: 'Unidad de medida',
        align: 'left',
        sortable: true,
    },
]