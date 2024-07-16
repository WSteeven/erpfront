import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { TipoVehiculo } from './TipoVehiculo'

export const configuracionColumnasTiposVehiculos: ColumnConfig<TipoVehiculo>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Categoria',
        align: 'left',
        sortable: true
    },
    {
        name: 'activo',
        field: 'activo',
        label: 'Activo',
        align: 'left',
        sortable: true
    },
]