import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Certificacion } from './Certificacion'

export const configuracionColumnasCertificacion: ColumnConfig<Certificacion>[] = [
  {
    name: 'descripcion',
    field: 'descripcion',
    label: 'Descipción',
    align: 'left',
  },
  {
    name: 'activo',
    field: 'activo',
    label: 'Activo',
    align: 'left',
  },
]
