import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { SubcentroCosto } from './SubcentroCosto';

export const configuracionColumnasSubcentroCostos: ColumnConfig<SubcentroCosto>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre',
        align: 'left',
    },
    {
        name: 'centro_costo',
        field: 'centro_costo',
        label: 'Centro de Costos',
        align: 'left',
    },
    {
        name: 'grupo',
        field: 'grupo',
        label: 'Grupo',
        align: 'left',
    },
    {
        name: 'activo',
        field: 'activo',
        label: 'Activo',
        align: 'left',
    },
]