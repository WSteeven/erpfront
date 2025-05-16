import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { PagoProveedor } from './PagoProveedor';

export const configuracionColumnasPagoProveedores: ColumnConfig<PagoProveedor>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre',
        align: 'left',
        sortable: true
    },
    {
        name: 'realizador',
        field: 'realizador',
        label: 'Subido Por',
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
    {
        name: 'cant_elementos',
        field: 'cant_elementos',
        label: 'Cant. Facturas',
        align: 'left',
        sortable: true
    },
]