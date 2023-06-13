import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ConceptoIngreso } from './ConceptoIngreso'

export const configuracionColumnasConceptoIngreso: ColumnConfig<ConceptoIngreso>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Concepto',
        align: 'left',
        sortable: true
    },
]
