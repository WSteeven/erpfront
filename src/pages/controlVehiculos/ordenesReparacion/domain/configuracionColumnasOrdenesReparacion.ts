import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { OrdenReparacion } from "./OrdenReparacion";

export const configuracionColumnasOrdenesReparaciones: ColumnConfig<OrdenReparacion>[] = [
    {
        name: 'fecha',
        field: 'fecha',
        label: 'fecha',
        align: 'left',
        sortable: true,
    },
    {
        name: 'vehiculo',
        field: 'vehiculo',
        label: 'Placa',
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
]