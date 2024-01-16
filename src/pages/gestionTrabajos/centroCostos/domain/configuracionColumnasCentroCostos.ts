import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { CentroCosto } from "./CentroCostos";

export const configuracionColumnasCentroCostos: ColumnConfig<CentroCosto>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre',
        align: 'left',
    },
    {
        name: 'cliente',
        field: 'cliente',
        label: 'Cliente',
        align: 'left',
    },
    {
        name: 'activo',
        field: 'activo',
        label: 'Activo',
        align: 'left',
    },
]