import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { Servicio } from './Servicio';

export const configuracionColumnasServicios: ColumnConfig<Servicio>[] = [
    {
        name: 'tipo',
        field: 'tipo',
        label: 'Tipo',
        align: 'left',
        sortable: true,
        editable: false,
    },
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre',
        align: 'left',
        sortable: true
    },
    {
        name: 'intervalo',
        field: 'intervalo',
        label: 'Aplicar cada (Km)',
        align: 'left',
        sortable: true
    },
    {
        name: 'notificar_antes',
        field: 'notificar_antes',
        label: 'Notificar faltando (Km)',
        align: 'center',
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