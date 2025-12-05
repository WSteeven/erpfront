import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { HorarioLaboral } from './HorarioLaboral'

export const configuracionColumnasHorarioLaboral: ColumnConfig<HorarioLaboral>[] =
  [
    {
      name: 'nombre',
      field: 'nombre',
      label: 'Tipo de Horario',
      align: 'left',
      sortable: true
    },
    {
      name: 'dias',
      field: 'dias',
      label: 'Días',
      align: 'left',
      sortable: true
    },
    {
      name: 'hora_entrada',
      field: 'hora_entrada',
      label: 'Hora de Entrada',
      align: 'left',
      sortable: true
    },
    {
      name: 'hora_salida',
      field: 'hora_salida',
      label: 'Hora de Salida',
      align: 'left',
      sortable: true
    },
    {
      name: 'inicio_pausa',
      field: 'inicio_pausa',
      label: 'Inicio Pausa',
      align: 'left',
      sortable: true
    },
    {
      name: 'fin_pausa',
      field: 'fin_pausa',
      label: 'Fin Pausa',
      align: 'left',
      sortable: true
    },
    {
      name: 'es_turno_de_noche',
      field: 'es_turno_de_noche',
      label: '¿Cruza medianoche?',
      align: 'left',
    },{
      name: 'activo',
      field: 'activo',
      label: '¿Activo?',
      align: 'left',
      sortable: true
    }
  ]
