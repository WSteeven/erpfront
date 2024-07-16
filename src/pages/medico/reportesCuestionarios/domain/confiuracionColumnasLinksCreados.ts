import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { LinkCuestionarioPublico } from './LinkCuestionarioPublico'

export const ConfiguracionColumnasLinksCreados: ColumnConfig<LinkCuestionarioPublico>[] = [
    {
        name: 'link',
        field: 'link',
        label: 'Link',
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
