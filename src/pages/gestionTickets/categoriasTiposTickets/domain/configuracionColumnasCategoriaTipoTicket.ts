import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { CategoriaTipoTicket } from './CategoriaTipoTicket'

export const configuracionColumnasCategoriaTipoTicket: ColumnConfig<CategoriaTipoTicket>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
  },
  {
    name: 'departamento',
    field: 'departamento',
    label: 'Departamento',
    align: 'left',
  },
]
