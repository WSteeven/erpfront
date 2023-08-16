import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { TipoLicencia } from './TipoLicencia'

export const configuracionColumnasTipoLicencia: ColumnConfig<TipoLicencia>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Tipo de Licencia',
        align: 'left',
        sortable: true
    },
]
