import { ColumnConfig } from "components/tables/domain/ColumnConfig";

export const configuracionColumnasMantenimientosCorrectivos: ColumnConfig<any>[] = [
    {
        name: 'fecha',
        field: 'fecha',
        label: 'Fecha',
        align: 'left',
        sortable: true,
    },
    {
        name: 'solicitante',
        field: 'solicitante',
        label: 'Solicitante',
        align: 'left',
        sortable: true,
    },
    {
        name: 'autorizacion',
        field: 'autorizacion',
        label: 'Estado',
        align: 'left',
        sortable: true,
    },
    {
        name: 'servicios',
        field: 'servicios',
        label: 'Servicios',
        align: 'left',
    },
]