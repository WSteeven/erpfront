import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Etiqueta } from './Etiqueta'

export const configuracionColumnasEtiquetas: ColumnConfig<Etiqueta>[] = [
    {
        name: 'categoria',
        field: 'categoria',
        label: 'Categoría',
        align: 'left',
        sortable: true,
    },
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Etiqueta',
        align: 'left',
        sortable: true,
    },
]
