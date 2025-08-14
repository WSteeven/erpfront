import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Bitacora } from './Bitacora'

export const configuracionColumnasBitacora: ColumnConfig<Bitacora>[] = [
  {
    name: 'zona',
    field: 'zona',
    label: 'Zona',
    align: 'left',
    type: 'text',
    operador: 'like',
    sortable: true
  },
  {
    name: 'jornada',
    field: 'jornada',
    label: 'Jornada',
    align: 'left',
    type: 'text',
    operador: 'like',
    sortable: true
  },
  {
    name: 'fecha_hora_inicio_turno',
    field: 'fecha_hora_inicio_turno',
    label: 'Fecha y hora de inicio de turno',
    align: 'left',
    type: 'date',
    operador: '=',
    sortable: true
  },
  {
    name: 'fecha_hora_fin_turno',
    field: 'fecha_hora_fin_turno',
    label: 'Fecha y hora de fin de turno',
    align: 'left',
    type: 'date',
    operador: '=',
    sortable: true
  },
  {
    name: 'agente_turno',
    field: 'agente_turno',
    label: 'Agente de turno',
    align: 'left',
    operador: 'like',
    sortable: true
  },
  {
    name: 'protector',
    field: 'protector',
    label: 'Protector',
    align: 'left',
    operador: 'like',
    sortable: true
  },
  {
    name: 'conductor',
    field: 'conductor',
    label: 'Conductor',
    align: 'left',
    operador: 'like',
    sortable: true
  },
  {
    name: 'observaciones',
    field: 'observaciones',
    label: 'Observaciones',
    align: 'left',
    type: 'text',
    operador: 'like',
    sortable: true
  },
  {
    name: 'revisado_por_supervisor',
    field: 'revisado_por_supervisor',
    label: 'Revisado por supervisor',
    align: 'left',
    type: 'select',
    operador: '=',
    filtrar: true,
    sortable: true,
    options: [
      { label: 'Revisado', value: 1 },
      { label: 'No revisado', value: 0 }
    ],
    formato: val => (val ? 'Revisado' : 'No revisado'),
    filtro: (val, update) => {
      // 👇 Extrae solo el value
      update(val?.value ?? null)
    }
  }
]
