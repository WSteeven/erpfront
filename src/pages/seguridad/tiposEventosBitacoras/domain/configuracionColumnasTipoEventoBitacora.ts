import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { TipoEventoBitacora } from './TipoEventoBitacora'

export const configuracionColumnasTipoEventoBitacora: ColumnConfig<TipoEventoBitacora>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
  },
  {
    name: 'notificacion_inmediata_texto',
    field: 'notificacion_inmediata_texto',
    label: 'Notificar inmediatamente',
    align: 'left',
  },
  {
    name: 'activo',
    field: 'activo',
    label: 'Activo',
    align: 'left',
  }
]
