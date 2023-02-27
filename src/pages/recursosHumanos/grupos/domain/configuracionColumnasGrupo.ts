import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Grupo } from './Grupo'

export const configuracionColumnasGrupo: ColumnConfig<Grupo>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre',
        align: 'left',
    },
    {
        name: 'activo',
        field: 'activo',
        label: 'Activo',
        align: 'left',
    },
]
