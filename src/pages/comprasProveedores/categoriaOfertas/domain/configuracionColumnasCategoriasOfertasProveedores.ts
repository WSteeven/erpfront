import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { CategoriaOferta } from './CategoriaOferta';

export const configuracionColumnasCategoriasOfertasProveedores: ColumnConfig<CategoriaOferta>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre',
        align: 'left',
        sortable: true,
    },
    {
        name: 'tipo_oferta',
        field: 'tipo_oferta',
        label: 'Tipo',
        align: 'left',
        sortable: true,
    },
    {
        name: 'estado',
        field: 'estado',
        label: 'Estado',
        align: 'left',
        sortable: true,
    },
]