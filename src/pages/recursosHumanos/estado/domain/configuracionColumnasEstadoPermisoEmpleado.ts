import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { EstadoPermisoEmpleado } from './EstadoPermisoEmpleado'

export const configuracionColumnasEstadoPermisoEmpleado: ColumnConfig<EstadoPermisoEmpleado>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Estado',
        align: 'left',
        sortable: true
    },
]
