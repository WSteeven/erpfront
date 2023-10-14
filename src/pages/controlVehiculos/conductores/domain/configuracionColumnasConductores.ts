import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Conductor } from "./Conductor";

export const configuracioncolumnasConductores: ColumnConfig<Conductor>[] = [
    {
        name: 'empleado',
        field: 'empleado',
        label: 'Empleado',
        align: 'left',
        sortable: true
    },
    {
        name: 'identificacion',
        field: 'identificacion',
        label: 'Identificación',
        align: 'left',
        sortable: true
    },
    {
        name: 'tipo_licencia',
        field: 'tipo_licencia',
        label: 'Licencia',
        align: 'left',
        sortable: true,
        editable: false,
    },
    {
        name: 'puntos',
        field: 'puntos',
        label: 'Puntos',
        align: 'left',
        sortable: true,
        editable: false,
    },
    {
        name: 'inicio_vigencia',
        field: 'inicio_vigencia',
        label: 'Vigente desde',
        align: 'left',
        sortable: true
    },
    {
        name: 'fin_vigencia',
        field: 'fin_vigencia',
        label: 'Vigente hasta',
        align: 'left',
        sortable: true
    },
    {
        name: 'plaza',
        field: 'plaza',
        label: 'Plaza',
        align: 'left',
        sortable: true
    },
]