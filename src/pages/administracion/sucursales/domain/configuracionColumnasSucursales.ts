import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Sucursal } from './Sucursal'

export const configuracionColumnasSucursales: ColumnConfig<Sucursal>[] = [
    {
        name: 'lugar',
        field: 'lugar',
        label: 'Lugar',
        align: 'left',
        sortable: true
    },
    {
        name: 'telefono',
        field: 'telefono',
        label: 'Telefono',
        align: 'left',
        sortable: true
    },
    {
        name: 'correo',
        field: 'correo',
        label: 'Correo',
        align: 'left',
        sortable: true
    },
    {
        name: 'administrador',
        field: 'administrador',
        label: 'Administrador',
        align: 'left',
        sortable: true
    }
]