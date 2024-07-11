import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { SolicitudPuestoEmpleo } from './SolicitudPuestoEmpleo'

export const configuracionColumnasSolicitudPuestoEmpleo: ColumnConfig<SolicitudPuestoEmpleo>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre de Puesto',
        align: 'left',
        sortable: true
    },
    {
        name: 'tipo_puesto',
        field: 'tipo_puesto',
        label: 'Tipo de Puesto',
        align: 'left',
        sortable: true
    },
    {
        name: 'autorizador',
        field: 'autorizador',
        label: 'Autorizador',
        align: 'left',
        sortable: true
    },
    {
        name: 'autorizacion',
        field: 'autorizacion',
        label: 'Autorización',
        align: 'left',
        sortable: true
    },
    {
        name: 'cargo',
        field: 'cargo',
        label: 'Cargo',
        align: 'left',
        sortable: true
    },
]
