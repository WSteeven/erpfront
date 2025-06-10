import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { Garaje } from './Garaje';

export const configuracionColumnasGaraje: ColumnConfig<Garaje>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre',
        align: 'left',
    },
    {
        name: 'activo',
        field: 'activo',
        label: 'Activo',
        align: 'left',
    },
]
