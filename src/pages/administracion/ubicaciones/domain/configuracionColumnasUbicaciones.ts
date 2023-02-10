import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Ubicacion } from './Ubicacion'

export const configuracionColumnasUbicaciones: ColumnConfig<Ubicacion>[] = [
    {
        name: 'codigo',
        field: 'codigo',
        label: 'Codigo',
        align: 'left',
        sortable: true
    },
    {
        name: 'sucursal',
        field: 'sucursal',
        label: 'Sucursal',
        align: 'left',
        sortable: true
    },
    {
        name: 'percha',
        field: 'percha',
        label: 'Percha',
        align: 'left',
        sortable: true
    },
    {
        name: 'piso',
        field: 'piso',
        label: 'Piso',
        align: 'left',
        sortable: true
    },
]