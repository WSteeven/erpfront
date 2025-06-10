import { ColumnConfig } from 'components/tables/domain/ColumnConfig';

export const configuracionColumnasReporteSeguros: ColumnConfig<any>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre',
        align: 'left',
        sortable: true
    },
    {
        name: 'num_poliza',
        field: 'num_poliza',
        label: 'N° Póliza',
        align: 'left',
        sortable: true,
        editable: false,
    },
    {
        name: 'fecha_caducidad',
        field: 'fecha_caducidad',
        label: 'Fecha Caducidad',
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
        name: 'vigente',
        field: 'vigente',
        label: 'Vigente',
        align: 'left',
        sortable: true
    },
    {
        name: 'vehiculo',
        field: 'vehiculo',
        label: 'Vehículo',
        align: 'left',
        sortable: true
    },
]
