import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Bitacora } from './Bitacora'

export const configuracionColumnasBitacora: ColumnConfig<Bitacora>[] = [
  {
    name: 'zona',
    field: 'zona',
    label: 'Zona',
    align: 'left',
  },
  {
    name: 'jornada',
    field: 'jornada',
    label: 'Jornada',
    align: 'left',
  },
  {
    name: 'fecha_hora_inicio_turno',
    field: 'fecha_hora_inicio_turno',
    label: 'Fecha y hora de inicio de turno',
    align: 'left',
  },
  {
    name: 'fecha_hora_fin_turno',
    field: 'fecha_hora_fin_turno',
    label: 'Fecha y hora de fin de turno',
    align: 'left',
  },
  {
    name: 'agente_turno',
    field: 'agente_turno',
    label: 'Agente de turno',
    align: 'left',
  },
  {
    name: 'protector',
    field: 'protector',
    label: 'Protector',
    align: 'left',
  },
  {
    name: 'conductor',
    field: 'conductor',
    label: 'Conductor',
    align: 'left',
  },
  {
    name: 'observaciones',
    field: 'observaciones',
    label: 'Observaciones',
    align: 'left',
  }
]
