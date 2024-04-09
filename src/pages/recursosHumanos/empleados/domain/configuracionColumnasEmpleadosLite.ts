import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Empleado } from "./Empleado";

export const configuracionColumnasEmpleadosLite: ColumnConfig<Empleado>[] = [
    {
        name: 'nombres',
        field: 'nombres',
        label: 'Nombres',
        align: 'left',
        sortable: true,
    },
    {
        name: 'apellidos',
        field: 'apellidos',
        label: 'Apellidos',
        align: 'left',
        sortable: true,
    },
]