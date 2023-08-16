import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { TipoContrato } from './TipoContrato'

export const configuracionColumnasEstadoPermisoEmpleado: ColumnConfig<TipoContrato>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Tipo de Contrato',
        align: 'left',
        sortable: true
    },
]
