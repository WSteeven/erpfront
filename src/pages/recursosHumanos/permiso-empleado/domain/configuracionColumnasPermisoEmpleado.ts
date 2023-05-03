import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { PermisoEmpleado } from './PermisoEmpleado'

export const configuracionColumnasPermisoEmpleado: ColumnConfig<PermisoEmpleado>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Cargo',
        align: 'left',
        sortable: true
    },
]
