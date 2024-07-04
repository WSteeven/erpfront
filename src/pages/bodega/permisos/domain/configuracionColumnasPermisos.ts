import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Permiso } from './Permiso'

export const configuracionColumnasPermisosArmas: ColumnConfig<Permiso>[] = [
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
