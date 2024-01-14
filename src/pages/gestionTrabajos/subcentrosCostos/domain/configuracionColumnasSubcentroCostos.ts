import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { SubcentroCosto } from "./SubcentroCosto";

export const configuracionColumnasSubcentroCostos: ColumnConfig<SubcentroCosto>[] = [
    {
        name: 'centro_costo',
        field: 'centro_costo',
        label: 'Centro de Costos',
        align: 'left',
    },
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Subcentro de Costos',
        align: 'left',
    },
    {
        name: 'activo',
        field: 'activo',
        label: 'Activo',
        align: 'left',
    },
]