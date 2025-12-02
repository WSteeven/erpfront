import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ConceptoIngreso } from './ConceptoIngreso'

export const configuracionColumnasConceptoIngreso: ColumnConfig<ConceptoIngreso>[] =
  [
    {
      name: 'nombre',
      field: 'nombre',
      label: 'Concepto',
      align: 'left',
      sortable: true
    },
    {
      name: 'calculable_iess',
      field: 'calculable_iess',
      label: 'Calculable IESS',
      align: 'left',
      sortable: true
    },{
      name: 'abreviatura',
      field: 'abreviatura',
      label: 'Abreviatura',
      align: 'left',
      sortable: true
    }
  ]
