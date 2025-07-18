import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { SolicitudDescuento } from './SolicitudDescuento'

export const configuracionColumnasSolicitudDescuento: ColumnConfig<SolicitudDescuento>[] = [
    {
        name: 'id',
        field: 'id',
        label: 'Id',
        align: 'left',
        sortable: true
    },
    {
        name: 'titulo',
        field: 'titulo',
        label: 'Titulo',
        align: 'left',
        sortable: true
    },
    {
        name: 'descripcion',
        field: 'descripcion',
        label: 'Descripción',
        align: 'left',
        sortable: true
    },
    {
        name: 'empleado_solicitante',
        field: 'empleado_solicitante',
        label: 'Solicitante',
        align: 'left',
        sortable: true
    },
    {
        name: 'empleado_involucrado',
        field: 'empleado_involucrado',
        label: 'Empleado involucrado',
        align: 'left',
        sortable: true
    },
    {
        name: 'estado',
        field: 'estado',
        label: 'Estado',
        align: 'left',
        sortable: true
    },
]
