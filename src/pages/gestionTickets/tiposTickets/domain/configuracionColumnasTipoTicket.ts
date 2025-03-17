import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { TipoTicket } from './TipoTicket'

export const configuracionColumnasTipoTicket: ColumnConfig<TipoTicket>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre del tipo de ticket',
    align: 'left',
  },
  {
    name: 'departamento',
    field: 'departamento',
    label: 'Departamento',
    align: 'left',
  },
  {
    name: 'categoria_tipo_ticket',
    field: 'categoria_tipo_ticket',
    label: 'Categoría',
    align: 'left',
  },
  {
    name: 'destinatario',
    field: 'destinatario',
    label: 'Destinatario',
    align: 'left',
  },
  {
    name: 'activo',
    field: 'activo',
    label: 'Activo',
    align: 'left',
  },
]
