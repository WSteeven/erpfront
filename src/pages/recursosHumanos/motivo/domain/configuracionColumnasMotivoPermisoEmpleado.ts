import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { MotivoPermisoEmpleado } from './MotivoPermisoEmpleado'

export const configuracionColumnasMotivoPermisoEmpleado: ColumnConfig<MotivoPermisoEmpleado>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Motivo',
        align: 'left',
        sortable: true
    },
]
