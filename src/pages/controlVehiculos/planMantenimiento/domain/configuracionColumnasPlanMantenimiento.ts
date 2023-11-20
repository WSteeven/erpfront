import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { PlanMantenimiento } from "./PlanMantenimiento";

export const configuracionColumnasPlanMantenimiento: ColumnConfig<PlanMantenimiento>[] = [
    {
        name: 'vehiculo',
        field: 'vehiculo',
        label: 'Placa',
        align: 'left',
        sortable: true,
    },
    {
        name: 'comienza_km',
        field: 'comienza_km',
        label: 'Aplicar desde ',
        align: 'left',
        sortable: true,
    },
    {
        name: 'cant_servicios',
        field: 'cant_servicios',
        label: 'Cant. Servicios',
        align: 'left',
        sortable: true,
    },
]