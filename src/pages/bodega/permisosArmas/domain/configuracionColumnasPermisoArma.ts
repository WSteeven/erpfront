import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { PermisoArma } from './PermisoArma'

export const configuracionColumnasPermisoArma: ColumnConfig<PermisoArma>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Permiso',
        align: 'left',
        sortable: true
    },
    {
        name: 'fecha_emision',
        field: 'fecha_emision',
        label: 'Fecha Emisión',
        align: 'left',
        sortable: true
    },
    {
        name: 'fecha_caducidad',
        field: 'fecha_caducidad',
        label: 'Fecha Caducidad',
        align: 'left',
        sortable: true
    },
]
