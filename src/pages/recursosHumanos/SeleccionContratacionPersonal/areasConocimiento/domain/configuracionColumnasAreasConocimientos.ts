import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { AreaConocimiento } from "./AreaConocimiento";

export const configuracionColumnasAreasConocimientos: ColumnConfig<AreaConocimiento>[] = [
    {
        name: 'cargo',
        field: 'cargo',
        label: 'Cargo',
        align: 'left',
        sortable: true
    },
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre',
        align: 'left',
        sortable: true
    },
    {
        name: 'activo',
        field: 'activo',
        label: '¿Activo?',
        align: 'left',
        sortable: true
    },
]
